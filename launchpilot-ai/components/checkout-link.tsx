import { ArrowRight } from 'lucide-react';
import { checkoutUrl } from '@/lib/billing';

export function CheckoutLink({ label = 'Get Pro', className = 'btn', icon = true }: { label?: string; className?: string; icon?: boolean }) {
  return <a href={checkoutUrl()} className={className} aria-label={`${label} — continue to Whop checkout`}>{label}{icon ? <ArrowRight size={15}/> : null}</a>;
}
