"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";
import { Filter, Search, MapPin, Building, Clock, DollarSign, Heart } from "lucide-react";
import { getJobList, saveJobById, getOccupations, applyJobApi } from "../../../services/job.service";
import { getCountriesForJobs } from "../../../services/info.service";
import JobFilter from "../../../components/JobFilter";
import SearchComponent from "../../../components/SearchComponent";
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
  const [showFilter, setShowFilter] = useState(false);
  const [savedJobs, setSavedJobs] = useState<(string | number)[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [sortBy, setSortBy] = useState('latest');
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

  // Apply job function - matching old system exactly
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
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  // Save job function
  const handleSaveJob = async (jobId: string | number | undefined) => {
    if (!jobId) return;
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please login to save jobs');
        router.push('/login');
        return;
      }

      await saveJobById(Number(jobId), token);
      setSavedJobs(prev => [...prev, jobId]);
      toast.success('Job saved successfully');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  // Handle URL parameters for category/department filtering
  useEffect(() => {
    const category = searchParams.get('category');
    const department = searchParams.get('department');
    const categoryName = searchParams.get('categoryName');
    const departmentName = searchParams.get('departmentName');
    const searchQuery = searchParams.get('search');
    
    if (category) {
      setPayload(prev => ({
        ...prev,
        jobOccupation: [parseInt(category)]
      }));
    } else if (department) {
      setPayload(prev => ({
        ...prev,
        jobOccupation: [parseInt(department)]
      }));
    }
    
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  // Fetch initial data
  useEffect(() => {
    fetchJobs();
    fetchCategories();
    fetchCountries();
  }, [currentPage, payload]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add filters to form data
      for (const key in payload) {
        if (Array.isArray(payload[key as keyof typeof payload]) && (payload[key as keyof typeof payload] as any[]).length > 0) {
          formData.append(key, JSON.stringify(payload[key as keyof typeof payload]));
        } else if (payload[key as keyof typeof payload] !== "") {
          formData.append(key, payload[key as keyof typeof payload] as string);
        }
      }
      formData.append("pageNo", currentPage.toString());
      
      const response = await getJobList(formData);
      
      if (response?.jobs || response?.data) {
        const jobsData = response.jobs || response.data || [];
        setJobs(jobsData as Job[]);
        setTotalJobs(jobsData.length);
        setTotalPages(Math.ceil(jobsData.length / 10));
      } else {
        setJobs([]);
        setTotalJobs(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getOccupations();
      console.log('Categories API Response:', response); // Debug log
      
      // Handle different possible response structures
      let occupationData = [];
      if (response?.occupation && Array.isArray(response.occupation)) {
        occupationData = response.occupation;
      } else if (response?.data && Array.isArray(response.data)) {
        occupationData = response.data;
      } else if (Array.isArray(response)) {
        occupationData = response;
      }
      
      if (occupationData.length > 0) {
        const categoryData = occupationData.map((item: any) => ({
          label: item.occupation || item.title || item.name,
          value: item.id,
          count: item.jobCount || 0
        })).slice(0, 8);
        console.log('Processed categories:', categoryData); // Debug log
        setCategories(categoryData);
      } else {
        console.warn('No categories found in API response');
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await getCountriesForJobs();
      console.log('Countries API Response:', response); // Debug log
      
      // Handle different possible response structures
      let countryData = [];
      if (response?.countries && Array.isArray(response.countries)) {
        countryData = response.countries;
      } else if (response?.data && Array.isArray(response.data)) {
        countryData = response.data;
      } else if (Array.isArray(response)) {
        countryData = response;
      }
      
      if (countryData.length > 0) {
        const processedCountries = countryData.map((item: any) => ({
          label: item.name,
          value: item.id,
          count: item.jobCount || item.totalJobs || 0
        })).slice(0, 6);
        console.log('Processed countries:', processedCountries); // Debug log
        setCountries(processedCountries);
      } else {
        console.warn('No countries found in API response');
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Recent";
    }
  };

  const formatSalary = (wages?: number, currency?: string) => {
    if (!wages || !currency) return "Competitive";
    return `${currency} ${wages.toLocaleString()}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header Section - Naukri Style */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Jobs in India
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  {totalJobs.toLocaleString()} jobs available
                </p>
              </div>
              
              <Button
                onClick={() => setShowFilter(!showFilter)}
                className="lg:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 min-h-screen">
          {/* Left Sidebar - Filters */}
          <div className={`w-64 flex-shrink-0 ${showFilter ? 'block' : 'hidden lg:block'}`}>
            {showFilter && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setShowFilter(false)} />
            )}
            <div className={`${showFilter ? 'fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:inset-auto lg:w-64 lg:sticky lg:top-6 lg:h-[calc(100vh-6rem)]' : 'lg:sticky lg:top-6 lg:h-[calc(100vh-6rem)]'}`}>
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
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <div className="p-4 sm:p-6">
                    {/* Header - Job Title and Save Button */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/job-description/${job.id}`}
                          className="block group-hover:text-blue-600 transition-colors"
                        >
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 truncate pr-4">
                            {job.jobTitle}
                          </h3>
                        </Link>
                        
                        {/* Company and Location */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1.5">
                            <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{job.cmpName || job.company || "Company"}</span>
                          </div>
                          {job.jobLocationCountry && (
                            <div className="flex items-center gap-1.5">
                              <img
                                src={`https://backend.overseas.ai/storage/uploads/countryFlag/${job.jobLocationCountry.countryFlag}`}
                                alt="Flag"
                                className="w-4 h-3 object-cover rounded-sm flex-shrink-0"
                              />
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{job.jobLocationCountry.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Save Button */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSaveJob(job.id);
                        }}
                        className={`ml-2 flex-shrink-0 p-2 h-8 w-8 ${savedJobs.includes(job.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <Heart className={`w-4 h-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    {/* Job Details - Clean Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                      {/* Salary */}
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm font-medium text-green-700">
                          {formatSalary(job.jobWages, job.jobWagesCurrencyType)}
                        </span>
                      </div>
                      
                      {/* Experience */}
                      {job.jobExpTypeReq && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">
                            {job.jobExpTypeReq} experience
                          </span>
                        </div>
                      )}
                      
                      {/* Department */}
                      {job.occupation && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">
                            {job.occupation}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Job Requirements - Compact Tags */}
                    {(job.jobAgeLimit || job.passportType || job.jobDeadline) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.jobAgeLimit && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Age: {job.jobAgeLimit}
                          </span>
                        )}
                        {job.passportType && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.passportType} Passport
                          </span>
                        )}
                        {job.jobDeadline && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Apply by {job.jobDeadline}
                          </span>
                        )}
                      </div>
                    )}

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
                            await handleApplyJob(job.id);
                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

            {/* Pagination - Enhanced */}
            {totalPages > 1 && (
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
                  <p className="text-gray-500 mb-6">We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.</p>
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
    </div>
  );
}
