import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const display = localFont({
  src: "./fonts/BigShouldersDisplay.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-display-face",
  fallback: ["Arial Narrow", "Helvetica Neue", "Arial", "sans-serif"],
});

const body = localFont({
  src: "./fonts/HankenGrotesk.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-body-face",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.links.linkedin.href }],
  creator: site.name,
  keywords: [
    "Arsene Karema",
    "Senior Full Stack Engineer",
    "Full Stack Developer Kigali",
    "Rwanda software engineer",
    "React",
    "Next.js",
    "NestJS",
    "PostgreSQL",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_GB",
    firstName: "Arsene",
    lastName: "Karema",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1E2124",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Browser extensions (e.g. LanguageTool, ColorZilla) inject attributes on <html>/<body> before
    // React hydrates. This suppresses only those elements' own attribute mismatches, not their children's.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
