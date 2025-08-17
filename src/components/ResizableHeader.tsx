"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGlobalState } from "../contexts/GlobalProvider";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "./ui/resizable-navbar";

function ResizableHeader() {
  const { globalState } = useGlobalState();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangPopup, setShowLangPopup] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navItems = [
    { name: "Jobs", link: "/jobs" },
    { name: "Companies", link: "/companies" },
    { name: "Services", link: "/services" },
    { name: "For Employers", link: "/for-employers" },
  ];

  // Dropdown data for mobile navigation
  const jobsDropdown = [
    { label: "All Jobs", href: "/jobs" },
    { label: "Jobs by Country", href: "/jobs" },
    { label: "Latest Jobs", href: "/jobs/last-week" },
  ];

  const servicesDropdown = [
    { label: "Resume Building", href: "/about-resume-building" },
    { label: "Skill Training", href: "/skill-training-institute" },
    { label: "Visa Assistance", href: "/about-us" },
  ];

  return (
    <div className="w-full">
      <Navbar className="top-0">
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo - Compact */}
          <Link
            href="/"
            className="relative z-20 mr-4 flex items-center space-x-2 px-1 py-1 text-sm font-normal text-gray-800"
          >
            <Image
              src="/images/overseas.ainewlogo.png"
              width={40}
              height={40}
              alt="Overseas.ai"
              className="h-[40px] w-auto"
              priority
              style={{ width: 'auto', height: '40px' }}
              unoptimized
            />
          </Link>

          {/* Navigation Items with Custom Dropdowns for Better UX */}
          <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-1 text-sm font-medium text-indigo-600 transition duration-200 hover:text-indigo-600 lg:flex lg:space-x-1">
            {/* Jobs Dropdown */}
            <div className="relative group">
              <Link
                href="/jobs"
                className="relative px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center"
              >
                <span className="relative z-20">Jobs</span>
                <i className="fa fa-chevron-down ml-1 text-xs"></i>
              </Link>
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dark:bg-neutral-950 dark:border-neutral-800">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-neutral-800">Find Jobs</div>
                {jobsDropdown.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors dark:text-indigo-400 dark:hover:bg-neutral-800 dark:hover:text-indigo-300"
                  >
                    <i className="fa fa-briefcase mr-3 text-blue-500"></i>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Companies */}
            <Link
              href="/companies"
              className="relative px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <span className="relative z-20">Companies</span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <Link
                href="/services"
                className="relative px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center"
              >
                <span className="relative z-20">Services</span>
                <i className="fa fa-chevron-down ml-1 text-xs"></i>
              </Link>
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dark:bg-neutral-950 dark:border-neutral-800">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-neutral-800">Our Services</div>
                {servicesDropdown.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors dark:text-indigo-400 dark:hover:bg-neutral-800 dark:hover:text-indigo-300"
                  >
                    <i className="fa fa-cog mr-3 text-blue-500"></i>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* For Employers */}
            <Link
              href="/for-employers"
              className="relative px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <span className="relative z-20">For Employers</span>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 relative z-20">
            {globalState?.user ? (
              <div className="relative group">
                <button className="flex items-center text-gray-800 dark:text-white font-medium px-4 py-2 rounded-md bg-transparent shadow-none hover:-translate-y-0.5 transition duration-200">
                  My Account
                  <i className="fa fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dark:bg-neutral-950 dark:border-neutral-800">
                  <Link href="/my-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-indigo-400 dark:hover:bg-neutral-800">
                    My Profile
                  </Link>
                  <Link href="/my-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-indigo-400 dark:hover:bg-neutral-800">
                    Saved Jobs
                  </Link>
                  <Link href="/my-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-indigo-400 dark:hover:bg-neutral-800">
                    My Applications
                  </Link>
                  <hr className="my-1 dark:border-neutral-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-md bg-transparent shadow-none text-gray-800 dark:text-white text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-md bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link href="/" className="flex items-center">
              <Image
                src="/images/brandlogo.gif"
                width={120}
                height={30}
                alt="Overseas.ai"
                className="h-8 w-auto"
                style={{ width: 'auto', height: '32px' }}
                unoptimized
              />
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="space-y-4 w-full">
              {/* Jobs Section */}
              <div>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'Jobs' ? null : 'Jobs')}
                  className="w-full flex items-center justify-between py-3 text-indigo-600 hover:text-indigo-600 font-medium"
                >
                  <div className="flex items-center">
                    <i className="fa fa-search mr-3 text-blue-600"></i>
                    Jobs
                  </div>
                  <i className={`fa fa-chevron-down transition-transform duration-200 ${
                    activeDropdown === 'Jobs' ? 'rotate-180' : ''
                  }`}></i>
                </button>
                {activeDropdown === 'Jobs' && (
                  <div className="pl-8 py-2 space-y-1">
                    {jobsDropdown.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-indigo-600 hover:text-indigo-600 hover:bg-blue-50 rounded-md"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setActiveDropdown(null);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Companies */}
              <Link
                href="/companies"
                className="flex items-center py-3 text-indigo-600 hover:text-indigo-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa fa-building mr-3 text-blue-600"></i>
                Companies
              </Link>

              {/* Services Section */}
              <div>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'Services' ? null : 'Services')}
                  className="w-full flex items-center justify-between py-3 text-indigo-600 hover:text-indigo-600 font-medium"
                >
                  <div className="flex items-center">
                    <i className="fa fa-cog mr-3 text-blue-600"></i>
                    Services
                  </div>
                  <i className={`fa fa-chevron-down transition-transform duration-200 ${
                    activeDropdown === 'Services' ? 'rotate-180' : ''
                  }`}></i>
                </button>
                {activeDropdown === 'Services' && (
                  <div className="pl-8 py-2 space-y-1">
                    {servicesDropdown.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-indigo-600 hover:text-indigo-600 hover:bg-blue-50 rounded-md"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setActiveDropdown(null);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* For Employers */}
              <Link
                href="/for-employers"
                className="flex items-center py-3 text-indigo-600 hover:text-indigo-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa fa-briefcase mr-3 text-blue-600"></i>
                For Employers
              </Link>

              {/* Mobile User Menu */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {globalState?.user ? (
                  <div className="space-y-2">
                    <Link 
                      href="/my-profile" 
                      className="flex items-center py-3 text-indigo-600 hover:text-indigo-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fa fa-user mr-3 text-blue-600"></i>My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center py-3 text-red-600 hover:text-red-700 font-medium"
                    >
                      <i className="fa fa-sign-out mr-3"></i>Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href="/login" 
                      className="flex items-center py-3 text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fa fa-sign-in mr-3"></i>Login
                    </Link>
                    <Link 
                      href="/register" 
                      className="flex items-center py-3 text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fa fa-user-plus mr-3"></i>Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Language Popup Modal (keeping your existing functionality) */}
      {showLangPopup && (
        <>
          {/* Modal Background */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowLangPopup(false)}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h5 className="text-lg font-semibold">Select Language</h5>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  onClick={() => setShowLangPopup(false)}
                >
                  <i className="fa fa-close"></i>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4">
                {["English", "Hindi", "Bengali"].map((v, i) => {
                  return (
                    <div key={i} className="w-full">
                      <div
                        className="hover:bg-gray-100 rounded p-3 mb-2 flex items-center cursor-pointer transition-colors"
                        onClick={() => setShowLangPopup(false)}
                      >
                        <p className="text-sm font-medium text-gray-700">
                          {v}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ResizableHeader;
