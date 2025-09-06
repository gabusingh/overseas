"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { useHraData } from "@/contexts/HraDataProvider";

export default function HraDashboardPage() {
  const router = useRouter();
  const { dashboardData, loading, error, fetchHraData } = useHraData();
  const [userData, setUserData] = useState<any>(null);
  const { setGlobalState } = require("@/contexts/GlobalProvider").useGlobalState();

  const stats = [
    { title: "Active Job Postings", value: dashboardData?.totalPostedJobs?.toString() || "0", icon: "fa fa-briefcase" },
    { title: "Total Applications", value: dashboardData?.totalAppliedCandidates?.toString() || "0", icon: "fa fa-users" },
    { title: "Bulk Hiring Requests", value: dashboardData?.totalPostedBulkHiring?.toString() || "0", icon: "fa fa-calendar" },
  ];

  // Get recent applications with better fallback handling
  const recentApplications = dashboardData?.recentApplications && dashboardData.recentApplications.length > 0 
    ? dashboardData.recentApplications 
    : (loading 
      ? [{ candidateName: "Loading...", jobTitle: "Please wait", appliedOn: "...", status: "Loading" }]
      : [{ candidateName: "No applications yet", jobTitle: "Create a job posting to start receiving applications", appliedOn: "-", status: "N/A" }]
    );

  const navigationItems = [
    { name: "Create Job", path: "/create-jobs", icon: "fa fa-plus" },
    // { name: "Search Candidates", path: "/recommended-candidates", icon: "fa fa-search" },
    { name: "Schedule Interview", path: "/view-candidate-application-list", icon: "fa fa-calendar" },
    { name: "View Reports", path: "/hra-jobs", icon: "fa fa-chart-bar" },
    { name: "Bulk Hire", path: "/bulk-hire", icon: "fa fa-users" },
    { name: "Notifications", path: "/notifications", icon: "fa fa-bell" }
  ];

  const initializeDashboard = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("loggedUser");
      const userSimple = localStorage.getItem("user");
      
      if (!token || !user) {
        console.log('No token or user data found, redirecting to login');
        router.push("/login");
        return;
      }

      const userData = JSON.parse(user);
      const userSimpleData = userSimple ? JSON.parse(userSimple) : null;
      
      // Check if user is a company (HR) user
      const userType = userData?.user?.type || userData?.type || userSimpleData?.type;
      console.log('HR Dashboard - User type check:', userType);
      
      if (userType !== 'company') {
        console.log('User is not a company type, redirecting based on type:', userType);
        toast.error('Access denied. This dashboard is only for HR/Company users.');
        
        // Redirect to appropriate dashboard based on user type
        switch (userType) {
          case 'person':
            router.push('/my-profile');
            break;
          case 'institute':
            router.push('/institute-dashboard');
            break;
          default:
            router.push('/');
            break;
        }
        return;
      }
      
      setUserData(userData);

      // Use context to fetch HRA data with caching
      await fetchHraData();
    } catch (error) {
      console.error("Error initializing dashboard:", error);
      toast.error("Failed to initialize dashboard. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("access_token");
    setGlobalState((prev: any) => ({ ...prev, user: null }));
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>HRA Dashboard - Manage Jobs & Candidates | Overseas.ai</title>
        <meta name="description" content="Comprehensive HRA dashboard for managing job postings, applications, and candidate recruitment." />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="heading textBlue mb-2">
                <i className="fa fa-tachometer mr-3"></i>
                HRA Dashboard
              </h1>
              <p className="text-lg text-gray-600">Welcome back, {userData?.cmpData?.cmpName || "Company"}! Here's your recruitment overview.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <i className="fa fa-sign-out mr-2"></i>
              Logout
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="bg-white border-0 shadow-sm rounded-lg">
                  <div className="p-6 text-center">
                    <div className="w-15 h-15 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center" style={{height: "60px", width: "60px"}}>
                      <i className={`${stat.icon} textBlue text-2xl`}></i>
                    </div>
                    <h3 className="textBlue mb-2 text-2xl font-bold">{stat.value}</h3>
                    <p className="text-gray-500 mb-0 text-sm">{stat.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Applications */}
            <div className="lg:col-span-8">
              <div className="bg-white border-0 shadow-sm rounded-lg">
                <div className="bgBlue text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
                  <h5 className="mb-0 text-lg font-semibold">Recent Applications</h5>
                  <button 
                    onClick={() => handleNavigation('/view-candidate-application-list')}
                    className="border border-white text-white px-3 py-1 rounded hover:bg-white hover:text-blue-600 transition-colors text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentApplications.map((app, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.candidateName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.jobTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.appliedOn}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                app.status === 'Hired' ? 'bg-green-100 text-green-800' : 
                                app.status === 'Interview Scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                                app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button 
                                onClick={() => handleNavigation('/view-candidate-application-list')}
                                className="border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50 transition-colors"
                              >
                                View
                              </button>
                              <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">Message</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border-0 shadow-sm rounded-lg">
                <div className="bgBlue text-white px-6 py-4 rounded-t-lg">
                  <h5 className="mb-0 text-lg font-semibold">Quick Actions</h5>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {navigationItems.map((item, index) => (
                      <button 
                        key={index}
                        onClick={() => handleNavigation(item.path)}
                        className="w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                      >
                        <i className={`${item.icon} mr-2`}></i>
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
