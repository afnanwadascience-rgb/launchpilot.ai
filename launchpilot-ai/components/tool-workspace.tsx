'use client';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDownToLine, ArrowRight, Check, Copy, FileText, LoaderCircle, LockKeyhole, Sparkles } from 'lucide-react';
import type { AiTool } from '@/lib/constants';

type Field = { key: string; label: string; placeholder: string; hint?: string; multiline?: boolean; required?: boolean; options?: { label: string; value: string }[] };
const common: Record<AiTool, Field[]> = {
  'idea-validator': [
    { key: 'idea', label: 'Product idea', placeholder: 'A Notion template that helps freelance designers manage client handoffs…', multiline: true, required: true },
    { key: 'audience', label: 'Intended audience', placeholder: 'Independent designers with 2–8 active clients', required: true },
    { key: 'problem', label: 'Problem being solved', placeholder: 'Handoffs are inconsistent and take too long', multiline: true, required: true },
    { key: 'category', label: 'Product category', placeholder: 'Template, ebook, course, software…', required: true },
    { key: 'budget', label: 'Optional budget', placeholder: 'e.g. $100–$250' }
  ],
  'product-blueprint': [
    { key: 'idea', label: 'Product idea', placeholder: 'Describe the product and the outcome it should deliver…', multiline: true, required: true },
    { key: 'audience', label: 'Intended audience', placeholder: 'Who is this for?', required: true },
    { key: 'format', label: 'Product format', placeholder: 'Template, ebook, course, subscription…', required: true },
    { key: 'goals', label: 'Desired outcome', placeholder: 'What should a customer be able to do?', multiline: true },
    { key: 'constraints', label: 'Constraints', placeholder: 'Time, budget, tools, or skills to account for…', multiline: true }
  ],
  'sales-page-generator': [
    { key: 'product', label: 'Product details', placeholder: 'What does the product include and how does it work?', multiline: true, required: true },
    { key: 'audience', label: 'Target audience', placeholder: 'Who should buy this?', required: true },
    { key: 'benefits', label: 'Customer benefits', placeholder: 'What problems does it help solve?', multiline: true, required: true },
    { key: 'price', label: 'Price (optional)', placeholder: 'e.g. $19 one-time' },
    { key: 'tone', label: 'Writing tone', placeholder: 'Clear, practical, warm…', required: true }
  ],
  'pricing-assistant': [
    { key: 'product', label: 'Product details', placeholder: 'What does the buyer get?', multiline: true, required: true },
    { key: 'productType', label: 'Product type', placeholder: 'Template, ebook, course, SaaS…', required: true },
    { key: 'audience', label: 'Target audience', placeholder: 'Describe the ideal buyer', required: true },
    { key: 'value', label: 'Customer value', placeholder: 'Time saved, difficulty reduced, outcome supported…', multiline: true, required: true },
    { key: 'competitorPrices', label: 'Competitor prices you observed', placeholder: 'Paste URLs/prices you personally found; leave blank if unknown.', multiline: true },
    { key: 'tiers', label: 'Possible tiers', placeholder: 'e.g. Starter / Complete / Team' }
  ],
  'marketing-kit': [
    { key: 'product', label: 'Product details', placeholder: 'What is it, and what is included?', multiline: true, required: true },
    { key: 'audience', label: 'Target audience', placeholder: 'Who is this intended to help?', required: true },
    { key: 'format', label: 'Content format', placeholder: 'Choose format', required: true, options: [{ label: 'Social posts', value: 'social' }, { label: 'Email campaign', value: 'email' }, { label: 'Launch announcement', value: 'announcement' }, { label: 'Promotional hooks', value: 'hooks' }, { label: 'Content calendar', value: 'calendar' }] },
    { key: 'tone', label: 'Tone', placeholder: 'e.g. useful, direct, friendly', required: true },
    { key: 'platform', label: 'Platform (optional)', placeholder: 'e.g. LinkedIn, Instagram, email' },
    { key: 'goal', label: 'Campaign goal (optional)', placeholder: 'e.g. collect waitlist signups' }
  ]
};

type Project = { id: string; title: string };
type Usage = { plan: string; remaining: number; limit: number };
export function ToolWorkspace({ tool, title, description, proOnly }: { tool: AiTool; title: string; description: string; proOnly: boolean }) {
  const fields = useMemo(() => common[tool], [tool]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [projectId, setProjectId] = useState(''); const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false); const [result, setResult] = useState(''); const [contentId, setContentId] = useState(''); const [error, setError] = useState(''); const [message, setMessage] = useState(''); const [quota, setQuota] = useState<Usage | null>(null);
  useEffect(() => { fetch('/api/projects').then((r) => r.ok ? r.json() : null).then((d: { projects?: Project[] } | null) => setProjects(d?.projects || [])).catch(() => undefined); fetch('/api/auth/me').then((r) => r.ok ? r.json() : null).then((d) => setQuota(d?.usage || null)).catch(() => undefined); }, []);
  function change(key: string, value: string) { setValues((prev) => ({ ...prev, [key]: value })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(''); setMessage(''); setResult(''); setContentId('');
    const idempotency = window.crypto.randomUUID();
    const input = { ...values };
    for (const field of fields) {
      if (field.options && !input[field.key]) input[field.key] = field.options[0]?.value || '';
    }
    try {
      const response = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotency }, body: JSON.stringify({ tool, input, projectId: projectId || null }) });
      const data = await response.json() as { error?: string; result?: string; contentId?: string; quota?: Usage; cached?: boolean };
      if (!response.ok) throw new Error(data.error || 'Unable to generate content.');
      setResult(data.result || ''); setContentId(data.contentId || ''); setQuota(data.quota || null); setMessage(data.cached ? 'Loaded the saved result for this request.' : 'Draft generated and saved to your workspace.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to generate content.'); }
    finally { setLoading(false); }
  }
  async function copyResult() { try { await navigator.clipboard.writeText(result); setMessage('Copied to clipboard.'); } catch { setError('Clipboard access was blocked. Select the output and copy it manually.'); } }
  function exportResult(format: 'md' | 'txt') { const blob = new Blob([result], { type: format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${tool}.${format}`; a.click(); URL.revokeObjectURL(url); }
  return <><div className="dash-title-row"><div><div className="eyebrow">AI workspace {proOnly ? '· Pro' : '· Free + Pro'}</div><h1>{title}</h1><p>{description}</p></div>{quota ? <span className={`badge ${quota.plan === 'PRO' ? 'badge-pro' : ''}`}>{quota.remaining} / {quota.limit} generations left</span> : null}</div>
    {proOnly ? <div className="notice" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><LockKeyhole size={16}/> Pro feature. Access is checked on the server after Whop membership verification. <Link href="/dashboard/billing" className="text-link" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>View plans</Link></div> : null}
    <div className="tool-layout"><section className="panel form-panel"><h2>Tell us about the product</h2><p>Give enough context to get a useful first draft. You can edit the output before using it.</p><form onSubmit={submit}>{fields.map((field) => <div className="field" key={field.key}><label htmlFor={`f-${field.key}`}>{field.label}{field.required ? ' *' : ''}</label>{field.options ? <select id={`f-${field.key}`} value={values[field.key] || field.options[0]?.value || ''} onChange={(e) => change(field.key, e.target.value)} required={field.required}>{field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : field.multiline ? <textarea id={`f-${field.key}`} rows={3} value={values[field.key] || ''} onChange={(e) => change(field.key, e.target.value)} placeholder={field.placeholder} maxLength={4000} required={field.required}/> : <input id={`f-${field.key}`} value={values[field.key] || ''} onChange={(e) => change(field.key, e.target.value)} placeholder={field.placeholder} maxLength={1600} required={field.required}/>}{field.hint ? <small>{field.hint}</small> : null}</div>)}
      <div className="field"><label htmlFor="project-select">Save to project (optional)</label><select id="project-select" value={projectId} onChange={(e) => setProjectId(e.target.value)}><option value="">All saved outputs</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select><small>Outputs are saved automatically. Select a project to associate this output with it.</small></div>
      {error ? <div className="form-error" role="alert">{error}</div> : null}{message ? <div className="notice" role="status">{message}</div> : null}
      <button type="submit" className="btn btn-large" disabled={loading || (proOnly && quota?.plan !== 'PRO')} style={{ width: '100%' }}>{loading ? <><LoaderCircle size={16} className="animate-spin"/> Generating…</> : <><Sparkles size={16}/> Generate draft</>} {!loading ? <ArrowRight size={15}/> : null}</button><p className="form-note">AI suggestions are not market research. Validate claims and assumptions with real customers.</p></form></section>
      <section className="panel result-panel"><div className="panel-head"><div><h2>Your working draft</h2><p>{contentId ? `Saved output ID: ${contentId.slice(0, 8)}…` : 'Your result will appear here.'}</p></div>{result ? <div className="toolbar"><button className="btn btn-secondary btn-small" onClick={copyResult} type="button"><Copy size={13}/> Copy</button><button className="btn btn-secondary btn-small" onClick={() => exportResult('md')} type="button"><ArrowDownToLine size={13}/> .md</button><button className="btn btn-secondary btn-small" onClick={() => exportResult('txt')} type="button"><FileText size={13}/> .txt</button></div> : null}</div><div className="panel-body">{result ? <><div className="result-content">{result}</div><div className="subtle-rule"/><div className="notice"><Check size={14} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 5 }}/> Saved automatically. Find and edit it in <Link className="text-link" href="/dashboard/projects">Saved Projects</Link>.</div></> : <div className="result-empty"><div><div className="empty-state-icon"><Sparkles size={21}/></div><strong style={{ color: 'var(--ink)' }}>Ready when you are</strong><p>Complete the fields and generate a first draft. It is stored in your workspace for later review.</p></div></div>}</div></section></div></>;
}
