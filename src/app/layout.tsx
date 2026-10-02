import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import I18nProvider from '../components/I18nProvider';
import NetworkStatus from '../components/NetworkStatus';
import DirSync from '../components/DirSync';
import TrackingProvider from '../components/TrackingProvider';
import InstallApkBanner from '../components/InstallApkBanner';

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-dm-sans", display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-dm-serif", display: "swap" });
const notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--font-noto-arabic", display: "swap" });

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

import { cookies } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('kenza-lang')?.value || 'fr';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir} className={`${dmSans.variable} ${dmSerif.variable} ${notoArabic.variable}`}>
      <head>
        <meta name="theme-color" content="#f7f5ef" />
      </head>
      <body className="antialiased">
        <InstallApkBanner />
        <DirSync />
        <I18nProvider>
          <NetworkStatus />
          <TrackingProvider>
            {children}
          </TrackingProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
