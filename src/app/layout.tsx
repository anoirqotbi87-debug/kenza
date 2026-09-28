import type { Metadata } from "next";
import "./globals.css";
import I18nProvider from '../components/I18nProvider';
import NetworkStatus from '../components/NetworkStatus';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Arabic:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#f7f5ef" />
      </head>
      <body className="antialiased">
        <I18nProvider>
          <NetworkStatus />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
