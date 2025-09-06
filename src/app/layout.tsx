import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalStateProvider } from '../contexts/GlobalProvider';
import { CookieConsent } from '../components/CookieConsent';

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
        
        {/* Service Worker Registration - Temporarily disabled for debugging */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Unregister existing service workers for debugging
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
                      })
                    .catch(function(registrationError) {
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
        <GlobalStateProvider>
          {children}
          <CookieConsent />
        </GlobalStateProvider>
      </body>
    </html>
  );
}
