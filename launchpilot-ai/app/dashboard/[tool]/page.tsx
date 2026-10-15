import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isAiTool, TOOL_DETAILS } from '@/lib/constants';
import { ToolWorkspace } from '@/components/tool-workspace';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  return { title: isAiTool(tool) ? TOOL_DETAILS[tool].title : 'Workspace' };
}
export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  if (!isAiTool(tool)) notFound();
  const details = TOOL_DETAILS[tool];
  return <ToolWorkspace tool={tool} title={details.title} description={details.description} proOnly={details.pro}/>;
}
