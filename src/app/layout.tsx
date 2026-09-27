import type { Metadata } from "next";
import { Cairo, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
});

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'], 
  weight: ['400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "KENZA - Apprendre la Darija Marocaine de A à Z",
  applicationName: "KENZA",
  description: "Maîtrisez la Darija marocaine de A à Z avec KENZA : cours interactifs, grammaire et situations réelles.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "KENZA - Apprendre la Darija Marocaine de A à Z",
    description: "Maîtrisez la Darija marocaine de A à Z avec KENZA.",
    type: "website",
  }
};

import "./globals.css";
import I18nProvider from '../components/I18nProvider';
import NetworkStatus from '../components/NetworkStatus';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className={`${playfair.variable} ${plusJakarta.variable} ${cairo.variable}`}>
      <body className="font-sans antialiased bg-[#F7F3EA] text-[#1B2A4A] min-h-screen selection:bg-[#C9A05C]/20 selection:text-[#1B2A4A]">
        <I18nProvider>
          <NetworkStatus />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
