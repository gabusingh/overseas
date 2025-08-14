"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";

interface Application {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  jobTitle: string;
  jobId: string;
  appliedDate: string;
  status: "pending" | "shortlisted" | "interviewed" | "hired" | "rejected";
  experience: string;
  currentLocation: string;
  expectedSalary: string;
  currency: string;
  resumeUrl: string;
  coverLetter: string;
  skills: string[];
  education: string;
  availability: string;
  profilePicture?: string;
  rating?: number;
  notes?: string;
}

export default function ViewCandidateApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter, sortBy]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Mock data - replace with actual API call
      const mockApplications: Application[] = [
        {
          id: "1",
          candidateName: "Ahmed Hassan",
          email: "ahmed.hassan@email.com",
          phone: "+971-50-123-4567",
          jobTitle: "Senior Software Engineer",
          jobId: jobId || "1",
          appliedDate: "2024-12-10",
          status: "pending",
          experience: "5 years",
          currentLocation: "Mumbai, India",
          expectedSalary: "12000",
          currency: "AED",
          resumeUrl: "/resumes/ahmed_hassan.pdf",
          coverLetter: "I am excited to apply for this position...",
          skills: ["React", "Node.js", "MongoDB", "AWS"],
          education: "Bachelor's in Computer Science",
          availability: "Immediately",
          rating: 4.2,
          profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "2",
          candidateName: "Priya Sharma",
          email: "priya.sharma@email.com",
          phone: "+91-98765-43210",
          jobTitle: "Senior Software Engineer",
          jobId: jobId || "1",
          appliedDate: "2024-12-09",
          status: "shortlisted",
          experience: "7 years",
          currentLocation: "Bangalore, India",
          expectedSalary: "15000",
          currency: "AED",
          resumeUrl: "/resumes/priya_sharma.pdf",
          coverLetter: "With 7 years of experience in full-stack development...",
          skills: ["Angular", "Python", "PostgreSQL", "Docker"],
          education: "Master's in Software Engineering",
          availability: "2 weeks notice",
          rating: 4.7,
          profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "3",
          candidateName: "Mohammad Khan",
          email: "mohammad.khan@email.com",
          phone: "+92-300-123-4567",
          jobTitle: "Senior Software Engineer",
          jobId: jobId || "1",
          appliedDate: "2024-12-08",
          status: "interviewed",
          experience: "6 years",
          currentLocation: "Karachi, Pakistan",
          expectedSalary: "10000",
          currency: "AED",
          resumeUrl: "/resumes/mohammad_khan.pdf",
          coverLetter: "I have extensive experience in building scalable applications...",
          skills: ["Vue.js", "Laravel", "MySQL", "Redis"],
          education: "Bachelor's in Information Technology",
          availability: "1 month notice",
          rating: 4.0,
          profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "4",
          candidateName: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1-555-123-4567",
          jobTitle: "Senior Software Engineer",
          jobId: jobId || "1",
          appliedDate: "2024-12-07",
          status: "hired",
          experience: "8 years",
          currentLocation: "New York, USA",
          expectedSalary: "18000",
          currency: "AED",
          resumeUrl: "/resumes/sarah_johnson.pdf",
          coverLetter: "I am thrilled to apply for this opportunity...",
          skills: ["React Native", "TypeScript", "GraphQL", "Kubernetes"],
          education: "Master's in Computer Engineering",
          availability: "Immediately",
          rating: 4.9,
          profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "5",
          candidateName: "Raj Patel",
          email: "raj.patel@email.com",
          phone: "+91-87654-32109",
          jobTitle: "Senior Software Engineer",
          jobId: jobId || "1",
          appliedDate: "2024-12-06",
          status: "rejected",
          experience: "4 years",
          currentLocation: "Ahmedabad, India",
          expectedSalary: "8000",
          currency: "AED",
          resumeUrl: "/resumes/raj_patel.pdf",
          coverLetter: "I believe my skills align perfectly with your requirements...",
          skills: ["PHP", "CodeIgniter", "jQuery", "Bootstrap"],
          education: "Bachelor's in Computer Applications",
          availability: "Immediately",
          rating: 3.2,
          profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
        }
      ];

      setApplications(mockApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(app =>
        app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.currentLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case "oldest":
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        case "name":
          return a.candidateName.localeCompare(b.candidateName);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "experience":
          return parseInt(b.experience) - parseInt(a.experience);
        case "salary":
          return parseInt(b.expectedSalary) - parseInt(a.expectedSalary);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  };

  const getStatusBadge = (status: Application["status"]) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100 text-yellow-800", icon: "fa fa-clock" },
      shortlisted: { bg: "bg-blue-100 text-blue-800", icon: "fa fa-star" },
      interviewed: { bg: "bg-purple-100 text-purple-800", icon: "fa fa-comments" },
      hired: { bg: "bg-green-100 text-green-800", icon: "fa fa-check" },
      rejected: { bg: "bg-red-100 text-red-800", icon: "fa fa-times" }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.bg}`}>
        <i className={`${config.icon} mr-1`}></i>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = async (applicationId: string, newStatus: Application["status"]) => {
    try {
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const handleBulkStatusChange = async (newStatus: Application["status"]) => {
    if (selectedApplications.length === 0) {
      toast.error("Please select applications to update");
      return;
    }

    setBulkActionLoading(true);
    try {
      setApplications(prev => prev.map(app => 
        selectedApplications.includes(app.id) ? { ...app, status: newStatus } : app
      ));
      
      toast.success(`${selectedApplications.length} applications updated to ${newStatus}`);
      setSelectedApplications([]);
    } catch (error) {
      console.error("Error updating applications:", error);
      toast.error("Failed to update applications");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSelectApplication = (applicationId: string) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const handleViewProfile = (applicationId: string) => {
    router.push(`/candidate-profile/${applicationId}`);
  };

  const handleDownloadResume = (resumeUrl: string, candidateName: string) => {
    // Mock download functionality
    toast.info(`Downloading resume for ${candidateName}`);
    // In real implementation: window.open(resumeUrl, '_blank');
  };

  const handleScheduleInterview = (applicationId: string) => {
    toast.info("Interview scheduling feature coming soon!");
    // router.push(`/schedule-interview/${applicationId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fa fa-star text-sm ${
              i < fullStars 
                ? 'text-yellow-400' 
                : i === fullStars && hasHalfStar 
                  ? 'text-yellow-400' 
                  : 'text-gray-300'
            }`}
          ></i>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Candidate Applications - Review Applications | Overseas.ai</title>
        <meta name="description" content="Review and manage candidate applications for your job postings." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold textBlue mb-2">
              <i className="fa fa-users mr-3"></i>
              Candidate Applications
            </h1>
            <p className="text-gray-600">
              Review and manage applications for your job postings
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/hra-jobs")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Jobs
            </button>
            <button
              onClick={() => router.push("/hra-dashboard")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-dashboard mr-2"></i>
              Dashboard
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { status: "pending", label: "Pending Review", color: "yellow" },
            { status: "shortlisted", label: "Shortlisted", color: "blue" },
            { status: "interviewed", label: "Interviewed", color: "purple" },
            { status: "hired", label: "Hired", color: "green" },
            { status: "rejected", label: "Rejected", color: "red" }
          ].map(({ status, label, color }) => {
            const count = applications.filter(app => app.status === status).length;
            return (
              <div key={status} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-center">
                  <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
                  <p className="text-sm text-gray-600">{label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Bulk Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Candidates</label>
              <div className="relative">
                <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by name, email, skills..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest Applications</option>
                <option value="oldest">Oldest Applications</option>
                <option value="name">Name (A-Z)</option>
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experience</option>
                <option value="salary">Highest Expected Salary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected ({selectedApplications.length})
              </label>
              <button
                onClick={handleSelectAll}
                className="w-full border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <i className="fa fa-check-square mr-2"></i>
                {selectedApplications.length === filteredApplications.length ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedApplications.length > 0 && (
            <div className="flex space-x-2 pt-4 border-t">
              <span className="text-sm text-gray-600 self-center">
                Bulk Actions for {selectedApplications.length} selected:
              </span>
              <button
                onClick={() => handleBulkStatusChange("shortlisted")}
                disabled={bulkActionLoading}
                className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded"
              >
                Shortlist
              </button>
              <button
                onClick={() => handleBulkStatusChange("interviewed")}
                disabled={bulkActionLoading}
                className="text-purple-600 hover:text-purple-800 text-sm px-2 py-1 rounded"
              >
                Mark Interviewed
              </button>
              <button
                onClick={() => handleBulkStatusChange("hired")}
                disabled={bulkActionLoading}
                className="text-green-600 hover:text-green-800 text-sm px-2 py-1 rounded"
              >
                Hire
              </button>
              <button
                onClick={() => handleBulkStatusChange("rejected")}
                disabled={bulkActionLoading}
                className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <i className="fa fa-users text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Found</h3>
            <p className="text-gray-500">
              {applications.length === 0 ? "No applications received yet." : "No applications match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => handleSelectApplication(application.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      
                      <div className="flex-shrink-0">
                        <img
                          src={application.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(application.candidateName)}&background=random`}
                          alt={application.candidateName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold textBlue mr-3">{application.candidateName}</h3>
                          {getRatingStars(application.rating)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <i className="fa fa-envelope mr-1"></i>
                            {application.email}
                          </div>
                          <div>
                            <i className="fa fa-phone mr-1"></i>
                            {application.phone}
                          </div>
                          <div>
                            <i className="fa fa-map-marker mr-1"></i>
                            {application.currentLocation}
                          </div>
                          <div>
                            <i className="fa fa-money mr-1"></i>
                            {application.currency} {application.expectedSalary}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <i className="fa fa-briefcase mr-1"></i>
                            {application.experience} experience
                          </div>
                          <div>
                            <i className="fa fa-graduation-cap mr-1"></i>
                            {application.education}
                          </div>
                          <div>
                            <i className="fa fa-calendar mr-1"></i>
                            Available: {application.availability}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {application.skills.slice(0, 5).map((skill, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                            {application.skills.length > 5 && (
                              <span className="text-gray-500 text-xs">+{application.skills.length - 5} more</span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Applied:</span> {formatDate(application.appliedDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3 ml-6">
                      {getStatusBadge(application.status)}
                      
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application.id, e.target.value as Application["status"])}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewProfile(application.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <i className="fa fa-user mr-1"></i>
                        View Profile
                      </button>
                      
                      <button
                        onClick={() => handleDownloadResume(application.resumeUrl, application.candidateName)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        <i className="fa fa-download mr-1"></i>
                        Download Resume
                      </button>
                      
                      <button
                        onClick={() => handleScheduleInterview(application.id)}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        <i className="fa fa-calendar mr-1"></i>
                        Schedule Interview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
