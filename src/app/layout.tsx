import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalStateProvider } from '../contexts/GlobalProvider';
import { CookieConsent } from '../components/CookieConsent';
import { Toaster } from '@/components/ui/sonner';
import { StructuredData } from '../components/SEOComponents';
import { generateOrganizationLD, generateWebsiteLD } from '../utils/seo.utils';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

export const metadata: Metadata = {
  title: "Overseas.ai - Find International Jobs & Career Opportunities",
  description: "Find your dream job abroad with Overseas.ai. Discover thousands of international job opportunities, training programs, and career support services. Connect with top employers worldwide.",
  keywords: [
    "overseas jobs",
    "international careers", 
    "job abroad",
    "global employment",
    "work overseas",
    "international job opportunities",
    "career abroad",
    "overseas recruitment",
    "global jobs",
    "international training"
  ].join(", "),
  authors: [{ name: "Overseas.ai Team" }],
  creator: "Overseas.ai Team",
  publisher: "Overseas.ai",
  metadataBase: new URL("https://www.overseas.ai"),
  alternates: {
    canonical: "https://www.overseas.ai"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.overseas.ai",
    siteName: "Overseas.ai",
    title: "Overseas.ai - Find International Jobs & Career Opportunities",
    description: "Find your dream job abroad with Overseas.ai. Discover thousands of international job opportunities, training programs, and career support services.",
    images: [
      {
        url: "https://www.overseas.ai/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Overseas.ai - International Job Opportunities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@overseasai",
    creator: "@overseasai",
    title: "Overseas.ai - Find International Jobs & Career Opportunities",
    description: "Find your dream job abroad with Overseas.ai. Discover thousands of international job opportunities and career support services.",
    images: ["https://www.overseas.ai/images/og-image.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  other: {
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="dns-prefetch" href="//backend.overseas.ai" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Font Awesome - preload for performance */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        
        {/* Viewport meta for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Theme and app colors */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Language and locale */}
        <meta httpEquiv="content-language" content="en-US" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Service Worker Registration - Temporarily disabled */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Unregister existing service workers
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
        {/*
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      // Service worker registered
                    })
                    .catch(function(registrationError) {
                      // Service worker registration failed
                    });
                });
              }
            `,
          }}
        />
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global Structured Data */}
        <StructuredData data={[
          generateOrganizationLD(),
          generateWebsiteLD()
        ]} />
        
        <GlobalStateProvider>
          {children}
          <CookieConsent />
          <Toaster />
        </GlobalStateProvider>
      </body>
    </html>
  );
}
