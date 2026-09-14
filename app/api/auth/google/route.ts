import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'fallback-secret-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential, email, name, picture } = body;

    let userEmail = email;
    let userName = name;
    let userPicture = picture;

    // If a Google ID Token (credential) is provided, decode JWT payload
    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          if (payload.email) userEmail = payload.email;
          if (payload.name) userName = payload.name;
          if (payload.picture) userPicture = payload.picture;
        }
      } catch (err) {
        console.warn('Failed to parse Google credential token:', err);
      }
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'Valid email is required to sign in' }, { status: 400 });
    }

    // Generate client session JWT
    const token = await new SignJWT({
      email: userEmail.toLowerCase(),
      name: userName || userEmail.split('@')[0],
      picture: userPicture || null,
      role: 'client',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(SECRET_KEY);

    const response = NextResponse.json({
      success: true,
      user: {
        email: userEmail.toLowerCase(),
        name: userName || userEmail.split('@')[0],
        picture: userPicture || null,
      },
    });

    response.cookies.set('ecx_client_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Authentication error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('ecx_client_session');
  return response;
}
