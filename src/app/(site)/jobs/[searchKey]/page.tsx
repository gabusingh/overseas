"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, MapPin, DollarSign, Calendar, Users, Clock, Star, Heart, 
  ExternalLink, Search, Filter, TrendingUp, Globe, Briefcase, Zap, 
  ArrowLeft, X, CheckCircle, AlertCircle
} from "lucide-react";
import { searchJobsByKey } from "@/services/job.service";
import { toast } from "sonner";
import Link from "next/link";

// Interface for job data from API
interface SearchJob {
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

interface SearchResponse {
  totalJobs: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  jobs: SearchJob[];
}

export default function SearchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchKey = params.searchKey as string;
  
  const [jobs, setJobs] = useState<SearchJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<SearchJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);

  // Format search key for display
  const formatSearchKey = (key: string) => {
    return key.replace(/-/g, ' ').split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch jobs based on search key
  const fetchJobsBySearchKey = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const formattedSearchKey = searchKey.replace(/-/g, ' ');
      const response = await searchJobsByKey(formattedSearchKey);
      
      console.log('Search results:', response);
      
      if (response?.jobs) {
        setJobs(response.jobs);
        setFilteredJobs(response.jobs);
        setTotalJobs(response.totalJobs || response.jobs.length);
      } else {
        setJobs([]);
        setFilteredJobs([]);
        setTotalJobs(0);
      }
      
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to load search results. Please try again.');
      setJobs([]);
      setFilteredJobs([]);
      setTotalJobs(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle local search within results
  const handleLocalSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter(job => {
      const title = job.jobTitle || "";
      const location = job.country_location || "";
      const occupation = job.occupation || "";
      
      return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             location.toLowerCase().includes(searchTerm.toLowerCase()) ||
             occupation.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setFilteredJobs(filtered);
  };

  // Handle sorting
  const handleSort = (value: string) => {
    setSortBy(value);
    const sortedJobs = [...filteredJobs].sort((a, b) => {
      switch (value) {
        case "recent":
          return new Date(b.jobDeadline).getTime() - new Date(a.jobDeadline).getTime();
        case "salary-high":
          return parseFloat(b.jobWages) - parseFloat(a.jobWages);
        case "salary-low":
          return parseFloat(a.jobWages) - parseFloat(b.jobWages);
        case "title":
          return a.jobTitle.localeCompare(b.jobTitle);
        case "location":
          return a.country_location.localeCompare(b.country_location);
        default:
          return 0;
      }
    });
    
    setFilteredJobs(sortedJobs);
  };

  // Load jobs when component mounts or search key changes
  useEffect(() => {
    if (searchKey) {
      fetchJobsBySearchKey();
    }
  }, [searchKey]);

  // Handle local search input changes
  useEffect(() => {
    handleLocalSearch(localSearchTerm);
  }, [localSearchTerm, jobs]);

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
    return "/images/company-logo.svg";
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
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Latest positions</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search within results..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {localSearchTerm && (
                  <button
                    onClick={() => setLocalSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
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
                  <SelectItem value="title">Job Title A-Z</SelectItem>
                  <SelectItem value="location">Location A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> of <span className="font-semibold text-gray-900">{totalJobs}</span> jobs
              </p>
              {filteredJobs.length > 0 && (
                <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {filteredJobs.length} matches
                </Badge>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={() => router.push('/jobs')}
              className="text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Jobs
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <Card className="text-center py-16 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent>
              <div className="text-gray-500 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-red-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-700">Error Loading Results</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={fetchJobsBySearchKey} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Try Again
                  </Button>
                  <Button onClick={() => router.push('/jobs')} variant="outline">
                    Browse All Jobs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        {!loading && !error && filteredJobs.length > 0 && (
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

        {/* No Results State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <Card className="text-center py-16 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent>
              <div className="text-gray-500 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-700">No jobs found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {localSearchTerm 
                    ? `No jobs match "${localSearchTerm}" for "${formatSearchKey(searchKey)}". Try adjusting your search terms.`
                    : `No jobs found for "${formatSearchKey(searchKey)}". Try searching for a different keyword.`
                  }
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => router.push('/jobs')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Browse All Jobs
                  </Button>
                  {localSearchTerm && (
                    <Button onClick={() => setLocalSearchTerm("")} variant="outline">
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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
