import type { Metadata } from 'next';
import { CompetitorsWorkspace } from '@/components/competitors-workspace';
export const metadata: Metadata = { title: 'Competitor Tracker' };
export default function CompetitorsPage() { return <CompetitorsWorkspace/>; }
