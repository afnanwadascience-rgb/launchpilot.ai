'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Lightbulb, ClipboardList, FileText, BadgeDollarSign, Megaphone, CalendarDays, Search, FolderKanban, CreditCard, Settings, LogOut, Menu, X, Compass, ChevronRight, type LucideIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

type Props = { user: { name: string; email: string }; plan: 'FREE' | 'PRO' };
type NavItem = { href: string; label: string; icon: LucideIcon };
const primary = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/idea-validator', label: 'Idea Validator', icon: Lightbulb },
  { href: '/dashboard/product-blueprint', label: 'Product Blueprint', icon: ClipboardList },
  { href: '/dashboard/sales-page-generator', label: 'Sales Page Generator', icon: FileText },
  { href: '/dashboard/pricing-assistant', label: 'Pricing Assistant', icon: BadgeDollarSign },
  { href: '/dashboard/marketing-kit', label: 'Marketing Kit', icon: Megaphone }
];
const workspace = [
  { href: '/dashboard/calendar', label: 'Launch Calendar', icon: CalendarDays },
  { href: '/dashboard/competitors', label: 'Competitor Tracker', icon: Search },
  { href: '/dashboard/projects', label: 'Saved Projects', icon: FolderKanban },
  { href: '/dashboard/billing', label: 'Usage & Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings }
];

export function DashboardShell({ user, plan, children }: React.PropsWithChildren<Props>) {
  const pathname = usePathname(); const [menuOpen, setMenuOpen] = useState(false); const [loggingOut, setLoggingOut] = useState(false);
  const activeTitle = [...primary, ...workspace].find((item) => item.href === pathname)?.label || 'Workspace';
  async function logout() { setLoggingOut(true); try { await fetch('/api/auth/logout', { method: 'POST' }); window.location.assign('/'); } finally { setLoggingOut(false); } }
  const nav = (items: readonly NavItem[]) => items.map((item) => {
    const active = item.href === '/dashboard' ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/');
    return <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`sidebar-link${active ? ' active' : ''}`}><item.icon size={16}/><span>{item.label}</span>{active ? <ChevronRight size={13} style={{ marginLeft: 'auto' }}/> : null}</Link>;
  });
  return <div className="dashboard-layout"><aside className="dash-sidebar"><div className="sidebar-brand"><Link href="/dashboard" className="brand"><span className="brand-mark"><Compass size={20}/></span><span style={{ fontSize: 16 }}>LaunchPilot AI</span></Link></div><div className="sidebar-section"><div className="sidebar-caption">Workspace</div>{nav(primary)}</div><div className="sidebar-section"><div className="sidebar-caption">Manage</div>{nav(workspace)}</div><div className="sidebar-bottom"><div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 5px 13px' }}><span className="avatar">{user.name.trim().slice(0, 1).toUpperCase() || 'U'}</span><div style={{ minWidth: 0 }}><strong style={{ display: 'block', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</strong><span className={`badge ${plan === 'PRO' ? 'badge-pro' : ''}`}>{plan === 'PRO' ? 'Pro plan' : 'Free plan'}</span></div></div><button type="button" className="sidebar-link" style={{ width: '100%', border: 0, background: 'transparent', cursor: 'pointer' }} onClick={logout} disabled={loggingOut}><LogOut size={16}/>{loggingOut ? 'Signing out…' : 'Sign out'}</button></div></aside>
  <main className="dash-main"><header className="dash-header"><div className="dash-header-left"><button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X size={18}/> : <Menu size={18}/>}</button><div><div className="dash-breadcrumb">Workspace / {activeTitle}</div><strong style={{ fontSize: 14 }}>{activeTitle}</strong></div></div><div className="dash-header-actions"><ThemeToggle/>{plan !== 'PRO' ? <Link href="/dashboard/billing" className="btn btn-small">Upgrade to Pro <CreditCard size={14}/></Link> : <span className="badge badge-pro">Pro plan active</span>}</div></header>{menuOpen ? <div className="mobile-overlay" style={{ position: 'fixed', inset: '62px 0 0', zIndex: 45, background: 'var(--surface)', padding: 16, overflowY: 'auto' }}><div className="sidebar-section"><div className="sidebar-caption">Workspace</div>{nav(primary)}</div><div className="sidebar-section" style={{ marginTop: 15 }}><div className="sidebar-caption">Manage</div>{nav(workspace)}</div><button className="sidebar-link" onClick={logout} style={{ marginTop: 15 }}><LogOut size={16}/>{loggingOut ? 'Signing out…' : 'Sign out'}</button></div> : null}<div className="dash-content">{children}</div><nav className="mobile-nav" aria-label="Mobile navigation">{[{href:'/dashboard',label:'Home',icon:LayoutDashboard},{href:'/dashboard/idea-validator',label:'Validate',icon:Lightbulb},{href:'/dashboard/calendar',label:'Calendar',icon:CalendarDays},{href:'/dashboard/projects',label:'Projects',icon:FolderKanban},{href:'/dashboard/billing',label:'Billing',icon:CreditCard}].map((item) => <Link key={item.href} href={item.href} className={pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}><item.icon size={18}/><span>{item.label}</span></Link>)}</nav></main></div>;
}
