import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlanContext } from '@/lib/usage';
import { BillingWorkspace } from '@/components/billing-workspace';
export const metadata: Metadata = { title: 'Usage & Billing' };
export default async function BillingPage() {
  const user = await requireUser();
  const [usage, subscription] = await Promise.all([
    getPlanContext(user.id),
    db.subscription.findUnique({ where: { userId: user.id }, select: { status: true, lastVerifiedAt: true, currentPeriodEnd: true, whopMembershipId: true } })
  ]);
  return <BillingWorkspace userEmail={user.email} plan={usage.plan} status={subscription?.status || 'FREE'} used={usage.used} remaining={usage.remaining} limit={usage.limit} periodEnd={subscription?.currentPeriodEnd?.toISOString() || null} lastVerified={subscription?.lastVerifiedAt?.toISOString() || null} membershipId={subscription?.whopMembershipId || null} proConfigured={Boolean((process.env.WHOP_COMPANY_API_KEY || process.env.WHOP_API_KEY) && process.env.WHOP_COMPANY_ID && process.env.WHOP_PRODUCT_ID && process.env.WHOP_PRO_PLAN_ID)}/>;
}
