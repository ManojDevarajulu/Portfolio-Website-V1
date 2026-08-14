import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manoj D — AI Developer & Full-Stack Engineer",
  description:
    "AI Developer and Full-Stack Engineer with 2 years of experience building production AI applications for healthcare SaaS platforms — agentic systems, RAG pipelines, and LLM automation. Based in Chennai, India.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/android-chrome-512x512.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/android-chrome-512x512.png",
    apple: "/android-chrome-512x512.png",
  },
  openGraph: {
    title: "Manoj D — AI Developer & Full-Stack Engineer (Open to Work)",
    description:
      "AI Developer and Full-Stack Engineer with 2 years of experience building production AI applications for healthcare SaaS platforms — agentic systems, RAG pipelines, and LLM automation.",
    type: "website",
    url: "https://manojdevarajulu.cc",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manoj D — AI Developer & Full-Stack Engineer",
    description:
      "Systems-first AI engineer & full-stack developer. Building production AI applications for healthcare SaaS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[var(--bg)] text-[var(--text)] antialiased selection:bg-emerald-500/20 selection:text-emerald-300"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
