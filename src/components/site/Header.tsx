"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent } from "../../components/ui/navigation-menu";
import { useGlobalState } from "@/contexts/GlobalProvider";
import { clearStoredAuth } from "@/lib/auth";
import { logOut } from "@/services/user.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { globalState, setGlobalState } = useGlobalState();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const user = globalState.user?.user;
  const isAuthenticated = !!user || !!globalState.user;
  
  // Enhanced user type detection - matching the working debug logic
  const [userType, setUserType] = useState<string | null>(null);
  const [isHrUser, setIsHrUser] = useState<boolean>(false);
  
  useEffect(() => {
    // Detection logic that matches the working debug page
    const detectHRUser = () => {
      let detectedType: string | null = null;
      let hrDetected = false;
      
      // Priority 1: Check localStorage loggedUser first (most reliable)
      try {
        const loggedUser = localStorage.getItem('loggedUser');
        if (loggedUser && loggedUser !== 'undefined' && loggedUser !== 'null') {
          const parsed = JSON.parse(loggedUser);
          
          // The type is at parsed.user.type based on your debug data
          if (parsed?.user?.type) {
            detectedType = parsed.user.type;
          } else if (parsed?.type) {
            detectedType = parsed.type;
          }
          
          // Additional check for cmpData presence
          if (!detectedType && parsed?.cmpData) {
            detectedType = 'company';
          }
        }
      } catch (e) {
      }
      
      // Priority 2: Check localStorage user
      if (!detectedType) {
        try {
          const userData = localStorage.getItem('user');
          if (userData && userData !== 'undefined' && userData !== 'null') {
            const parsed = JSON.parse(userData);
            detectedType = parsed?.type;
          }
        } catch (e) {
        }
      }
      
      // Priority 3: Check global state
      if (!detectedType) {
        if (globalState.user?.user?.type) {
          detectedType = globalState.user.user.type;
        } else if ((globalState.user as any)?.type) {
          detectedType = (globalState.user as any).type;
        }
      }
      
      // Final detection - check if it's an HR/company user
      hrDetected = detectedType === 'company' || 
                   detectedType === 'hr' || 
                   detectedType === 'employer';
      
      
      setUserType(detectedType);
      setIsHrUser(hrDetected);
    };
    
    // Run detection immediately
    detectHRUser();
    
    // Also run after a small delay to catch any async state updates
    const timer = setTimeout(detectHRUser, 100);
    
    return () => clearTimeout(timer);
  }, [globalState.user, user?.type, isAuthenticated]);
  
  // Use detected user type
  const effectiveUser = user || globalState.user || (userType ? { type: userType } : null);
  

  const handleLogout = async () => {
    try {
      const accessToken = globalState.user?.access_token;
      if (accessToken) {
        await logOut(accessToken);
      }
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Clear all stored authentication data
      clearStoredAuth();
      // Clear global state
      setGlobalState({
        user: null,
        profileStrength: null,
        notifications: null,
        regSource: null
      });
      toast.success('Successfully logged out');
      router.push('/');
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.name || user.email || user.phone || 'User';
  };

  const getUserDashboardLink = () => {
    if (!effectiveUser && !userType) return '/login';
    const type = userType || (effectiveUser as any)?.type;
    switch (type) {
      case 'person':
        return '/my-profile';
      case 'company':
        return '/hra-dashboard';
      case 'institute':
        return '/institute-dashboard';
      default:
        return '/my-profile';
    }
  };

  const getDashboardLinkText = () => {
    if (!effectiveUser && !userType) return 'My Account';
    const type = userType || (effectiveUser as any)?.type;
    switch (type) {
      case 'company':
        return 'Dashboard';
      case 'institute':
        return 'Dashboard';
      case 'person':
      default:
        return 'My Account';
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <Link href="/mobile-app" className="text-gray-600 hover:text-blue-600">
              📱 Get App
            </Link>
            <Link href="/for-employers" className="text-gray-600 hover:text-blue-600">
              Employers
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-blue-600">
              Help
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 text-sm">
                  Welcome, {getUserDisplayName()}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Register for free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/brandlogo.gif" 
              alt="Overseas.ai" 
              width={40}
              height={40}
              className="h-10 w-auto mr-2" 
              priority
              style={{ width: 'auto', height: '40px' }}
            />
            <span className="font-bold text-xl text-blue-600">Overseas.ai</span>
          </Link>
          
          {/* Desktop Navigation - Hide for HR users */}
          {!isHrUser && (
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="flex items-center space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
                    <i className="fa fa-search text-sm"></i>
                    <span>Find Jobs</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-6 w-[500px]">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Job Search</h3>
                        <div className="space-y-2">
                          <Link href="/jobs" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-globe mr-3 text-blue-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">All Jobs</div>
                              <div className="text-xs text-gray-500">Browse all opportunities</div>
                            </div>
                          </Link>
                          <Link href="/jobs/remote" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-laptop mr-3 text-blue-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Remote Jobs</div>
                              <div className="text-xs text-gray-500">Work from anywhere</div>
                            </div>
                          </Link>
                          <Link href="/jobs/premium" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-star mr-3 text-orange-500"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Premium Jobs</div>
                              <div className="text-xs text-gray-500">High-paying opportunities</div>
                            </div>
                          </Link>
                          <Link href="/jobs/last-week" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-clock-o mr-3 text-green-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Fresh Jobs</div>
                              <div className="text-xs text-gray-500">Latest this week</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Browse by</h3>
                        <div className="space-y-2">
                          <button className="flex items-center p-2 hover:bg-blue-50 rounded group w-full text-left">
                            <i className="fa fa-map-marker mr-3 text-blue-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Jobs by Location</div>
                              <div className="text-xs text-gray-500">50+ countries</div>
                            </div>
                          </button>
                          <button className="flex items-center p-2 hover:bg-blue-50 rounded group w-full text-left">
                            <i className="fa fa-briefcase mr-3 text-blue-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Jobs by Category</div>
                              <div className="text-xs text-gray-500">All industries</div>
                            </div>
                          </button>
                          <button className="flex items-center p-2 hover:bg-blue-50 rounded group w-full text-left">
                            <i className="fa fa-cog mr-3 text-blue-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Jobs by Skill</div>
                              <div className="text-xs text-gray-500">Match your expertise</div>
                            </div>
                          </button>
                          <Link href="/job-alerts" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-bell mr-3 text-red-500"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Job Alerts</div>
                              <div className="text-xs text-gray-500">Get notified</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
                    <i className="fa fa-building text-sm"></i>
                    <span>Companies</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-6 w-[450px]">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Explore Companies</h3>
                        <div className="space-y-2">
                          <Link href="/recruiting-companies" className="flex items-center p-3 hover:bg-blue-50 rounded group">
                            <i className="fa fa-building mr-3 text-blue-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">All Companies</div>
                              <div className="text-xs text-gray-500">Browse 50+ recruiting companies</div>
                            </div>
                          </Link>
                          <Link href="/companies/top-recruiters" className="flex items-center p-3 hover:bg-blue-50 rounded group">
                            <i className="fa fa-trophy mr-3 text-orange-500"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Top Recruiters</div>
                              <div className="text-xs text-gray-500">Leading employers overseas</div>
                            </div>
                          </Link>
                          <Link href="/companies/mnc" className="flex items-center p-3 hover:bg-blue-50 rounded group">
                            <i className="fa fa-globe mr-3 text-green-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">MNC Companies</div>
                              <div className="text-xs text-gray-500">Multinational corporations</div>
                            </div>
                          </Link>
                          <Link href="/companies/startup" className="flex items-center p-3 hover:bg-blue-50 rounded group">
                            <i className="fa fa-rocket mr-3 text-purple-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Startups</div>
                              <div className="text-xs text-gray-500">Innovative startups abroad</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
                    <i className="fa fa-graduation-cap text-sm"></i>
                    <span>Skills & Learning</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-6 w-[500px]">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Training & Certification</h3>
                        <div className="space-y-2">
                          <Link href="/training-institutes" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-university mr-3 text-blue-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Training Institutes</div>
                              <div className="text-xs text-gray-500">45+ certified institutes</div>
                            </div>
                          </Link>
                          <Link href="/skill-training-institute" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-wrench mr-3 text-orange-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Skill Development</div>
                              <div className="text-xs text-gray-500">Technical & soft skills</div>
                            </div>
                          </Link>
                          <Link href="/trade-testing-institute" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-certificate mr-3 text-green-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Trade Testing</div>
                              <div className="text-xs text-gray-500">Get certified</div>
                            </div>
                          </Link>
                          <Link href="/trade-test-center" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-check-circle mr-3 text-purple-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Test Centers</div>
                              <div className="text-xs text-gray-500">Find test centers</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Career Services</h3>
                        <div className="space-y-2">
                          <Link href="/about-resume-building" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-file-text mr-3 text-blue-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Resume Builder</div>
                              <div className="text-xs text-gray-500">Professional resumes</div>
                            </div>
                          </Link>
                          <Link href="/career-advice" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-lightbulb-o mr-3 text-yellow-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Career Advice</div>
                              <div className="text-xs text-gray-500">Expert guidance</div>
                            </div>
                          </Link>
                          <Link href="/interview-preparation" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-users mr-3 text-red-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Interview Prep</div>
                              <div className="text-xs text-gray-500">Practice & improve</div>
                            </div>
                          </Link>
                          <Link href="/salary-calculator" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-calculator mr-3 text-green-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Salary Calculator</div>
                              <div className="text-xs text-gray-500">Know your worth</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
                    <i className="fa fa-compass text-sm"></i>
                    <span>Career Guide</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-6 w-[400px]">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
                        <div className="space-y-2">
                          <Link href="/visa-guide" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-plane mr-3 text-blue-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Visa Guide</div>
                              <div className="text-xs text-gray-500">Work visa information</div>
                            </div>
                          </Link>
                          <Link href="/country-guide" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-map mr-3 text-green-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Country Guide</div>
                              <div className="text-xs text-gray-500">Living & working abroad</div>
                            </div>
                          </Link>
                          <Link href="/success-stories" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-star mr-3 text-yellow-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Success Stories</div>
                              <div className="text-xs text-gray-500">Real experiences</div>
                            </div>
                          </Link>
                          <Link href="/blog" className="flex items-center p-2 hover:bg-blue-50 rounded group">
                            <i className="fa fa-newspaper-o mr-3 text-purple-600"></i>
                            <div>
                              <div className="font-medium group-hover:text-blue-600">Career Blog</div>
                              <div className="text-xs text-gray-500">Tips & insights</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/pricing" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
                    Pricing
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          
          {/* HR Dashboard Link for HR users */}
          {isHrUser && (
            <div className="hidden lg:flex flex-1 justify-center">
              <Link 
                href="/hra-dashboard" 
                className="flex items-center gap-2 px-6 py-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
              >
                <i className="fa fa-dashboard text-lg"></i>
                <span>HR Dashboard</span>
              </Link>
            </div>
          )}

          {/* User Actions */}
          {/* <div className="hidden lg:flex items-center space-x-4">
            <Link href="/for-employers" className="text-gray-600 hover:text-blue-600 font-medium">
              For Employers
            </Link>
            
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-32 truncate">{getUserDisplayName()}</span>
                  <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        href={getUserDashboardLink()}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="fa fa-dashboard mr-3 text-blue-600"></i>
                        {getDashboardLinkText()}
                      </Link>
                      {!isHrUser && (
                        <>
                          <Link
                            href="/my-profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fa fa-user mr-3 text-green-600"></i>
                            My Profile
                          </Link>
                          <Link
                            href="/applied-jobs"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fa fa-briefcase mr-3 text-purple-600"></i>
                            Applied Jobs
                          </Link>
                          <Link
                            href="/job-alerts"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fa fa-bell mr-3 text-yellow-600"></i>
                            Job Alerts
                          </Link>
                        </>
                      )}
                      {isHrUser && (
                        <>
                          <Link
                            href="/create-jobs"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fa fa-plus mr-3 text-blue-600"></i>
                            Create Job
                          </Link>
                          <Link
                            href="/view-candidate-application-list"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fa fa-users mr-3 text-green-600"></i>
                            Applications
                          </Link>
                          <Link
                            href="/hra-jobs"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fa fa-briefcase mr-3 text-purple-600"></i>
                            My Jobs
                          </Link>
                          <Link
                            href="/notifications"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fa fa-bell mr-3 text-yellow-600"></i>
                            Notifications
                          </Link>
                        </>
                      )}
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <i className="fa fa-sign-out mr-3"></i>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
                  Register
                </Link>
              </div>
            )}
          </div> */}

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fa ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link href="/jobs" className="block py-3 border-b border-gray-100 font-medium text-gray-700">
                <i className="fa fa-search mr-3 text-blue-600"></i>
                Find Jobs
              </Link>
              <Link href="/recruiting-companies" className="block py-3 border-b border-gray-100 font-medium text-gray-700">
                <i className="fa fa-building mr-3 text-blue-600"></i>
                Companies
              </Link>
              <Link href="/training-institutes" className="block py-3 border-b border-gray-100 font-medium text-gray-700">
                <i className="fa fa-graduation-cap mr-3 text-blue-600"></i>
                Skills & Learning
              </Link>
              {/* <Link href="/career-guide" className="block py-3 border-b border-gray-100 font-medium text-gray-700">
                <i className="fa fa-compass mr-3 text-blue-600"></i>
                Career Guide
              </Link> */}
              {/* <Link href="/for-employers" className="block py-3 border-b border-gray-100 font-medium text-gray-700">
                <i className="fa fa-briefcase mr-3 text-blue-600"></i>
                For Employers
              </Link> */}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href={getUserDashboardLink()} 
                      className="block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fa fa-dashboard mr-2"></i>
                      {getDashboardLinkText()}
                    </Link>
                    <Link 
                      href="/my-profile" 
                      className="block w-full text-center py-2 border border-green-600 text-green-600 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fa fa-user mr-2"></i>
                      My Profile
                    </Link>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-center py-2 bg-red-600 text-white rounded-md font-medium"
                    >
                      <i className="fa fa-sign-out mr-2"></i>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-md font-medium">
                      Login
                    </Link>
                    <Link href="/register" className="block w-full text-center py-2 bg-blue-600 text-white rounded-md font-medium">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
