import type { Metadata } from 'next';
import { TasksWorkspace } from '@/components/tasks-workspace';
export const metadata: Metadata = { title: 'Launch Calendar' };
export default function CalendarPage() { return <TasksWorkspace/>; }
