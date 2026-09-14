import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { adminLoginSchema } from '@/lib/validations';
import { createSession, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid credentials' }, { status: 422 });

  const { email, password } = parsed.data;

  // Admin credentials from environment only
  const adminEmail = process.env.ADMIN_EMAIL;
  let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';

  if (process.env.ADMIN_PASSWORD_HASH_B64) {
    try {
      adminPasswordHash = Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64, 'base64').toString('utf8');
    } catch {
      // ignore
    }
  } else if (adminPasswordHash.startsWith('JDJi')) {
    try {
      adminPasswordHash = Buffer.from(adminPasswordHash, 'base64').toString('utf8');
    } catch {
      // ignore
    }
  }

  if (!adminEmail || !adminPasswordHash) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }

  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const compareFn = typeof bcrypt.compare === 'function' ? bcrypt.compare : (bcrypt as any).default?.compare;
  const valid = await compareFn(password, adminPasswordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSession(`admin-${Date.now()}`);

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return response;
}
