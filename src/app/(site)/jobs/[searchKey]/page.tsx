"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { searchJobsByKey, getJobList } from "../../../../services/job.service";
import JobFilter from "../../../../components/JobFilter";

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
}

export default function SearchResultsPage() {
  const params = useParams();
  const searchKey = params.searchKey as string;
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchKey, setLocalSearchKey] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  
  const [payload, setPayload] = useState({
    jobOccupation: [] as number[],
    jobLocationCountry: [] as number[],
    passportType: "",
    languageRequired: [] as string[],
    contractPeriod: "",
    jobExpTypeReq: "",
    sortBy: ""
  });

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
      
      // Use the search key from URL params
      const formattedSearchKey = searchKey.replace(/-/g, ' ');
      const response = await searchJobsByKey(formattedSearchKey);
      
      console.log('Search results:', response);
      
      // Process job data - handle different response formats
      const jobsData = Array.isArray(response) ? response : 
                      response?.jobs ? response.jobs :
                      response?.data ? response.data : [];
      
      const processedJobs = jobsData.map((job: any) => ({
        ...job,
        displayTitle: job.jobTitle || job.title || "Job Opportunity",
        displayLocation: job.jobLocation || job.location || job.country || "Not specified",
        displayCompany: job.cmpName || job.company || "Company",
        displaySalary: job.jobSalary || job.salary || "Competitive",
        displayType: job.jobType || job.type || "Full-time",
        displayDate: job.created_at ? new Date(job.created_at).toLocaleDateString() : 
                    job.postedDate || "Recent"
      }));
      
      setJobs(processedJobs);
      setFilteredJobs(processedJobs);
      
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to load search results. Please try again.');
      setJobs([]);
      setFilteredJobs([]);
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
      const title = job.jobTitle || job.title || "";
      const location = job.jobLocation || job.location || job.country || "";
      const company = job.cmpName || job.company || "";
      
      return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             location.toLowerCase().includes(searchTerm.toLowerCase()) ||
             company.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setFilteredJobs(filtered);
  };

  // Load jobs when component mounts or search key changes
  useEffect(() => {
    if (searchKey) {
      fetchJobsBySearchKey();
    }
  }, [searchKey]);

  // Handle local search input changes
  useEffect(() => {
    handleLocalSearch(localSearchKey);
  }, [localSearchKey, jobs]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue mb-2">
              <i className="fa fa-suitcase mr-2"></i>
              <u>{formatSearchKey(searchKey)}</u>
            </h1>
            <p className="text-gray-600">
              Search results for "{formatSearchKey(searchKey)}"
            </p>
          </div>
          
          <Button
            onClick={() => setShowFilter(!showFilter)}
            className="lg:hidden flex items-center gap-2 bg-brand-blue hover:bg-blue-700"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Search within results */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center border rounded-lg overflow-hidden max-w-lg w-full">
            <Input
              className="flex-1 border-0 focus:ring-0 focus:outline-none"
              placeholder="Search by job title"
              value={localSearchKey}
              onChange={(e) => setLocalSearchKey(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilter(true)}
              className="px-3"
            >
              <i className={`fa ${!showFilter ? 'fa-filter' : 'fa-search'}`}></i>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className={`lg:col-span-1 ${showFilter ? 'block' : 'hidden lg:block'}`}>
          {showFilter && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setShowFilter(false)} />
          )}
          <div className={`${showFilter ? 'fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:inset-auto lg:w-auto' : ''} lg:sticky lg:top-6`}>
            <JobFilter 
              setShowFilter={setShowFilter}
              payload={payload}
              setPayload={setPayload}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {loading ? "Loading..." : `Showing ${filteredJobs.length} jobs`}
            </p>
            <Badge variant="outline" className="hidden lg:inline-flex">
              <Search className="w-3 h-3 mr-1" />
              {filteredJobs.length} Results
            </Badge>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid gap-6">
              {[1,2,3,4,5].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <i className="fa fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Results</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={fetchJobsBySearchKey} className="bg-brand-blue hover:bg-blue-700">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Jobs List */}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="grid gap-6">
              {filteredJobs.map((job, index) => (
                <Card key={job.id || index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-brand-blue mb-2">
                          {job.displayTitle}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                          <span className="flex items-center gap-1">
                            <i className="fa fa-building"></i>
                            {job.displayCompany}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="fa fa-map-marker"></i>
                            {job.displayLocation}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {job.displayType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <i className="fa fa-money"></i>
                          {job.displaySalary}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <i className="fa fa-clock-o"></i>
                          {job.displayDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <i className="fa fa-heart mr-1"></i>
                          Save
                        </Button>
                        {job.id && (
                          <Button asChild size="sm" className="bg-brand-blue hover:bg-blue-700">
                            <Link
                              href={`/job-description/${job.id}`}
                            >
                              View Details
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results State */}
          {!loading && !error && filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <img
                  src="https://cdn-icons-png.flaticon.com/256/6840/6840178.png"
                  alt="No Jobs Found"
                  className="mx-auto mb-4 opacity-80"
                  style={{ height: "280px", width: "280px" }}
                />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  <b>No Jobs Found</b>
                </h3>
                <p className="text-gray-500 mb-4">
                  No jobs found for "{formatSearchKey(searchKey)}"
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={() => {
                      setLocalSearchKey("");
                      setPayload({
                        jobOccupation: [],
                        jobLocationCountry: [],
                        passportType: "",
                        languageRequired: [],
                        contractPeriod: "",
                        jobExpTypeReq: "",
                        sortBy: ""
                      });
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                  <Button asChild className="bg-brand-blue hover:bg-blue-700">
                    <Link href="/jobs">
                      View All Jobs
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
