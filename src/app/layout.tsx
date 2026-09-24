import type { Metadata } from "next";
import { Cairo, Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ 
  subsets: ['arabic', 'latin'], 
  weight: ['400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "KENZA — Apprendre la Darija Marocaine de A à Z",
  applicationName: "KENZA",
  description: "Maîtrisez la Darija marocaine de A à Z avec KENZA : cours interactifs, grammaire et situations réelles.",
  manifest: "/manifest.json",
  openGraph: {
    title: "KENZA — Apprendre la Darija Marocaine de A à Z",
    description: "Maîtrisez la Darija marocaine de A à Z avec KENZA.",
    type: "website",
  }
};
import "./globals.css";
import I18nProvider from '../components/I18nProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className={`${inter.variable} ${cairo.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
