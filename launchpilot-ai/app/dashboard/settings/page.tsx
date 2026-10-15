import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { SettingsWorkspace } from '@/components/settings-workspace';
export const metadata: Metadata = { title: 'Settings' };
export default async function SettingsPage() { const user = await requireUser(); return <SettingsWorkspace name={user.name} email={user.email} createdAt={user.createdAt.toISOString()}/>; }
