"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface SiteLayoutProps {
  children: React.ReactNode;
}

function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-16 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default SiteLayout;