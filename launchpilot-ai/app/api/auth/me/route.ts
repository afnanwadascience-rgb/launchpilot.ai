import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getPlanContext } from '@/lib/usage';
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  const usage = await getPlanContext(user.id);
  return NextResponse.json({ user, usage });
}
