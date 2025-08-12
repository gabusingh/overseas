"use client";

import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "../../../legacy/App";
import "../../../legacy/index.css";

export default function LegacyMount() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
