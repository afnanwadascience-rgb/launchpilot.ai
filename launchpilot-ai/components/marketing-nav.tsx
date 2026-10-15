import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Brand } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';
import { getCurrentUser } from '@/lib/auth';

export async function MarketingNav() {
  const user = await getCurrentUser().catch(() => null);
  return <header className="site-header"><div className="container nav-inner">
    <Brand/>
    <nav className="nav-links" aria-label="Main navigation"><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav>
    <div className="nav-actions"><ThemeToggle/><Link className="btn btn-ghost btn-small hide-mobile" href={user ? '/dashboard' : '/login'}>{user ? 'Dashboard' : 'Sign in'}</Link><Link className="btn btn-small" href={user ? '/dashboard' : '/register'}>{user ? 'Open app' : 'Start free'} <ArrowUpRight size={15}/></Link></div>
  </div></header>;
}
