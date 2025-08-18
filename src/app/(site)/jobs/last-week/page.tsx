"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, DollarSign, Calendar, Users, Clock, Star, Heart, ExternalLink } from "lucide-react";
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
  const [sortBy, setSortBy] = useState<string>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();

  const fetchLastWeekJobs = async (page: number = 1) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('page', page.toString());
      
      const response = await getThisWeekJob(formData);
      console.log('Last Week Jobs Response:', response);
      
      if (response?.jobs) {
        setJobs(response.jobs);
        setTotalJobs(response.totalJobs || response.jobs.length);
        setLastPage(response.lastPage || 1);
        setCurrentPage(response.currentPage || 1);
      } else {
        setJobs([]);
        setTotalJobs(0);
      }
    } catch (error) {
      console.error('Error fetching last week jobs:', error);
      toast.error('Failed to load jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastWeekJobs(1);
  }, []);

  const handleSort = (value: string) => {
    setSortBy(value);
    let sortedJobs = [...jobs];
    
    switch (value) {
      case "recent":
        sortedJobs.sort((a, b) => new Date(b.jobDeadline).getTime() - new Date(a.jobDeadline).getTime());
        break;
      case "salary-high":
        sortedJobs.sort((a, b) => parseFloat(b.jobWages) - parseFloat(a.jobWages));
        break;
      case "salary-low":
        sortedJobs.sort((a, b) => parseFloat(a.jobWages) - parseFloat(b.jobWages));
        break;
      case "company":
        sortedJobs.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle));
        break;
      default:
        break;
    }
    
    setJobs(sortedJobs);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchLastWeekJobs(page);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white border rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Jobs of the Week</h1>
          <p className="text-xl text-gray-600 mb-2">
            Discover the latest job opportunities posted in the last 7 days
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Updated daily</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{totalJobs} jobs available</span>
            </div>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              Showing {jobs.length} of {totalJobs} jobs
            </p>
            {jobs.length > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Last 7 days
              </Badge>
            )}
          </div>
          
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary-high">Salary High to Low</SelectItem>
              <SelectItem value="salary-low">Salary Low to High</SelectItem>
              <SelectItem value="company">Job Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p>There are no jobs posted in the last week.</p>
              </div>
              <Button onClick={() => router.push('/jobs')} variant="outline">
                Browse All Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Job Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={getJobImage(job.jobPhoto)}
                        alt={job.jobTitle}
                        className="w-20 h-20 object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/company-logo.svg";
                        }}
                      />
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            <Link href={`/job-description/${job.id}`}>
                              {job.jobTitle}
                            </Link>
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{job.country_location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building2 className="w-4 h-4" />
                              <span>{job.occupation}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600 font-medium">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatSalary(job.jobWages, job.jobWagesCurrencyType, job.givenCurrencyValue)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{job.jobVacancyNo} vacancies</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="text-xs">
                              Age: {job.jobAgeLimit} years
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.passportType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.jobExpTypeReq} experience
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Deadline: {formatDate(job.jobDeadline)}
                            </Badge>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 lg:flex-shrink-0">
                          <Button asChild className="w-full lg:w-auto">
                            <Link href={`/job-description/${job.id}`}>
                              View Details
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full lg:w-auto">
                            <Heart className="w-4 h-4 mr-2" />
                            Save Job
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
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
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
