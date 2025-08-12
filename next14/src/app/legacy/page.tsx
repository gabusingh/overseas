"use client";

import React from "react";
import { BrowserRouter } from "react-router-dom";

// Import the existing CRA App and styles from the parent project
// We reference via relative paths to keep the original code and API calls intact.
// Typescript will allow JS imports by allowJs in tsconfig.
import App from "../../../src/App";
import "../../../src/index.css";

export default function LegacyAppPage() {
  // This mounts the existing CRA app under Next.js at /legacy
  // preserving axios calls, endpoints, and business logic unchanged.
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
