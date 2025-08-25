"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import Link from "next/link";
import { Filter, Search, TrendingUp, Globe, Briefcase, MapPin, DollarSign, Building2, Users, ExternalLink, Heart, Clock, Calendar, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { searchJobsByKey, getUserAwareJobList } from "../../../../services/job.service";
import JobFilter from "../../../../components/JobFilter";
import { toast } from "sonner";

// Interface for job data
interface Job {
  id?: string | number;
  jobTitle?: string;
  title?: string;
  jobLocation?: string;
  location?: string;
  country?: string;
  salary?: string;
  jobSalary?: string;
  company?: string;
  cmpName?: string;
  postedDate?: string;
  created_at?: string;
  jobType?: string;
  type?: string;
  jobDescription?: string;
  description?: string;
  jobPhoto?: string; // Added for image display
  jobVacancyNo?: string; // Added for vacancy badge
  jobWages?: string; // For salary display
  jobWagesCurrencyType?: string; // For salary display
  givenCurrencyValue?: string; // For salary display
  occupation?: string; // For occupation display
  jobAgeLimit?: string; // For age limit badge
  passportType?: string; // For passport type badge
  jobExpTypeReq?: string; // For experience type badge
  jobDeadline?: string; // For deadline badge
}

interface JobListResponse {
  jobs?: Job[];
  data?: Job[];
  totalJobs?: number;
  currentPage?: number;
  lastPage?: number;
  perPage?: number;
}

export default function SearchResultsPage() {
  const params = useParams();
  const searchKey = params.searchKey as string;
  const router = useRouter();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localSearchKey, setLocalSearchKey] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
      formData.append('searchKey', searchKey);
      formData.append('page', page.toString());
      formData.append('per_page', '10');

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

      let response;
      // Try search first, fallback to user-aware job list if search fails
      try {
        response = await searchJobsByKey(formData);
      } catch (searchError) {
        console.warn('Search API failed, falling back to user-aware job list:', searchError);
        response = await getUserAwareJobList(formData);
      }
      
      if (response?.jobs || response?.data) {
        const newJobs = response.jobs || response.data || [];
        const totalPagesCount = response.lastPage || Math.ceil((response.totalJobs || newJobs.length) / 10);
        
        if (append) {
          setJobs(prev => [...prev, ...newJobs]);
        } else {
          setJobs(newJobs);
        }
        
        setFilteredJobs(newJobs);
        setTotalPages(totalPagesCount);
        setTotalJobs(response.totalJobs || newJobs.length);
        setCurrentPage(response.currentPage || page);
        setHasMore(page < totalPagesCount);
        setError(null);
      } else {
        if (append) {
          setHasMore(false);
        } else {
          setJobs([]);
          setFilteredJobs([]);
          setTotalPages(0);
          setTotalJobs(0);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
      if (append) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchKey, payload]);

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
    if (searchKey) {
      setLocalSearchKey(searchKey);
      fetchJobs(1, false);
    }
  }, [searchKey, fetchJobs]);

  // Local search within results
  useEffect(() => {
    if (localSearchKey.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => 
        job.jobTitle?.toLowerCase().includes(localSearchKey.toLowerCase()) ||
        job.company?.toLowerCase().includes(localSearchKey.toLowerCase()) ||
        job.cmpName?.toLowerCase().includes(localSearchKey.toLowerCase()) ||
        job.location?.toLowerCase().includes(localSearchKey.toLowerCase()) ||
        job.jobLocation?.toLowerCase().includes(localSearchKey.toLowerCase()) ||
        job.occupation?.toLowerCase().includes(localSearchKey.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [localSearchKey, jobs]);

  const formatSearchKey = (key: string) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
  };

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

  const formatSalary = (wages?: string, currency?: string) => {
    if (!wages || !currency) return "Competitive";
    return `${currency} ${wages}`;
  };

  const getJobImage = (jobPhoto?: string) => {
    if (jobPhoto && jobPhoto !== "null") {
      return jobPhoto;
    }
    return "/images/company-logo.svg";
  };

  const getSalaryColor = (wages?: string) => {
    if (!wages) return "text-gray-600";
    const wage = parseFloat(wages);
    if (wage > 2000) return "text-emerald-600";
    if (wage > 1500) return "text-blue-600";
    if (wage > 1000) return "text-orange-600";
    return "text-gray-600";
  };

  const getExperienceBadgeColor = (expType?: string) => {
    if (!expType) return "bg-gray-100 text-gray-800 border-gray-200";
    switch (expType.toLowerCase()) {
      case "international":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "fresher":
        return "bg-green-100 text-green-800 border-green-200";
      case "any":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-8 pb-16">
          <div className="animate-pulse">
            {/* Hero Skeleton */}
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="flex justify-center gap-8">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            
            {/* Search Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex justify-between items-center">
                <div className="h-10 bg-gray-200 rounded w-96"></div>
                <div className="h-10 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            
            {/* Jobs Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Search className="w-4 h-4" />
            <span>Search Results</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6">
            {formatSearchKey(searchKey)}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover amazing opportunities for <span className="font-semibold text-blue-600">{formatSearchKey(searchKey)}</span> positions worldwide. 
            Find your next career move with top companies.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>{totalJobs} jobs found</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Globe className="w-4 h-4 text-green-600" />
              <span>Global opportunities</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Latest positions</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className={`w-64 flex-shrink-0 ${showFilter ? 'block' : 'hidden lg:block'}`}>
            {showFilter && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setShowFilter(false)} />
            )}
            <div className={`${showFilter ? 'fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:inset-auto lg:w-64 lg:sticky lg:top-6 lg:max-h-[calc(100vh-12rem)]' : 'lg:sticky lg:top-6 lg:max-h-[calc(100vh-12rem)]'}`}>
              <JobFilter 
                setShowFilter={setShowFilter}
                payload={payload}
                setPayload={setPayload}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search within results..."
                  value={localSearchKey}
                  onChange={(e) => setLocalSearchKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowFilter(!showFilter)}
                className="lg:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg"
              >
                <Filter className="w-4 h-4" />
                All Filters
              </Button>
              
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
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> of <span className="font-semibold text-gray-900">{totalJobs}</span> jobs
              </p>
              {jobs.length > 0 && (
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200">
                  <Search className="w-3 h-3 mr-1" />
                  Search results
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <Card 
              key={job.id} 
              className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-blue-200 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Job Image */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={getJobImage(job.jobPhoto)}
                          alt={job.jobTitle || 'Job'}
                          className="w-24 h-24 object-cover rounded-xl border-2 border-gray-100 group-hover:border-blue-200 transition-all duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/company-logo.svg";
                          }}
                        />
                        {job.jobVacancyNo && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {job.jobVacancyNo}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                            <Link href={`/job-description/${job.id}`} className="hover:underline">
                              {job.jobTitle || job.title}
                            </Link>
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium">{job.company || job.cmpName || "Company"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="font-medium">{job.location || job.jobLocation || job.country || "Location"}</span>
                            </div>
                            <div className={`flex items-center gap-3 font-semibold ${getSalaryColor(job.jobWages)}`}>
                              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-emerald-600" />
                              </div>
                              <span>{formatSalary(job.jobWages, job.jobWagesCurrencyType)}</span>
                            </div>
                            {job.occupation && (
                              <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="font-medium">{job.occupation}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.jobAgeLimit && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                Age: {job.jobAgeLimit} years
                              </Badge>
                            )}
                            {job.passportType && (
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                {job.passportType}
                              </Badge>
                            )}
                            {job.jobExpTypeReq && (
                              <Badge variant="outline" className={`text-xs ${getExperienceBadgeColor(job.jobExpTypeReq)}`}>
                                {job.jobExpTypeReq} experience
                              </Badge>
                            )}
                            {job.jobDeadline && (
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(job.jobDeadline)}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 lg:flex-shrink-0">
                          <Button 
                            asChild 
                            className="w-full lg:w-auto bg-gradient-to-r text-white from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Link href={`/job-description/${job.id}`}>
                              View Details
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full lg:w-auto border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Save Job
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          </div>
        </div>

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

        {/* Pagination */}
        {paginationType === 'pagination' && totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border border-red-200 p-6 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading jobs</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button onClick={() => fetchJobs(1, false)}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">
                We couldn&apos;t find any jobs matching &quot;{searchKey}&quot;. Try adjusting your search terms or filters.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => router.push('/jobs')}>
                  Browse All Jobs
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
