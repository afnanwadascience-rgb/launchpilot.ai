'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowRight, Compass, Eye, EyeOff } from 'lucide-react';
import { Brand } from '@/components/brand';

type Props = { mode: 'login' | 'register' };
export function AuthForm({ mode }: Props) {
  const registering = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const endpoint = registering ? '/api/auth/register' : '/api/auth/login';
      const body = registering ? { name, email, password } : { email, password };
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      const next = new URLSearchParams(window.location.search).get('next');
      window.location.assign(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  return <div className="auth-wrap"><aside className="auth-side"><div><Brand light/><div style={{ marginTop: 75 }}><div className="eyebrow" style={{ color: '#bdcaff' }}><span className="eyebrow-dot" style={{ background: '#bdcaff' }}/> A calmer way to launch</div><h1>Build the plan. Then make it real.</h1><p>Keep your product thinking, content drafts, and launch tasks in one clear workspace.</p></div></div><div style={{ color: '#9caecc', fontSize: 12 }}>From idea to launch, intelligently.</div></aside><main className="auth-main"><div className="auth-card"><Link href="/" className="brand" style={{ fontSize: 15 }}><span className="brand-mark"><Compass size={19}/></span>LaunchPilot AI</Link><h2>{registering ? 'Create your workspace' : 'Welcome back'}</h2><p>{registering ? 'Start with your idea. You can change direction any time.' : 'Sign in to continue working on your launch.'}</p><form onSubmit={submit}>
    {error ? <div className="form-error" role="alert">{error}</div> : null}
    {registering ? <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} minLength={1} maxLength={80} required placeholder="Alex Morgan"/></div> : null}
    <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} required placeholder="you@example.com"/></div>
    <div className="field"><label htmlFor="password">Password</label><div style={{ position: 'relative' }}><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={registering ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} minLength={registering ? 12 : 1} maxLength={128} required placeholder={registering ? 'At least 12 characters' : 'Your password'} style={{ paddingRight: 45 }}/><button className="icon-btn" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 5, top: 4, width: 35, height: 35, border: 0, background: 'transparent' }}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div>{registering ? <small>Use at least 12 characters for a stronger password.</small> : null}</div>
    <button className="btn btn-large" type="submit" disabled={loading} style={{ width: '100%', marginTop: 5 }}>{loading ? 'Please wait…' : registering ? 'Create account' : 'Sign in'} {!loading ? <ArrowRight size={16}/> : null}</button>
  </form><div className="form-note">{registering ? <>Already have an account? <Link href="/login" className="text-link">Sign in</Link></> : <>New to LaunchPilot? <Link href="/register" className="text-link">Create an account</Link></>}</div><p className="form-note" style={{ marginTop: 20 }}>By continuing, you agree to our <Link href="/terms" className="text-link">Terms</Link> and <Link href="/privacy" className="text-link">Privacy Policy</Link>.</p></div></main></div>;
}
