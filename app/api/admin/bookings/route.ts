import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (domain && ['AI', 'FULL_STACK', 'CLOUD'].includes(domain)) where.domain = domain;
  if (status && ['NEW','CONTACTED','IN_DISCUSSION','IN_PROGRESS','COMPLETED','CANCELLED'].includes(status)) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { requestId: { contains: search, mode: 'insensitive' } },
      { projectTitle: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.bookingRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { notifications: { select: { id: true, type: true, status: true, errorMessage: true, sentAt: true } } },
    }),
    prisma.bookingRequest.count({ where }),
  ]);

  return NextResponse.json({ bookings, total, page, pages: Math.ceil(total / limit) });
}
