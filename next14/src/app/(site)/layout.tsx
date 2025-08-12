"use client";
import type { ReactNode } from "react";
import { Toaster } from "../../components/ui/sonner";
import Header from "../../components/site/Header";
import Footer from "../../components/site/Footer";
import { ThemeProvider } from "../../components/site/ThemeProvider";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
