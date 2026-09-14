import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');

function getBookings() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading bookings:', err);
  }
  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const emailQuery = searchParams.get('email')?.trim().toLowerCase();

  if (!emailQuery) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  const bookings = getBookings();
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
    createdAt: b.createdAt,
    updatedAt: b.updatedAt || b.createdAt,
  }));

  return NextResponse.json({
    success: true,
    email: emailQuery,
    count: formatted.length,
    projects: formatted,
  });
}
