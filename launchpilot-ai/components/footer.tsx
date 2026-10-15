import Link from 'next/link';
import { Brand } from '@/components/brand';

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Brand/><p>Practical tools to move your digital product from first idea to a clear launch plan.</p></div><nav className="footer-links" aria-label="Footer navigation"><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/refunds">Refund policy</Link></nav></div><div className="copyright">© {new Date().getFullYear()} LaunchPilot AI. Product outputs are suggestions, not guarantees of market demand or commercial results.</div></div></footer>;
}
