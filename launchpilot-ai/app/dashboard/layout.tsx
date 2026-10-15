import { requireUser } from '@/lib/auth';
import { getPlanContext } from '@/lib/usage';
import { DashboardShell } from '@/components/dashboard-shell';

export const dynamic = 'force-dynamic';
export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  const context = await getPlanContext(user.id);
  return <DashboardShell user={{ name: user.name, email: user.email }} plan={context.plan}>{children}</DashboardShell>;
}
