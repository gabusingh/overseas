"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if consent has been given
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    localStorage.setItem("userSession", "123456789");
    setShowConsent(false);
    };

  if (!showConsent) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
      style={{ background: "#2B373B" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white text-sm">
          This website uses cookies to enhance the user experience.{" "}
          <a 
            href="/cookie-policy" 
            className="text-white underline hover:no-underline"
          >
            Learn More
          </a>
        </div>
        <Button
          onClick={acceptCookies}
          size="sm"
          style={{ 
            color: "#4e503b", 
            fontSize: "13px",
            backgroundColor: "white"
          }}
        >
          I understand
        </Button>
      </div>
    </div>
  );
}
