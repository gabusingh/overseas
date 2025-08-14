"use client";
import type { ReactNode } from "react";
import SiteLayout from "../../components/SiteLayout";

export default function SiteLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <SiteLayout>
      {children}
    </SiteLayout>
  );
}
