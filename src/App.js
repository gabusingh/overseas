import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import CookieConsent from "react-cookie-consent";  // Import react-cookie-consent

import "./App.css";
import { GlobalStateProvider } from './GlobalProvider';
import AllRoutes from "./routes/AllRoutes";
function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <GlobalStateProvider>
      <AllRoutes />
      <CookieConsent
        location="bottom"
        buttonText="I understand"
        cookieName="myCookieConsent"
        expires={150}
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        onAccept={() => {
          // Set any cookies here once the user accepts
          Cookies.set("userSession", "123456789", { expires: 7 });
          console.log("Cookies accepted");
        }}
      >
        This website uses cookies to enhance the user experience.{" "}
        <a href="/cookie-policy" style={{ color: "#fff", textDecoration: "underline" }}>Learn More</a>
      </CookieConsent>
    </GlobalStateProvider>
  );
}

export default App;
