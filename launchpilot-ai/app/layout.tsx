import type { Metadata } from 'next';
import './globals.css';
import { APP_NAME, TAGLINE } from '@/lib/constants';

export const metadata: Metadata = {
  title: { default: `${APP_NAME} — ${TAGLINE}`, template: `%s | ${APP_NAME}` },
  description: 'Turn digital product ideas into launch-ready plans, sales assets, and organized campaigns.',
  applicationName: APP_NAME,
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
