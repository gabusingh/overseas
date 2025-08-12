import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GuestRoutes from "./GuestRoutes";
import UserRoutes from "./UserRoutes";
import HraRoutes from "./HraRoutes";
import { useLocation } from "react-router-dom";
import { useGlobalState } from "../GlobalProvider";
import InstituteRoute from "./InstituteRoute";

function AllRoutes() {
  const location = useLocation();
  const { globalState } = useGlobalState();
  console.log("from all routes", location.pathname);

  const renderLayout = () => {
    switch (globalState?.user?.user?.type) {
      case "person":
        return <UserRoutes />;
      case "company":
        return <HraRoutes />;
        case "institute":
        return <InstituteRoute />;
      default:
        return <GuestRoutes />;
    }
  };

  const showHeaderAndFooter = !["/login", "/otp-verification"].includes(
    location.pathname
  );

  return (
    <div>
      {showHeaderAndFooter && <Header />}
      {renderLayout()}
      {showHeaderAndFooter && <Footer />}
    </div>
  );
}

export default AllRoutes;
