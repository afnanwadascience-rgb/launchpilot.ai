import type { Metadata } from 'next';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';
import { ContactForm } from '@/components/contact-form';
export const metadata: Metadata = { title: 'Contact' };
export default function ContactPage() { return <><MarketingNav/><main><section className="page-hero"><div className="container"><div className="eyebrow">Contact</div><h1>Send a note to the team.</h1><p>Questions about the product, billing workflow, or a bug? Use the form and your message will be saved for review.</p></div></section><section className="page-section"><div className="container"><ContactForm/></div></section></main><Footer/></>; }
