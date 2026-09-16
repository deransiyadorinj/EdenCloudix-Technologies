import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { quickMessageSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';

function generateRequestId(count: number): string {
  const year = new Date().getFullYear();
  const seq = String(count).padStart(4, '0');
  return `ECX-MSG-${year}-${seq}`;
}

export async function POST(request: NextRequest) {
  // Rate limiting by IP (sliding window)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const { success: rateLimitOk, remaining } = rateLimit(ip, { limit: 10, windowMs: 15 * 60 * 1000 });

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: 'Too many messages sent. Please wait a few minutes before trying again.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Server-side Zod validation
  const parsed = quickMessageSchema.safeParse(body);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues.map((i) => i.message).join('. ');
    return NextResponse.json(
      { error: errorDetails || 'Validation failed' },
      { status: 422 }
    );
  }

  const { name, email, message } = parsed.data;

  try {
    // Generate unique request ID following ECX convention
    const count = await prisma.bookingRequest.count();
    const requestId = generateRequestId(count + 1);

    // Save Quick Message to the existing booking_requests table
    const booking = await prisma.bookingRequest.create({
      data: {
        requestId,
        domain: 'FULL_STACK',
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: null,
        company: null,
        projectTitle: 'Quick Message',
        projectDescription: message.trim(),
        budget: 'Quick Message',
        timeline: 'General Inquiry',
        status: 'NEW',
      },
    });

    return NextResponse.json(
      {
        success: true,
        requestId: booking.requestId,
        message: 'Your message has been received. We will get back to you soon.',
      },
      { status: 201, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Quick message creation error:', msg);
    return NextResponse.json(
      { error: 'Failed to send your message. Please try again later.' },
      { status: 500 }
    );
  }
}
