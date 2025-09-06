"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { HraDataProvider } from "@/contexts/HraDataProvider";

interface SiteLayoutProps {
  children: React.ReactNode;
  skipHraDataFetch?: boolean; // Control HRA data fetching
}

function SiteLayout({ children, skipHraDataFetch = false }: SiteLayoutProps) {
  return (
    <HraDataProvider skipDataFetch={skipHraDataFetch}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 pt-16 pb-12">
          {children}
        </main>
        <Footer skipDataFetch={skipHraDataFetch} />
      </div>
    </HraDataProvider>
  );
}

export default SiteLayout;