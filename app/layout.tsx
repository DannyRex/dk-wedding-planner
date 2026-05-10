import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import StoreInitializer from '@/components/StoreInitializer';
import AppShell from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Daniel & Kelechi — Wedding Planner',
  description: 'A soft luxury wedding planner for Daniel & Kelechi — court, traditional and white wedding.',
  openGraph: {
    title: 'Daniel & Kelechi — Wedding Planner',
    description: 'Planning our perfect celebration — court, traditional and white wedding.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="h-full flex bg-cream">
        <StoreInitializer />
        <Navigation />
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
