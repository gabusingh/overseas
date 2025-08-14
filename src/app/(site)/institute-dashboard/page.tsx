"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";

interface InstituteDashboardData {
  totalCourses: number;
  totalStudents: number;
  totalCertifications: number;
  totalTrainingPrograms: number;
  recentEnrollments?: Array<{
    studentName: string;
    courseName: string;
    enrolledOn: string;
    status: string;
  }>;
  topCourses?: Array<{
    courseName: string;
    duration: string;
    enrollmentCount: number;
  }>;
}

export default function InstituteDashboardPage() {
  const router = useRouter();
  const [instituteData, setInstituteData] = useState<InstituteDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const stats = [
    { title: "Active Courses", value: instituteData?.totalCourses?.toString() || "0", icon: "fa fa-book" },
    { title: "Enrolled Students", value: instituteData?.totalStudents?.toString() || "0", icon: "fa fa-graduation-cap" },
    { title: "Completed Certifications", value: instituteData?.totalCertifications?.toString() || "0", icon: "fa fa-certificate" },
    { title: "Training Programs", value: instituteData?.totalTrainingPrograms?.toString() || "0", icon: "fa fa-cogs" }
  ];

  const recentEnrollments = instituteData?.recentEnrollments || [
    { studentName: "Loading...", courseName: "", enrolledOn: "", status: "" }
  ];

  const navigationItems = [
    { name: "Add New Course", path: "/create-course", icon: "fa fa-plus" },
    { name: "Manage Students", path: "/manage-students", icon: "fa fa-users" },
    { name: "Schedule Classes", path: "/schedule-classes", icon: "fa fa-calendar" },
    { name: "Issue Certificates", path: "/certificates", icon: "fa fa-certificate" },
    { name: "View Reports", path: "/institute-reports", icon: "fa fa-chart-bar" },
    { name: "Notifications", path: "/institute-notifications", icon: "fa fa-bell" }
  ];

  const fetchInstituteDashboardData = async () => {
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
      const mockData: InstituteDashboardData = {
        totalCourses: 18,
        totalStudents: 342,
        totalCertifications: 156,
        totalTrainingPrograms: 8,
        recentEnrollments: [
          { studentName: "Rajesh Kumar", courseName: "Welding Certification", enrolledOn: "2024-12-10", status: "Active" },
          { studentName: "Priya Singh", courseName: "IELTS Preparation", enrolledOn: "2024-12-09", status: "Completed" },
          { studentName: "Mohammed Ali", courseName: "Electrical Training", enrolledOn: "2024-12-08", status: "Active" },
          { studentName: "Sarah Wilson", courseName: "Healthcare Skills", enrolledOn: "2024-12-07", status: "In Progress" },
          { studentName: "Ahmed Hassan", courseName: "Plumbing Course", enrolledOn: "2024-12-06", status: "Active" }
        ],
        topCourses: [
          { courseName: "IELTS Preparation", duration: "3 months", enrollmentCount: 45 },
          { courseName: "Welding Certification", duration: "6 months", enrollmentCount: 38 },
          { courseName: "Healthcare Skills", duration: "4 months", enrollmentCount: 32 }
        ]
      };
      
      setInstituteData(mockData);
    } catch (error) {
      console.error("Error fetching institute dashboard data:", error);
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
    fetchInstituteDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading institute dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Institute Dashboard - Manage Courses & Students | Overseas.ai</title>
        <meta name="description" content="Comprehensive training institute dashboard for managing courses, student enrollments, and certification programs." />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="heading textBlue mb-2">
                <i className="fa fa-graduation-cap mr-3"></i>
                Institute Dashboard
              </h1>
              <p className="text-lg text-gray-600">Welcome back, {userData?.cmpData?.cmpName || "Institute"}! Here's your training center overview.</p>
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
            {/* Recent Enrollments */}
            <div className="lg:col-span-8">
              <div className="bg-white border-0 shadow-sm rounded-lg">
                <div className="bgBlue text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
                  <h5 className="mb-0 text-lg font-semibold">Recent Enrollments</h5>
                  <button className="border border-white text-white px-3 py-1 rounded hover:bg-white hover:text-blue-600 transition-colors text-sm">View All</button>
                </div>
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentEnrollments.map((enrollment, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enrollment.studentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.courseName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.enrolledOn}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                enrollment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                enrollment.status === 'Active' ? 'bg-blue-100 text-blue-800' : 
                                enrollment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {enrollment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button className="border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50 transition-colors">View</button>
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
                  <h5 className="mb-0 text-lg font-semibold">Institute Profile</h5>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <small className="text-gray-500 text-sm">Accreditation Status:</small>
                    <div className="flex items-center mt-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold mr-2">Verified</span>
                      <small className="text-green-600 text-sm">All certifications valid</small>
                    </div>
                  </div>
                  <div className="mb-4">
                    <small className="text-gray-500 text-sm">Partnership Level:</small>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bgBlue h-2 rounded-full" style={{width: "90%"}}></div>
                    </div>
                    <small className="text-gray-500 text-sm">Premium Partner</small>
                  </div>
                  <button className="w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Section */}
          <div className="mt-8">
            <div className="w-full">
              <div className="bg-white border-0 shadow-sm rounded-lg">
                <div className="bgBlue text-white px-6 py-4 rounded-t-lg">
                  <h5 className="mb-0 text-lg font-semibold">
                    <i className="fa fa-chart-line mr-2"></i>
                    Performance Overview
                  </h5>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <h4 className="textBlue text-3xl font-bold">98%</h4>
                      <p className="text-gray-500 mb-0 text-sm">Student Satisfaction</p>
                    </div>
                    <div>
                      <h4 className="textBlue text-3xl font-bold">85%</h4>
                      <p className="text-gray-500 mb-0 text-sm">Job Placement Rate</p>
                    </div>
                    <div>
                      <h4 className="textBlue text-3xl font-bold">4.8/5</h4>
                      <p className="text-gray-500 mb-0 text-sm">Average Rating</p>
                    </div>
                    <div>
                      <h4 className="textBlue text-3xl font-bold">2.5K+</h4>
                      <p className="text-gray-500 mb-0 text-sm">Alumni Network</p>
                    </div>
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
