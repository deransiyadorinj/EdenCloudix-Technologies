import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';
import { sendWhatsAppNotification } from '@/lib/notifications';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const notification = await prisma.notification.findUnique({
    where: { id },
    include: { bookingRequest: true },
  });

  if (!notification) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  if (notification.status === 'SENT') return NextResponse.json({ error: 'Already sent' }, { status: 400 });

  if (notification.type !== 'WHATSAPP') {
    return NextResponse.json(
      { error: 'Email notifications are disabled. Only WhatsApp notifications are active.' },
      { status: 400 }
    );
  }

  const booking = notification.bookingRequest;
  const notifData = {
    requestId: booking.requestId,
    domain: booking.domain,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    company: booking.company,
    projectTitle: booking.projectTitle,
    projectDescription: booking.projectDescription,
    budget: booking.budget,
    timeline: booking.timeline,
    createdAt: booking.createdAt,
  };

  const result = await sendWhatsAppNotification(notifData);

  const updated = await prisma.notification.update({
    where: { id },
    data: {
      status: result.success ? 'SENT' : 'FAILED',
      errorMessage: result.error || null,
      sentAt: result.success ? new Date() : null,
    },
  });

  return NextResponse.json({ notification: updated, success: result.success });
}
