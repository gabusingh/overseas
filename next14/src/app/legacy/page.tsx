"use client";
import dynamic from "next/dynamic";

const LegacyApp = dynamic(() => import("./LegacyMount"), {
  ssr: false,
});

export default function Page() {
  return <LegacyApp />;
}
