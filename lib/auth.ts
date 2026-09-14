import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'fallback-secret-change-in-production'
);

const COOKIE_NAME = 'ecx_admin_session';

export async function createSession(adminId: string): Promise<string> {
  const token = await new SignJWT({ adminId, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
  return token;
}

export async function verifySession(token: string): Promise<{ adminId: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { adminId: string; role: string };
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<{ adminId: string; role: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export { COOKIE_NAME };
