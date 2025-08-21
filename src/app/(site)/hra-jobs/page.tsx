"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { getAllCreatedJobs } from "@/services/hra.service";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  jobType: string;
  salaryRange: string;
  currency: string;
  postedDate: string;
  applicationDeadline: string;
  status: "active" | "paused" | "closed" | "draft";
  applicationsCount: number;
  viewsCount: number;
  shortlistedCount: number;
  experienceLevel: string;
  isUrgent: boolean;
  isFeatured: boolean;
}

export default function HraViewJobsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery, statusFilter, sortBy]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("loggedUser");
      
      if (!token || !user) {
        router.push("/login");
        return;
      }

      // Fetch all created jobs using the correct API as per hraapi.md
      const response = await getAllCreatedJobs(token);
      
      // Transform API response to match Job interface
      const jobsData = response?.data || response || [];
      const transformedJobs: Job[] = (Array.isArray(jobsData) ? jobsData : []).map((job: any) => ({
        id: job.id?.toString() || job.jobId?.toString() || Math.random().toString(),
        title: job.jobTitle || job.title || "Untitled Job",
        company: job.company || job.cmpName || "Company Name",
        location: job.location || job.jobLocation || job.country_location || "Multiple Locations",
        country: job.country || job.jobLocationCountry?.name || job.country_location || "Unknown",
        jobType: job.jobType || job.job_type || "full-time",
        salaryRange: job.salaryRange || job.jobWages?.toString() || "TBD",
        currency: job.currency || job.jobWagesCurrencyType || job.jobLocationCountry?.currencyName || "USD",
        postedDate: job.postedDate || job.created_at || new Date().toISOString().split('T')[0],
        applicationDeadline: job.applicationDeadline || job.jobDeadline || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        status: job.status || "active" as Job["status"],
        applicationsCount: job.applicationsCount || job.totalAppliedCandidates || 0,
        viewsCount: job.viewsCount || 0,
        shortlistedCount: job.shortlistedCount || 0,
        experienceLevel: job.experienceLevel || job.jobExpTypeReq || "all",
        isUrgent: job.isUrgent || false,
        isFeatured: job.isFeatured || false
      }));

      setJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs. Please try again.");
      
      // Set empty array on error to prevent UI crashes
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case "oldest":
          return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        case "applications":
          return b.applicationsCount - a.applicationsCount;
        case "views":
          return b.viewsCount - a.viewsCount;
        case "deadline":
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const getStatusBadge = (status: Job["status"]) => {
    const statusConfig = {
      active: { bg: "bg-green-100 text-green-800", icon: "fa fa-play" },
      paused: { bg: "bg-yellow-100 text-yellow-800", icon: "fa fa-pause" },
      closed: { bg: "bg-red-100 text-red-800", icon: "fa fa-stop" },
      draft: { bg: "bg-gray-100 text-gray-800", icon: "fa fa-edit" }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.bg}`}>
        <i className={`${config.icon} mr-1`}></i>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = async (jobId: string, newStatus: Job["status"]) => {
    try {
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      toast.success(`Job status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }

    try {
      setJobs(prev => prev.filter(job => job.id !== jobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  const handleEditJob = (jobId: string) => {
    router.push(`/edit-jobs/${jobId}`);
  };

  const handleViewApplications = (jobId: string) => {
    router.push(`/view-candidate-application-list?jobId=${jobId}`);
  };

  const handleDuplicateJob = async (jobId: string) => {
    try {
      const jobToDuplicate = jobs.find(job => job.id === jobId);
      if (!jobToDuplicate) return;

      const duplicatedJob: Job = {
        ...jobToDuplicate,
        id: `${Date.now()}`,
        title: `${jobToDuplicate.title} (Copy)`,
        postedDate: new Date().toISOString().split('T')[0],
        status: "draft",
        applicationsCount: 0,
        viewsCount: 0,
        shortlistedCount: 0
      };

      setJobs(prev => [duplicatedJob, ...prev]);
      toast.success("Job duplicated successfully");
    } catch (error) {
      console.error("Error duplicating job:", error);
      toast.error("Failed to duplicate job");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold textBlue mb-2">
              <i className="fa fa-briefcase mr-3"></i>
              My Job Postings
            </h1>
            <p className="text-gray-600">
              Manage your job postings and track application performance
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/create-jobs")}
              className="bgBlue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fa fa-plus mr-2"></i>
              Create New Job
            </button>
            <button
              onClick={() => router.push("/hra-dashboard")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fa fa-briefcase textBlue"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold textBlue">{jobs.filter(j => j.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fa fa-users text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-green-600">
                  {jobs.reduce((sum, job) => sum + job.applicationsCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fa fa-eye text-yellow-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-yellow-600">
                  {jobs.reduce((sum, job) => sum + job.viewsCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fa fa-star text-purple-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-purple-600">
                  {jobs.reduce((sum, job) => sum + job.shortlistedCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Shortlisted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
              <div className="relative">
                <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by title, company, or location..."
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
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="applications">Most Applications</option>
                <option value="views">Most Views</option>
                <option value="deadline">Deadline Soon</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              <button
                onClick={fetchJobs}
                className="w-full border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <i className="fa fa-refresh mr-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <i className="fa fa-briefcase text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Jobs Found</h3>
            <p className="text-gray-500 mb-6">
              {jobs.length === 0 ? "You haven't posted any jobs yet." : "No jobs match your current filters."}
            </p>
            <button
              onClick={() => router.push("/create-jobs")}
              className="bgBlue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fa fa-plus mr-2"></i>
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold textBlue mr-3">{job.title}</h3>
                        {job.isUrgent && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-semibold rounded-full mr-2">
                            Urgent
                          </span>
                        )}
                        {job.isFeatured && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 text-xs font-semibold rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <i className="fa fa-building mr-1"></i>
                          {job.company}
                        </div>
                        <div>
                          <i className="fa fa-map-marker mr-1"></i>
                          {job.location}, {job.country}
                        </div>
                        <div>
                          <i className="fa fa-money mr-1"></i>
                          {job.currency} {job.salaryRange}
                        </div>
                        <div>
                          <i className="fa fa-clock mr-1"></i>
                          {getDaysRemaining(job.applicationDeadline)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div>
                          <i className="fa fa-users mr-1"></i>
                          {job.applicationsCount} applications
                        </div>
                        <div>
                          <i className="fa fa-eye mr-1"></i>
                          {job.viewsCount} views
                        </div>
                        <div>
                          <i className="fa fa-star mr-1"></i>
                          {job.shortlistedCount} shortlisted
                        </div>
                        <div>
                          <i className="fa fa-calendar mr-1"></i>
                          Posted {formatDate(job.postedDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      {getStatusBadge(job.status)}
                      
                      <div className="relative">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value as Job["status"])}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="closed">Closed</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewApplications(job.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <i className="fa fa-users mr-1"></i>
                        View Applications ({job.applicationsCount})
                      </button>
                      
                      <button
                        onClick={() => handleEditJob(job.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        <i className="fa fa-edit mr-1"></i>
                        Edit
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDuplicateJob(job.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                        title="Duplicate job"
                      >
                        <i className="fa fa-copy"></i>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        title="Delete job"
                      >
                        <i className="fa fa-trash"></i>
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
