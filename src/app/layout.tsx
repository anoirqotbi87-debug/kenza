import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
