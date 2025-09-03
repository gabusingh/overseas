"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteLayout from "../../components/SiteLayout";

export default function SiteLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Skip HRA data fetching for pages that don't need it
  const skipHraDataFetch = pathname === "/employer-signup" || 
                           pathname === "/candidate-register" || 
                           pathname === "/institute-signup" ||
                           pathname === "/partner-signup" ||
                           pathname === "/login";

  return (
    <SiteLayout skipHraDataFetch={skipHraDataFetch}>
      {children}
    </SiteLayout>
  );
}
