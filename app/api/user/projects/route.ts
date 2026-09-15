import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emailQuery = searchParams.get('email')?.trim().toLowerCase();

    if (!emailQuery) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Find BookingRequest records by user's email, ordered by createdAt descending
    const bookings = await prisma.bookingRequest.findMany({
      where: {
        OR: [
          { email: { equals: emailQuery, mode: 'insensitive' } },
          { email: { contains: emailQuery, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const matched = bookings.filter((b: any) => 
      b.email && b.email.toLowerCase() === emailQuery
    );

    const formatted = matched.map((b: any) => ({
      id: b.id,
      requestId: b.requestId,
      domain: b.domain,
      status: b.status || 'NEW',
      projectTitle: b.projectTitle || (b.domain + ' Implementation'),
      clientName: b.name,
      budget: b.budget,
      timeline: b.timeline,
      createdAt: typeof b.createdAt === 'string' ? b.createdAt : b.createdAt.toISOString(),
      updatedAt: typeof b.updatedAt === 'string' ? b.updatedAt : (b.updatedAt?.toISOString() || (typeof b.createdAt === 'string' ? b.createdAt : b.createdAt.toISOString())),
    }));

    return NextResponse.json({
      success: true,
      email: emailQuery,
      count: formatted.length,
      projects: formatted,
    });
  } catch (error: any) {
    console.error('Error in /api/user/projects:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user projects.' },
      { status: 500 }
    );
  }
}
