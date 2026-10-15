import type { Metadata } from 'next';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';
import { PricingSection } from '@/components/pricing-section';
export const metadata: Metadata = { title: 'Pricing' };
export default function PricingPage() { return <><MarketingNav/><main><section className="page-hero"><div className="container"><div className="eyebrow">Simple plans</div><h1>Room to launch at your own pace.</h1><p>Start free. Upgrade when the content toolkit and higher AI allowance become useful to your workflow. Plan limits are enforced on the server.</p></div></section><section className="page-section"><div className="container"><PricingSection/><div className="plain-card" style={{ maxWidth: 850, margin: '20px auto 0' }}><strong style={{ fontSize: 14 }}>How the limits work</strong><p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>Free includes 3 successful AI generations total. Pro includes 100 generations per verified billing period. Failed AI requests do not count. A checkout click alone never activates Pro access.</p></div></div></section></main><Footer/></>; }
