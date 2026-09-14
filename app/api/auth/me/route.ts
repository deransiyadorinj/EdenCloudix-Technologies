import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'fallback-secret-change-in-production'
);

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecx_client_session')?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);
    return NextResponse.json({
      authenticated: true,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture || null,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
