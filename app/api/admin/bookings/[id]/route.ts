import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';
import { updateStatusSchema } from '@/lib/validations';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const booking = await prisma.bookingRequest.findUnique({
    where: { id },
    include: { notifications: true },
  });

  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const parsed = updateStatusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid status' }, { status: 422 });

  const booking = await prisma.bookingRequest.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ booking });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await prisma.bookingRequest.delete({ where: { id } });
  return NextResponse.json({ success: true, message: 'Request removed successfully' });
}
