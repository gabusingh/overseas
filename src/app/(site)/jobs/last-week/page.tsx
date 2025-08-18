"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, DollarSign, Calendar, Users, Clock, Star, Heart, ExternalLink, Search, Filter, TrendingUp, Globe, Briefcase, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { getThisWeekJob } from "@/services/job.service";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Interface for the last week jobs API response
interface LastWeekJob {
  id: number;
  jobID: string;
  jobTitle: string;
  jobPhoto?: string;
  jobVacancyNo: string;
  jobDeadline: string;
  jobWages: string;
  jobWagesCurrencyType: string;
  givenCurrencyValue: string;
  country_location: string;
  occupation: string;
  occupation_hi: string;
  occupation_bn: string;
  country_location_hi: string;
  country_location_bn: string;
  jobAgeLimit: string;
  passportType: string;
  jobExpTypeReq: string;
  jobUrl: string;
  jobLocationCountry: {
    id: number;
    phone: string;
    code: string;
    name: string;
    name_hi: string;
    name_bn: string;
    regionName: string;
    regionId: string;
    sortName: string;
    currencyName: string;
    currencyValue: string;
    currencySymbol: string;
    countryFlag: string;
    activeState: string;
    labourPolicyPdf: string | null;
    updated_at: string;
  };
}

interface LastWeekJobsResponse {
  totalJobs: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  jobs: LastWeekJob[];
}

export default function JobsLastWeekPage() {
  const [jobs, setJobs] = useState<LastWeekJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [paginationType, setPaginationType] = useState<'pagination' | 'loadMore'>('loadMore');
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchLastWeekJobs = useCallback(async (page: number = 1, append: boolean = false) => {
    const isInitialLoad = page === 1 && !append;
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const formData = new FormData();
      formData.append('page', page.toString());
      
      const response = await getThisWeekJob(formData);
      console.log('Last Week Jobs Response:', response);
      
      if (response?.jobs) {
        const newJobs = response.jobs as LastWeekJob[];
        const totalPagesCount = response.lastPage || 1;
        
        if (append) {
          setJobs(prev => [...prev, ...newJobs]);
        } else {
          setJobs(newJobs);
        }
        
        setTotalJobs(response.totalJobs || newJobs.length);
        setLastPage(totalPagesCount);
        setCurrentPage(response.currentPage || page);
        setHasMore(page < totalPagesCount);
      } else {
        if (append) {
          setHasMore(false);
        } else {
          setJobs([]);
          setTotalJobs(0);
          setLastPage(1);
        }
      }
    } catch (error) {
      console.error('Error fetching last week jobs:', error);
      toast.error('Failed to load jobs. Please try again.');
      if (append) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load more jobs
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      fetchLastWeekJobs(nextPage, true);
    }
  }, [loadingMore, hasMore, currentPage, fetchLastWeekJobs]);

  // Handle page change for pagination
  const handlePageChange = useCallback((page: number) => {
    if (page !== currentPage && !loading) {
      fetchLastWeekJobs(page, false);
    }
  }, [currentPage, loading, fetchLastWeekJobs]);

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

  useEffect(() => {
    fetchLastWeekJobs(1, false);
  }, [fetchLastWeekJobs]);

  const handleSort = (value: string) => {
    setSortBy(value);
    const sortedJobs = [...jobs].sort((a, b) => {
      switch (value) {
        case "recent":
          return new Date(b.jobDeadline).getTime() - new Date(a.jobDeadline).getTime();
        case "salary-high":
          return parseFloat(b.jobWages) - parseFloat(a.jobWages);
        case "salary-low":
          return parseFloat(a.jobWages) - parseFloat(b.jobWages);
        case "company":
          return a.jobTitle.localeCompare(b.jobTitle);
        default:
          return 0;
      }
    });
    
    setJobs(sortedJobs);
  };

  const formatSalary = (wages: string, currency: string, currencyValue: string) => {
    const wage = parseFloat(wages);
    const exchangeRate = parseFloat(currencyValue);
    const inrAmount = wage * exchangeRate;
    
    return `${currency} ${wages} (₹${inrAmount.toFixed(0)})`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getJobImage = (jobPhoto?: string) => {
    if (jobPhoto && jobPhoto !== "null") {
      return jobPhoto;
    }
    return "/images/company-logo.svg"; // Default image
  };

  const getSalaryColor = (wages: string) => {
    const wage = parseFloat(wages);
    if (wage > 2000) return "text-emerald-600";
    if (wage > 1500) return "text-blue-600";
    if (wage > 1000) return "text-orange-600";
    return "text-gray-600";
  };

  const getExperienceBadgeColor = (expType: string) => {
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

  const filteredJobs = jobs.filter(job =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.country_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Trending This Week</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6">
            Jobs of the Week
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover the latest and most exciting job opportunities posted in the last 7 days. 
            Find your next career move with top companies worldwide.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Updated daily</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Users className="w-4 h-4 text-green-600" />
              <span>{totalJobs} jobs available</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Globe className="w-4 h-4 text-purple-600" />
              <span>Global opportunities</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search within results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Sort by:</span>
              </div>
              
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary-high">Salary High to Low</SelectItem>
                  <SelectItem value="salary-low">Salary Low to High</SelectItem>
                  <SelectItem value="company">Job Title A-Z</SelectItem>
                </SelectContent>
              </Select>

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
                <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Last 7 days
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <Card className="text-center py-16 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent>
              <div className="text-gray-500 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-700">No jobs found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm ? `No jobs match "${searchTerm}". Try adjusting your search terms.` : "There are no jobs posted in the last week."}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => router.push('/jobs')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Browse All Jobs
                  </Button>
                  {searchTerm && (
                    <Button onClick={() => setSearchTerm("")} variant="outline">
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                            alt={job.jobTitle}
                            className="w-24 h-24 object-cover rounded-xl border-2 border-gray-100 group-hover:border-blue-200 transition-all duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/company-logo.svg";
                            }}
                          />
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {job.jobVacancyNo}
                          </div>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                              <Link href={`/job-description/${job.id}`} className="hover:underline">
                                {job.jobTitle}
                              </Link>
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                  <MapPin className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium">{job.country_location}</span>
                              </div>
                              <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="font-medium">{job.occupation}</span>
                              </div>
                              <div className={`flex items-center gap-3 font-semibold ${getSalaryColor(job.jobWages)}`}>
                                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                  <DollarSign className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span>{formatSalary(job.jobWages, job.jobWagesCurrencyType, job.givenCurrencyValue)}</span>
                              </div>
                              <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                  <Users className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="font-medium">{job.jobVacancyNo} vacancies</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                Age: {job.jobAgeLimit} years
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                {job.passportType}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getExperienceBadgeColor(job.jobExpTypeReq)}`}>
                                {job.jobExpTypeReq} experience
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(job.jobDeadline)}
                              </Badge>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-3 lg:flex-shrink-0">
                            <Button 
                              asChild 
                              className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
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

        {/* Pagination */}
        {paginationType === 'pagination' && lastPage > 1 && (
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
                  {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
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
                  disabled={currentPage === lastPage}
                  className="border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  Next
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
