import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://efootball-coach.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "eFootball Coach — AI Tactical Advisor",
    template: "%s | eFootball Coach",
  },
  description:
    "Get personalized eFootball 2026 tactics, formations, and AI coaching based on your playstyle. Build your squad, set up tactics, and dominate the game.",
  keywords: [
    "efootball",
    "efootball 2026",
    "tactics",
    "formations",
    "AI coach",
    "konami",
  ],
  authors: [{ name: "eFootball Coach" }],
  openGraph: {
    title: "eFootball Coach — AI Tactical Advisor",
    description: "Personalized AI-powered tactics for eFootball 2026",
    type: "website",
    url: siteUrl,
    siteName: "eFootball Coach",
  },
  twitter: {
    card: "summary_large_image",
    title: "eFootball Coach — AI Tactical Advisor",
    description: "Personalized AI-powered tactics for eFootball 2026",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh flex flex-col antialiased">{children}</body>
    </html>
  );
}
