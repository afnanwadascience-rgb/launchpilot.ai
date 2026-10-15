import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CheckoutLink } from '@/components/checkout-link';

const free = ['3 AI generations total', '3 saved projects', 'Idea validation', 'Basic product blueprint', 'Launch task checklist'];
const pro = ['100 AI generations per billing period', 'Up to 100 saved projects', 'Full sales page generator', 'Pricing hypotheses and tier planning', 'Marketing kit for social and email', 'Expanded launch planning and exports'];

export function PricingSection() {
  return <div className="pricing-grid">
    <article className="pricing-card"><div className="pricing-pill">Start here</div><div className="pricing-title">Free</div><div className="pricing-price">$0 <span>/ forever</span></div><p className="pricing-desc">Validate an idea and map the first steps.</p><Link href="/register" className="btn btn-secondary" style={{ width: '100%' }}>Start building free</Link><ul className="pricing-features">{free.map((item) => <li key={item}><Check size={15}/>{item}</li>)}</ul></article>
    <article className="pricing-card featured"><div className="pricing-pill"><Sparkles size={12} style={{ marginRight: 5 }}/> For serious launches</div><div className="pricing-title">Pro</div><div className="pricing-price">Pro plan <span>/ via Whop</span></div><p className="pricing-desc">More room to create, plan, and promote.</p><CheckoutLink label="Get Pro" className="btn"/><ul className="pricing-features">{pro.map((item) => <li key={item}><Check size={15}/>{item}</li>)}</ul><p className="muted" style={{ fontSize: 11 }}>Checkout and billing are handled by Whop. Pro unlocks only after server-side membership verification.</p></article>
  </div>;
}
