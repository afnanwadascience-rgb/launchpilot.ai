import Link from 'next/link';
import { Compass } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" className="brand" aria-label="LaunchPilot AI home" style={light ? { color: '#fff' } : undefined}>
    <span className="brand-mark"><Compass size={20} strokeWidth={2.3} /></span><span>{APP_NAME}</span>
  </Link>;
}
