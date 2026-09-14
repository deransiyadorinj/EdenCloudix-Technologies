import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bookingSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';

function generateRequestId(domain: string, count: number): string {
  const year = new Date().getFullYear();
  const prefix = domain === 'AI' ? 'AI' : domain === 'FULL_STACK' ? 'FS' : 'CLD';
  const seq = String(count).padStart(4, '0');
  return `ECX-${prefix}-${year}-${seq}`;
}

export async function POST(request: NextRequest) {
  // Rate limiting by IP (in-memory sliding window)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const { success: rateLimitOk, remaining } = rateLimit(ip, { limit: 10, windowMs: 15 * 60 * 1000 });

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
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
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  try {
    // Generate unique request ID
    const count = await prisma.bookingRequest.count();
    const requestId = generateRequestId(data.domain, count + 1);

    // Save project request directly to PostgreSQL database
    const booking = await prisma.bookingRequest.create({
      data: {
        requestId,
        domain: data.domain,
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim() || null,
        company: data.company?.trim() || null,
        projectTitle: data.projectTitle?.trim() || null,
        projectDescription: data.projectDescription.trim(),
        budget: data.budget?.trim() || null,
        timeline: data.timeline?.trim() || null,
        status: 'NEW',
      },
    });

    return NextResponse.json(
      {
        success: true,
        requestId: booking.requestId,
        message: 'Your project request has been received. Our team will review your specifications and contact you.',
      },
      { status: 201, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown booking creation error';
    console.error('Booking creation error:', msg);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
