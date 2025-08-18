"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";
import { Filter, Search, MapPin, Building, Clock, DollarSign, Heart, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { getJobList, saveJobById, getOccupations, applyJobApi } from "../../../services/job.service";
import { getCountriesForJobs } from "../../../services/info.service";
import JobFilter from "../../../components/JobFilter";
import SearchComponent from "../../../components/SearchComponent";
import ProfileCompletionModal from "../../../components/ProfileCompletionModal";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useGlobalState } from "../../../contexts/GlobalProvider";

interface Job {
  id: number;
  jobTitle: string;
  cmpName?: string;
  company?: string;
  jobLocationCountry?: {
    name: string;
    countryFlag: string;
  };
  jobWages?: number;
  jobWagesCurrencyType?: string;
  jobPhoto?: string;
  created_at?: string;
  jobDeadline?: string;
  jobExpTypeReq?: string;
  occupation?: string;
  jobAgeLimit?: string;
  passportType?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [savedJobs, setSavedJobs] = useState<(string | number)[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [paginationType, setPaginationType] = useState<'pagination' | 'loadMore'>('loadMore');
  const [payload, setPayload] = useState({
    jobOccupation: [] as number[],
    jobLocationCountry: [] as number[],
    passportType: "",
    languageRequired: [] as string[],
    contractPeriod: "",
    jobExpTypeReq: "",
    sortBy: ""
  });

  const [categories, setCategories] = useState<Array<{label: string, value: number, count?: number}>>([]);
  const [countries, setCountries] = useState<Array<{label: string, value: number, count?: number}>>([]);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { globalState } = useGlobalState();
  const jobsPerPage = 10;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Apply job function with profile completion modal
  const handleApplyJob = async (jobId: number) => {
    // Check authentication exactly like the old code using globalState
    if (!globalState?.user) {
      toast.warning("Please login to apply");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    let payload = {
      id: jobId,
      "apply-job": "",
    };
    
    try {
      let response = await applyJobApi(
        payload,
        globalState?.user?.access_token
      );
      if (response?.data?.msg == "Job Applied Successfully") {
        toast.success(response?.data?.msg);
      } else if (response?.data?.error === "You did not fill mandatory fields.") {
        // Show profile completion modal instead of redirecting
        setSelectedJobId(jobId);
        setShowProfileModal(true);
      } else {
        toast.error(response?.data?.error || "Something went wrong");
      }
    } catch (error: any) {
      console.error('Apply job error:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Internal Server Error";
      if (errorMessage === "You did not fill mandatory fields.") {
        // Show profile completion modal instead of redirecting
        setSelectedJobId(jobId);
        setShowProfileModal(true);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Save job function
  const handleSaveJob = async (jobId: number) => {
    if (!globalState?.user) {
      toast.warning("Please login to save jobs");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    try {
      const response = await saveJobById(jobId, globalState?.user?.access_token);
      if (response?.data?.msg === "Job saved successfully") {
        toast.success("Job saved successfully!");
        setSavedJobs(prev => [...prev, jobId]);
      } else {
        toast.error(response?.data?.error || "Failed to save job");
      }
    } catch (error: any) {
      console.error('Save job error:', error);
      toast.error(error?.response?.data?.error || "Failed to save job");
    }
  };

  // Fetch jobs with pagination
  const fetchJobs = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      const isInitialLoad = page === 1 && !append;
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const formData = new FormData();
      formData.append('page', page.toString());
      formData.append('per_page', jobsPerPage.toString());

      // Add filter payload
      if (payload.jobOccupation.length > 0) {
        payload.jobOccupation.forEach(id => formData.append('jobOccupation[]', id.toString()));
      }
      if (payload.jobLocationCountry.length > 0) {
        payload.jobLocationCountry.forEach(id => formData.append('jobLocationCountry[]', id.toString()));
      }
      if (payload.passportType) {
        formData.append('passportType', payload.passportType);
      }
      if (payload.languageRequired.length > 0) {
        payload.languageRequired.forEach(lang => formData.append('languageRequired[]', lang));
      }
      if (payload.contractPeriod) {
        formData.append('contractPeriod', payload.contractPeriod);
      }
      if (payload.jobExpTypeReq) {
        formData.append('jobExpTypeReq', payload.jobExpTypeReq);
      }
      if (payload.sortBy) {
        formData.append('sortBy', payload.sortBy);
      }

      const response = await getJobList(formData);
      
      if (response?.jobs) {
        const newJobs = response.jobs;
        const totalPagesCount = response.lastPage || Math.ceil((response.totalJobs || 0) / jobsPerPage);
        
        if (append) {
          setJobs(prev => [...prev, ...newJobs]);
        } else {
          setJobs(newJobs);
        }
        
        setTotalPages(totalPagesCount);
        setTotalJobs(response.totalJobs || newJobs.length);
        setCurrentPage(page);
        setHasMore(page < totalPagesCount);
      } else {
        if (append) {
          setHasMore(false);
        } else {
          setJobs([]);
          setTotalPages(0);
          setTotalJobs(0);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs. Please try again.');
      if (append) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [payload, jobsPerPage, globalState?.user]);

  // Load more jobs
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      fetchJobs(nextPage, true);
    }
  }, [loadingMore, hasMore, currentPage, fetchJobs]);

  // Handle page change for pagination
  const handlePageChange = useCallback((page: number) => {
    if (page !== currentPage && !loading) {
      fetchJobs(page, false);
    }
  }, [currentPage, loading, fetchJobs]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (paginationType === 'loadMore' && hasMore && !loadingMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            handleLoadMore();
          }
        },
        { threshold: 0.1 }
      );

      if (loadMoreRef.current) {
        observer.observe(loadMoreRef.current);
      }

      observerRef.current = observer;

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [paginationType, hasMore, loadingMore, handleLoadMore]);

  // Fetch initial data
  useEffect(() => {
    fetchJobs(1, false);
  }, [fetchJobs]);

  // Fetch categories and countries
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getOccupations();
        const occupationData = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        const categories = occupationData.map((item: any) => ({
          label: item.occupation || item.title || item.name,
          value: item.id,
          count: 0
        }));
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await getCountriesForJobs();
        const countryData = Array.isArray(response?.countries) ? response.countries : Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        const countries = countryData.map((item: any) => ({
          label: item.name,
          value: item.id,
          count: 0
        }));
        setCountries(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCategories();
    fetchCountries();
  }, []);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Format salary
  const formatSalary = (wages?: number, currency?: string) => {
    if (!wages || !currency) return "Competitive";
    return `${currency} ${wages.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover thousands of job opportunities with all the information you need. It&apos;s your future.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <i className="fa fa-briefcase"></i>
                {totalJobs.toLocaleString()} Jobs Available
              </span>
              <span className="flex items-center gap-2">
                <i className="fa fa-globe"></i>
                Global Opportunities
              </span>
            </div>
            
            <Button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md"
            >
              <Filter className="w-4 h-4" />
              All Filters
            </Button>
          </div>
          
          {/* Enhanced Search Bar - Naukri Style */}
          <div className="bg-white">
            <SearchComponent fullWidth={true} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className={`w-64 flex-shrink-0 ${showFilter ? 'block' : 'hidden lg:block'}`}>
            {showFilter && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setShowFilter(false)} />
            )}
            <div className={`${showFilter ? 'fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:inset-auto lg:w-64 lg:sticky lg:top-6 lg:max-h-[calc(100vh-8rem)]' : 'lg:sticky lg:top-6 lg:max-h-[calc(100vh-8rem)]'}`}>
              <JobFilter 
                setShowFilter={setShowFilter}
                payload={payload}
                setPayload={setPayload}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Results Header - Clean Naukri Style */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 mb-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {totalJobs.toLocaleString()} Jobs
                  </h2>
                  {totalPages > 0 && (
                    <span className="text-sm text-gray-500">
                      | Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sort by</span>
                  <select
                    value={payload.sortBy}
                    onChange={(e) => setPayload(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
                  >
                    <option value="">Relevance</option>
                    <option value="salary_desc">Salary (High to Low)</option>
                    <option value="salary_asc">Salary (Low to High)</option>
                    <option value="company">Company</option>
                    <option value="deadline">Date Posted</option>
                  </select>
                  
                  {/* Pagination Type Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View:</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setPaginationType('loadMore')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          paginationType === 'loadMore' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Load More
                      </button>
                      <button
                        onClick={() => setPaginationType('pagination')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          paginationType === 'pagination' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Pages
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 animate-pulse">
                  {/* Header Skeleton */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="flex gap-4 mb-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </div>
                  
                  {/* Details Skeleton */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  
                  {/* Actions Skeleton */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="flex gap-3">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                  <CardContent className="p-4 sm:p-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-blue-600 mb-2 hover:text-blue-700 cursor-pointer">
                          <Link href={`/job-description/${job.id}`}>
                            {job.jobTitle}
                          </Link>
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.cmpName || job.company || "Company"}
                          </span>
                          {job.jobLocationCountry && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.jobLocationCountry.name}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Save Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveJob(job.id)}
                        className={`p-2 rounded-full ${
                          savedJobs.includes(job.id) 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalary(job.jobWages, job.jobWagesCurrencyType)}</span>
                      </div>
                      
                      {job.occupation && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="w-4 h-4" />
                          <span>{job.occupation}</span>
                        </div>
                      )}
                      
                      {job.jobExpTypeReq && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {job.jobExpTypeReq} experience
                          </Badge>
                        </div>
                      )}
                      
                      {job.jobAgeLimit && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            Age: {job.jobAgeLimit} years
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Bottom Section - Posted Date and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                      {/* Posted Date */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Posted {formatDate(job.created_at)}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 px-4 py-2 h-8 text-xs font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/job-description/${job.id}`);
                          }}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-8 text-xs font-medium"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/job-description/${job.id}`);

                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {paginationType === 'loadMore' && hasMore && !loading && (
            <div ref={loadMoreRef} className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Load More Jobs
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Load More Loading State */}
          {paginationType === 'loadMore' && loadingMore && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more jobs...</span>
              </div>
            </div>
          )}

          {/* End of Results */}
          {paginationType === 'loadMore' && !hasMore && jobs.length > 0 && (
            <div className="text-center mt-8 py-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
                <ChevronUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                 <h3 className="text-lg font-semibold text-gray-900 mb-2">You&apos;ve reached the end!</h3>
                 <p className="text-gray-600 text-sm">
                   You&apos;ve seen all {totalJobs} available jobs. Check back later for new opportunities.
                 </p>
              </div>
            </div>
          )}

            {/* Pagination - Enhanced */}
            {paginationType === 'pagination' && totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 py-8">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    <i className="fa fa-chevron-left mr-2"></i>
                    Previous
                  </Button>
                  
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    // First page
                    if (startPage > 1) {
                      pages.push(
                        <Button key={1} variant="outline" onClick={() => handlePageChange(1)}>1</Button>
                      );
                      if (startPage > 2) {
                        pages.push(<span key="dots1" className="px-2 text-gray-500">...</span>);
                      }
                    }

                    // Visible pages
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          variant={currentPage === i ? "default" : "outline"}
                          className={currentPage === i ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                        >
                          {i}
                        </Button>
                      );
                    }

                    // Last page
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="dots2" className="px-2 text-gray-500">...</span>);
                      }
                      pages.push(
                        <Button key={totalPages} variant="outline" onClick={() => handlePageChange(totalPages)}>
                          {totalPages}
                        </Button>
                      );
                    }

                    return pages;
                  })()}
                  
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    Next
                    <i className="fa fa-chevron-right ml-2"></i>
                  </Button>
                </div>
              </div>
            )}
            
            {/* No Results - Clean State */}
            {!loading && jobs.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-6">We couldn&apos;t find any jobs matching your search criteria. Try adjusting your filters or search terms.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => setPayload({
                        jobOccupation: [],
                        jobLocationCountry: [],
                        passportType: "",
                        languageRequired: [],
                        contractPeriod: "",
                        jobExpTypeReq: "",
                        sortBy: ""
                      })}
                    >
                      Clear all filters
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                      Refresh search
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Completion Modal */}
      {showProfileModal && selectedJobId && (
        <ProfileCompletionModal
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedJobId(null);
          }}
          jobId={selectedJobId}
          onSuccess={() => {
            setShowProfileModal(false);
            setSelectedJobId(null);
            toast.success('Profile updated and job application submitted successfully!');
          }}
        />
      )}
    </div>
  );
}
