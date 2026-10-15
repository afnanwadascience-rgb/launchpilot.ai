import { cookies } from 'next/headers';
import { createHmac, randomBytes } from 'node:crypto';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

const COOKIE = process.env.SESSION_COOKIE_NAME || 'lp_session';
const SESSION_TTL_DAYS = 30;

export type SafeUser = { id: string; email: string; name: string; createdAt: Date };

function sessionPepper(): string {
  const secret = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret || secret.length < 32)) throw new Error('SESSION_SECRET must be configured with at least 32 characters in production.');
  return secret || 'development-only-session-pepper-change-before-deploy';
}

export function hashToken(token: string): string {
  return createHmac('sha256', sessionPepper()).update(token).digest('hex');
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { userId, tokenHash, expiresAt } });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt
  });
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  store.set(COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token || token.length > 200) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { user: { select: { id: true, email: true, name: true, createdAt: true } }, expiresAt: true }
  });
  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
    return null;
  }
  return session.user;
}

export async function requireUser(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=%2Fdashboard');
  return user;
}

export async function requireApiUser() {
  const user = await getCurrentUser();
  if (!user) return { user: null, response: Response.json({ error: 'Please sign in to continue.', code: 'UNAUTHENTICATED' }, { status: 401 }) };
  return { user, response: null };
}

export async function ensureSubscriptionRow(userId: string) {
  return db.subscription.upsert({
    where: { userId },
    create: { userId, plan: 'FREE', status: 'FREE' },
    update: {}
  });
}
