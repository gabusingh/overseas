"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";

interface HraDashboardData {
  totalPostedJobs: number;
  totalAppliedCandidates: number;
  totalPostedBulkHiring: number;
  recentApplications?: Array<{
    candidateName: string;
    jobTitle: string;
    appliedOn: string;
    status: string;
  }>;
  recentJobs?: Array<{
    jobTitle: string;
    location: string;
    applicationsCount: number;
  }>;
}

export default function HraDashboardPage() {
  const router = useRouter();
  const [hraData, setHraData] = useState<HraDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const stats = [
    { title: "Active Job Postings", value: hraData?.totalPostedJobs?.toString() || "0", icon: "fa fa-briefcase" },
    { title: "Total Applications", value: hraData?.totalAppliedCandidates?.toString() || "0", icon: "fa fa-users" },
    { title: "Bulk Hiring Requests", value: hraData?.totalPostedBulkHiring?.toString() || "0", icon: "fa fa-calendar" },
    { title: "Success Rate", value: "75%", icon: "fa fa-check-circle" }
  ];

  const recentApplications = hraData?.recentApplications || [
    { candidateName: "Loading...", jobTitle: "", appliedOn: "", status: "" }
  ];

  const navigationItems = [
    { name: "Create Job", path: "/create-jobs", icon: "fa fa-plus" },
    { name: "Search Candidates", path: "/recommended-candidates", icon: "fa fa-search" },
    { name: "Schedule Interview", path: "/view-candidate-application-list", icon: "fa fa-calendar" },
    { name: "View Reports", path: "/hra-jobs", icon: "fa fa-chart-bar" },
    { name: "Bulk Hire", path: "/create-bulk-hire", icon: "fa fa-users" },
    { name: "Notifications", path: "/hra-notifications", icon: "fa fa-bell" }
  ];

  const fetchHraDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("loggedUser");
      
      if (!token || !user) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(user);
      setUserData(userData);

      // Mock data for now - replace with actual API call
      const mockData: HraDashboardData = {
        totalPostedJobs: 24,
        totalAppliedCandidates: 156,
        totalPostedBulkHiring: 8,
        recentApplications: [
          { candidateName: "John Smith", jobTitle: "Software Engineer", appliedOn: "2024-12-10", status: "Under Review" },
          { candidateName: "Sarah Johnson", jobTitle: "Project Manager", appliedOn: "2024-12-09", status: "Interview Scheduled" },
          { candidateName: "Mike Wilson", jobTitle: "UX Designer", appliedOn: "2024-12-08", status: "Shortlisted" },
          { candidateName: "Emma Davis", jobTitle: "Data Analyst", appliedOn: "2024-12-07", status: "Hired" }
        ],
        recentJobs: [
          { jobTitle: "Senior Developer", location: "Dubai", applicationsCount: 15 },
          { jobTitle: "Project Manager", location: "Saudi Arabia", applicationsCount: 8 },
          { jobTitle: "UI/UX Designer", location: "Qatar", applicationsCount: 22 }
        ]
      };
      
      setHraData(mockData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("access_token");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    fetchHraDashboardData();
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
              
              <div className="bg-white border-0 shadow-sm rounded-lg">
                <div className="bgBlue text-white px-6 py-4 rounded-t-lg">
                  <h5 className="mb-0 text-lg font-semibold">Account Status</h5>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <small className="text-gray-500 text-sm">Plan: Premium</small>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bgBlue h-2 rounded-full" style={{width: "75%"}}></div>
                    </div>
                    <small className="text-gray-500 text-sm">18/24 job postings used</small>
                  </div>
                  <button className="w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                    Upgrade Plan
                  </button>
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
