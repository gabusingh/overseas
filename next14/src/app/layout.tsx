import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalStateProvider } from '../contexts/GlobalProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Overseas.ai — Jobs, Training, and Overseas Opportunities",
  description: "Discover jobs, training programs, and placement support. Modernized with Next.js 14 for performance and SEO.",
  metadataBase: new URL("https://www.overseas.ai"),
  openGraph: {
    title: "Overseas.ai — Jobs, Training, and Overseas Opportunities",
    description:
      "Discover jobs, training programs, and placement support. Modernized with Next.js 14 for performance and SEO.",
    type: "website",
    url: "https://www.overseas.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Overseas.ai — Jobs, Training, and Overseas Opportunities",
    description:
      "Discover jobs, training programs, and placement support. Modernized with Next.js 14 for performance and SEO.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalStateProvider>
          {children}
        </GlobalStateProvider>
      </body>
    </html>
  );
}
