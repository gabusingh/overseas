"use client";
import dynamic from "next/dynamic";

const LegacyApp = dynamic(() => import("../legacy/LegacyMount"), {
  ssr: false,
});

export default function CatchAllLegacy() {
  return <LegacyApp />;
}
