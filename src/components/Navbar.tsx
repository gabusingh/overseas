"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGlobalState } from "../contexts/GlobalProvider";
import { useRouter } from "next/navigation";

function Navbar() {
  const { globalState, setGlobalState } = useGlobalState();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  setGlobalState(prev => ({ ...prev, user: null }));
  router.push("/login");
  };

  const navItems = [
    {
      label: "Jobs",
      href: "/jobs",
      dropdown: [
        { label: "All Jobs", href: "/jobs" },
        { label: "Jobs by Country", href: "/jobs" },
       // { label: "Latest Jobs", href: "/jobs/last-week" },
      ]
    },
    {
      label: "Companies",
      href: "/companies"
    },
    {
      label: "Services",
      dropdown: [
        { label: "Resume Building", href: "/about-resume-building" },
        { label: "Skill Training", href: "/training-institutes" },
        { label: "Trade Center", href: "/trade-test-center" },
        { label: "Trade Test", href: "/trade-test-institute" },
        { label: "Visa Assistance", href: "/about-us" },
      ]
    },
    {
      label: "For Employers",
      href: "/for-employers"
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          
          
          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href || "#"}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 flex items-center"
                >
                  {item.label}
                  {item.dropdown && (
                    <i className="fa fa-chevron-down ml-1 text-xs"></i>
                  )}
                </Link>
                
                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    {item.dropdown.map((dropdownItem, dropIndex) => (
                      <Link
                        key={dropIndex}
                        href={dropdownItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* User Account & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="https://play.google.com/store/apps/details?id=ai.overseas"
              target="_blank"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium"
            >
              Download App
            </Link>
            
            {globalState?.user ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  My Account
                  <i className="fa fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/my-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Profile
                  </Link>
                  <Link href="/my-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Saved Jobs
                  </Link>
                  <Link href="/my-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Applications
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <i className={`fa ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      {item.label}
                    </div>
                    {item.dropdown && (
                      <i className={`fa fa-chevron-down transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`}></i>
                    )}
                  </button>
                  
                  {/* Mobile Dropdown */}
                  {item.dropdown && activeDropdown === item.label && (
                    <div className="pl-8 py-2 space-y-1">
                      {item.dropdown.map((dropdownItem, dropIndex) => (
                        <Link
                          key={dropIndex}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile User Menu */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {globalState?.user ? (
                  <div className="space-y-2">
                    <Link href="/my-profile" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                      <i className="fa fa-user mr-3"></i>My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <i className="fa fa-sign-out mr-3"></i>Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <i className="fa fa-sign-in mr-3"></i>Login
                    </Link>
                    <Link href="/login" className="flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <i className="fa fa-user-plus mr-3"></i>Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
