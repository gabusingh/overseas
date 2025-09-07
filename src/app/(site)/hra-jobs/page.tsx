"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { useHraData } from "@/contexts/HraDataProvider";
import { getJobApplications, getAppliedCandidatesList } from "@/services/hra.service";

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
  const { dashboardData, jobsData, loading, error, fetchHraData, refreshData } = useHraData();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [expandedJobs, setExpandedJobs] = useState<string[]>([]);
  const [jobApplications, setJobApplications] = useState<Record<string, any[]>>({});
  const [loadingApplications, setLoadingApplications] = useState<Record<string, boolean>>({});

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    transformAndSetJobs();
  }, [jobsData]);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery, statusFilter, sortBy]);

  const initializeData = async () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("loggedUser");
    
    if (!token || !user) {
      router.push("/login");
      return;
    }

    // Force refresh to get latest data
    await fetchHraData(true);
  };

  const transformAndSetJobs = () => {
    if (!jobsData || jobsData.length === 0) {
      setJobs([]);
      return;
    }

    // Transform jobs data from context to match Job interface - stricter validation
    const validJobs = jobsData.filter((job: any) => {
      // Only include jobs with required fields
      const hasId = job.id || job.jobID;
      const hasTitle = job.jobTitle || job.title;
      
      if (!hasId || !hasTitle) {
        return false;
      }
      
      return true;
    });

    const transformedJobs: Job[] = validJobs.map((job: any, index: number) => {
      const transformedJob = {
        id: (job.id || job.jobID).toString(),
        title: job.jobTitle || job.title,
        company: job.company || job.cmpName || job.companyName || "Your Company",
        location: job.location || job.jobLocation || job.country_location || job.jobLocationCountry?.name || "Location TBD",
        country: job.country || job.jobLocationCountry?.name || job.country_location || "Country TBD",
        jobType: job.jobType || job.job_type || "full-time",
        salaryRange: job.salaryRange || (job.jobWages ? job.jobWages.toString() : "Negotiable"),
        currency: job.currency || job.jobWagesCurrencyType || job.jobLocationCountry?.currencyName || "USD",
        postedDate: job.postedDate || job.created_at || new Date().toISOString().split('T')[0],
        applicationDeadline: job.applicationDeadline || job.jobDeadline || "",
        status: (job.status as Job["status"]) || "active",
        applicationsCount: job.applicationsCount || job.totalAppliedCandidates || 0,
        viewsCount: job.viewsCount || 0,
        shortlistedCount: job.shortlistedCount || 0,
        experienceLevel: job.experienceLevel || job.jobExpTypeReq || "all",
        isUrgent: Boolean(job.isUrgent || job.urgent),
        isFeatured: Boolean(job.isFeatured || job.featured)
      };
      
      return transformedJob;
    });

    setJobs(transformedJobs);
  };

  const handleRefresh = async () => {
    try {
      await refreshData(); // Use context refresh function
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
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
      active: { bg: "bg-blue-100 text-green-800", icon: "fa fa-play" },
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
      toast.error("Failed to delete job");
    }
  };

  const handleEditJob = (jobId: string) => {
    router.push(`/edit-job/${jobId}`);
  };

  const handleViewApplications = (jobId: string) => {
    router.push(`/view-candidate-application-list?jobId=${jobId}`);
  };

  const handleGetRecommendations = (jobId: string) => {
    router.push(`/recommended-candidates?jobId=${jobId}`);
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

  const toggleJobExpansion = async (jobId: string) => {
    if (expandedJobs.includes(jobId)) {
      // Collapse
      setExpandedJobs(prev => prev.filter(id => id !== jobId));
    } else {
      // Expand and fetch applications if not already loaded
      setExpandedJobs(prev => [...prev, jobId]);
      
      if (!jobApplications[jobId] && !loadingApplications[jobId]) {
        fetchJobApplications(jobId);
      }
    }
  };

  const fetchJobApplications = async (jobId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // Get the current job to preserve original count if needed
    const currentJob = jobs.find(job => job.id === jobId);
    const originalCount = currentJob?.applicationsCount || 0;

    setLoadingApplications(prev => ({ ...prev, [jobId]: true }));
    
    try {
      // Try to fetch applications for this specific job
      const response = await getJobApplications(parseInt(jobId), token);
      
      const candidatesData = response?.data || response || [];
      
      // Transform the data - handle various response formats
      let applications = [];
      if (Array.isArray(candidatesData)) {
        applications = candidatesData;
      } else if (candidatesData.candidates) {
        applications = candidatesData.candidates;
      } else if (candidatesData.applications) {
        applications = candidatesData.applications;
      } else if (candidatesData.data && Array.isArray(candidatesData.data)) {
        applications = candidatesData.data;
      }
      
      // If API returns 0 but we had a count before, try the fallback
      if (applications.length === 0 && originalCount > 0) {
        // Try the dashboard's latest candidates as a source
        if (dashboardData?.latestAppliedCandidates && dashboardData.latestAppliedCandidates.length > 0) {
          // Use the latest candidates but limit to original count for this job
          const candidatesToShow = dashboardData.latestAppliedCandidates.slice(0, Math.min(originalCount, 6));
          
          // Mark as approximate data since these might not be job-specific
          (candidatesToShow as any).isApproximate = true;
          
          setJobApplications(prev => ({ ...prev, [jobId]: candidatesToShow }));
          
          // Keep the original count since we know there are applications
          // Don't update the count - keep it as is
          setLoadingApplications(prev => ({ ...prev, [jobId]: false }));
          return;
        }
      }
      
      // Only update count if we actually got data
      if (applications.length > 0) {
        // Update the job's application count to match actual data
        setJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { ...job, applicationsCount: applications.length }
            : job
        ));
      } else {
        }
      
      setJobApplications(prev => ({ ...prev, [jobId]: applications }));
    } catch (error) {
      // Try fallback to general candidates list
      try {
        const fallbackResponse = await getAppliedCandidatesList(token);
        
        let candidatesToShow = [];
        const allCandidates = Array.isArray(fallbackResponse?.data) ? fallbackResponse.data : 
                              Array.isArray(fallbackResponse) ? fallbackResponse : [];
        
        if (allCandidates.length > 0) {
          // First, try to filter candidates for this specific job
          const filteredCandidates = allCandidates.filter((candidate: any) => {
            const candidateJobId = candidate.jobId || candidate.appliedJobId || candidate.job_id || candidate.jobID;
            return candidateJobId && candidateJobId.toString() === jobId.toString();
          });
          
          if (filteredCandidates.length > 0) {
            candidatesToShow = filteredCandidates;
          } else if (originalCount > 0) {
            // If we can't filter but know there are applications, show recent candidates
            candidatesToShow = allCandidates.slice(0, Math.min(originalCount, 6));
            // Mark as approximate since these are not job-specific
            (candidatesToShow as any).isApproximate = true;
          }
        }
        
        // If still no candidates but original count > 0, use dashboard data
        if (candidatesToShow.length === 0 && originalCount > 0 && dashboardData?.latestAppliedCandidates) {
          candidatesToShow = dashboardData.latestAppliedCandidates.slice(0, Math.min(originalCount, 6));
          // Mark as approximate
          (candidatesToShow as any).isApproximate = true;
        }
        
        setJobApplications(prev => ({ ...prev, [jobId]: candidatesToShow }));
        
        // Preserve original count if we had one and found some candidates to show
        if (originalCount > 0 && candidatesToShow.length > 0) {
          // Don't update the count
        } else if (candidatesToShow.length > 0) {
          // Update to actual found count
          setJobs(prev => prev.map(job => 
            job.id === jobId 
              ? { ...job, applicationsCount: candidatesToShow.length }
              : job
          ));
        }
      } catch (fallbackError) {
        // Even if API fails, if we have dashboard candidates and original count > 0, show them
        if (originalCount > 0 && dashboardData?.latestAppliedCandidates && dashboardData.latestAppliedCandidates.length > 0) {
          const candidatesToShow = dashboardData.latestAppliedCandidates.slice(0, Math.min(originalCount, 6));
          // Mark as approximate
          (candidatesToShow as any).isApproximate = true;
          setJobApplications(prev => ({ ...prev, [jobId]: candidatesToShow }));
          } else {
          setJobApplications(prev => ({ ...prev, [jobId]: [] }));
        }
      }
    } finally {
      setLoadingApplications(prev => ({ ...prev, [jobId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading your jobs...</p>
          <p className="mt-2 text-sm text-gray-500">Fetching data from server...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <i className="fa fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Jobs</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleRefresh}
              className="bg-[#17487f] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fa fa-refresh mr-2"></i>
              Try Again
            </button>
            <button
              onClick={() => router.push("/hra-dashboard")}
              className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Dashboard
            </button>
            {error.includes('HR User ID not found') && (
              <button
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Re-login as HR User
              </button>
            )}
          </div>
          
          {/* Debug information */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left text-xs text-gray-500">
              <summary className="cursor-pointer">Debug Information</summary>
              <div className="mt-2 p-3 bg-gray-100 rounded">
                <p className="mb-1"><strong>Jobs Data:</strong> {jobsData ? `${jobsData.length} items` : 'null'}</p>
                <p className="mb-1"><strong>Dashboard Data:</strong> {dashboardData ? 'Available' : 'null'}</p>
                <p className="mb-1"><strong>Error:</strong> {error}</p>
                <p className="mb-1"><strong>LocalStorage User:</strong> {localStorage.getItem('user') ? 'Present' : 'Missing'}</p>
                <p className="mb-1"><strong>LocalStorage Token:</strong> {localStorage.getItem('access_token') ? 'Present' : 'Missing'}</p>
              </div>
            </details>
          )}
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
                <p className="text-2xl font-bold textBlue">
                  {dashboardData?.totalPostedJobs ?? jobs.filter(j => j.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Total Posted Jobs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fa fa-users text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData?.totalAppliedCandidates ?? jobs.reduce((sum, job) => sum + job.applicationsCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fa fa-layer-group text-orange-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-orange-600">
                  {dashboardData?.totalPostedBulkHiring ?? 0}
                </p>
                <p className="text-sm text-gray-600">Bulk Hiring Posts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fa fa-chart-line text-purple-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-purple-600">
                  {jobs.filter(j => j.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Applied Candidates Section */}
        {dashboardData?.latestAppliedCandidates && dashboardData.latestAppliedCandidates.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold textBlue">
                <i className="fa fa-users mr-2"></i>
                Recent Applications
              </h2>
              <span className="text-sm text-gray-500">
                {dashboardData.latestAppliedCandidates.length} recent candidates
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.latestAppliedCandidates.slice(0, 6).map((candidate, index) => (
                <div key={candidate.id || index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-blue-100 flex items-center justify-center">
                    {candidate.empPhoto && candidate.empPhoto !== 'https://backend.overseas.ai/placeholder/person.jpg' ? (
                      <img 
                        src={candidate.empPhoto} 
                        alt={candidate.empName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <i className="fa fa-user text-blue-600 text-lg"></i>
                    )}
                    <div className="hidden w-full h-full flex items-center justify-center">
                      <i className="fa fa-user text-blue-600 text-lg"></i>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {candidate.empName || 'Unknown Candidate'}
                    </h3>
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <i className="fa fa-map-marker mr-1"></i>
                      <span className="truncate">
                        {candidate.empDistrict}, {candidate.empState}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        Age: {candidate.age}
                      </span>
                      <span className="text-xs text-blue-600">
                        Applied: {candidate.appliedOn}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Commented out since view applications not giving actual data
            {dashboardData.latestAppliedCandidates.length > 6 && (
              <div className="text-center mt-4">
                <button 
                  onClick={() => router.push('/view-candidate-application-list')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All Applications ({dashboardData.latestAppliedCandidates.length})
                  <i className="fa fa-arrow-right ml-1"></i>
                </button>
              </div>
            )}
            */}
          </div>
        )}

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
                onClick={handleRefresh}
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
                        onClick={() => toggleJobExpansion(job.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <i className={`fa ${expandedJobs.includes(job.id) ? 'fa-chevron-up' : 'fa-chevron-down'} mr-1`}></i>
                        {expandedJobs.includes(job.id) ? 'Hide' : 'Show'} Applications ({job.applicationsCount})
                      </button>
                      
                      <button
                        onClick={() => handleGetRecommendations(job.id)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors"
                      >
                        <i className="fa fa-magic mr-1"></i>
                        Get AI Recommendations
                      </button>
                      
                      {/* Commented out since view applications not giving actual data
                      <button
                        onClick={() => handleViewApplications(job.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        <i className="fa fa-external-link mr-1"></i>
                        Full View
                      </button>
                      */}
                      
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

                  {/* Expandable Candidates Section */}
                  {expandedJobs.includes(job.id) && (
                    <div className="mt-4 pt-4 border-t bg-gray-50 -mx-6 px-6 pb-4">
                      {loadingApplications[job.id] ? (
                        <div className="text-center py-8">
                          <div className="inline-flex items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-gray-600">Loading candidates...</span>
                          </div>
                        </div>
                      ) : jobApplications[job.id] && jobApplications[job.id].length > 0 ? (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-4">
                            <i className="fa fa-users mr-2 text-blue-600"></i>
                            Candidates Applied ({jobApplications[job.id].length})
                            {(jobApplications[job.id] as any).isApproximate && (
                              <span className="ml-2 text-xs text-orange-600 font-normal">
                                <i className="fa fa-info-circle mr-1"></i>
                                Showing recent candidates (specific data unavailable)
                              </span>
                            )}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {jobApplications[job.id].slice(0, 6).map((candidate: any, index: number) => (
                              <div key={candidate.id || index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start space-x-3">
                                  <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    {candidate.empPhoto && candidate.empPhoto !== 'https://backend.overseas.ai/placeholder/person.jpg' ? (
                                      <img 
                                        src={candidate.empPhoto} 
                                        alt={candidate.empName || candidate.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                      />
                                    ) : (
                                      <i className="fa fa-user text-blue-600 text-lg"></i>
                                    )}
                                    <i className="fa fa-user text-blue-600 text-lg hidden"></i>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-gray-800 truncate">
                                      {candidate.empName || candidate.name || 'Unknown Candidate'}
                                    </h5>
                                    {(candidate.empEmail || candidate.email) && (
                                      <p className="text-xs text-gray-600 truncate">
                                        <i className="fa fa-envelope mr-1"></i>
                                        {candidate.empEmail || candidate.email}
                                      </p>
                                    )}
                                    {(candidate.empPhone || candidate.phone) && (
                                      <p className="text-xs text-gray-600">
                                        <i className="fa fa-phone mr-1"></i>
                                        {candidate.empPhone || candidate.phone}
                                      </p>
                                    )}
                                    {(candidate.empDistrict || candidate.empState || candidate.location) && (
                                      <p className="text-xs text-gray-600">
                                        <i className="fa fa-map-marker mr-1"></i>
                                        {candidate.location || `${candidate.empDistrict || ''} ${candidate.empState || ''}`.trim()}
                                      </p>
                                    )}
                                    {(candidate.experience || candidate.empExperience) && (
                                      <p className="text-xs text-gray-600">
                                        <i className="fa fa-briefcase mr-1"></i>
                                        {candidate.experience || candidate.empExperience} experience
                                      </p>
                                    )}
                                    {candidate.appliedOn && (
                                      <p className="text-xs text-blue-600 mt-1">
                                        Applied: {new Date(candidate.appliedOn).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-col space-y-1">
                                    <button
                                      onClick={() => router.push(`/candidate-profile/${candidate.id || candidate.empId}`)}
                                      className="text-xs text-blue-600 hover:text-blue-800"
                                      title="View Profile"
                                    >
                                      <i className="fa fa-eye"></i>
                                    </button>
                                    <button
                                      className="text-xs text-green-600 hover:text-green-800"
                                      title="Contact"
                                    >
                                      <i className="fa fa-comment"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Commented out since view applications not giving actual data
                          {jobApplications[job.id].length > 6 && (
                            <div className="mt-4 text-center">
                              <button
                                onClick={() => handleViewApplications(job.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View All {jobApplications[job.id].length} Candidates
                                <i className="fa fa-arrow-right ml-2"></i>
                              </button>
                            </div>
                          )}
                          */}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <i className="fa fa-inbox text-3xl mb-3 text-gray-300"></i>
                          <p>No applications received yet</p>
                          <p className="text-sm mt-1">Share this job to attract candidates</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
