import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MILESTONE_MAP: Record<string, { step: number; percent: number; label: string; description: string }> = {
  NEW: {
    step: 1,
    percent: 20,
    label: 'Request Submitted',
    description: 'Your project specifications have been securely recorded. Our solutions architect is reviewing scope and resource allocation.'
  },
  CONTACTED: {
    step: 2,
    percent: 40,
    label: 'Under Review',
    description: 'Our engineering lead has reviewed your request and our team is preparing a tailored architecture blueprint.'
  },
  IN_DISCUSSION: {
    step: 3,
    percent: 60,
    label: 'Technical Consultation',
    description: 'We are aligning on technical requirements, infrastructure specifications, and development milestones.'
  },
  IN_PROGRESS: {
    step: 4,
    percent: 80,
    label: 'Development & Build',
    description: 'Active sprint execution in progress. Cloud infrastructure, application modules, and security policies are being deployed.'
  },
  COMPLETED: {
    step: 5,
    percent: 100,
    label: 'Project Completed',
    description: 'All deliverables, source code repositories, cloud infrastructure, and documentation have been successfully delivered and verified.'
  },
  CANCELLED: {
    step: 0,
    percent: 0,
    label: 'Request Closed',
    description: 'This project request has been closed or cancelled.'
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idQuery = searchParams.get('id')?.trim();

    if (!idQuery) {
      return NextResponse.json({ error: 'Tracking ID is required' }, { status: 400 });
    }

    const normalized = idQuery.toUpperCase();

    // Find BookingRequest by either requestId OR id using Prisma
    let found = await prisma.bookingRequest.findUnique({
      where: { requestId: normalized },
    }).catch(() => null);

    if (!found && idQuery !== normalized) {
      found = await prisma.bookingRequest.findUnique({
        where: { requestId: idQuery },
      }).catch(() => null);
    }

    if (!found) {
      found = await prisma.bookingRequest.findUnique({
        where: { id: idQuery },
      }).catch(() => null);
    }

    if (!found) {
      try {
        found = await prisma.bookingRequest.findFirst({
          where: {
            OR: [
              { requestId: { equals: idQuery, mode: 'insensitive' } },
              { requestId: { equals: normalized, mode: 'insensitive' } },
              { id: idQuery },
            ],
          },
        });
      } catch {
        // Fallback if findFirst is not supported by offline proxy
      }
    }

    if (!found) {
      return NextResponse.json({ 
        error: 'No project found with tracking ID: ' + idQuery + '. Please verify the ID format (e.g., ECX-CLD-2026-0008).' 
      }, { status: 404 });
    }

    const rawStatus = (found.status || 'NEW').toUpperCase();
    const milestone = MILESTONE_MAP[rawStatus] || MILESTONE_MAP.NEW;

    return NextResponse.json({
      success: true,
      project: {
        requestId: found.requestId,
        domain: found.domain,
        status: rawStatus,
        statusLabel: milestone.label,
        description: milestone.description,
        step: milestone.step,
        progressPercent: milestone.percent,
        projectTitle: found.projectTitle || (found.domain + ' Architecture Implementation'),
        clientName: found.name,
        budget: found.budget,
        timeline: found.timeline,
        createdAt: typeof found.createdAt === 'string' ? found.createdAt : found.createdAt.toISOString(),
        updatedAt: typeof found.updatedAt === 'string' ? found.updatedAt : (found.updatedAt?.toISOString() || (typeof found.createdAt === 'string' ? found.createdAt : found.createdAt.toISOString())),
      }
    });
  } catch (error: any) {
    console.error('Error in /api/track:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project tracking details.' },
      { status: 500 }
    );
  }
}
