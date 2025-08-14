"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { userSavedJobsList, saveJobById } from "../../../services/job.service";

interface SavedJob {
  id: number;
  job_title: string;
  company_name: string;
  location: string;
  country: string;
  saved_date: string;
  salary?: string;
  job_type?: string;
  description?: string;
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    fetchSavedJobs(token);
  }, [router]);

  const fetchSavedJobs = async (token: string) => {
    try {
      const response = await userSavedJobsList(token);
      setSavedJobs(response?.jobs || response || []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await saveJobById(jobId, token); // This toggles the save status
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
      toast.success("Job removed from saved jobs");
    } catch (error) {
      console.error("Error unsaving job:", error);
      toast.error("Failed to remove job from saved list");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold textBlue">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">Manage your bookmarked job opportunities</p>
        </div>
        <Button asChild>
          <Link href="/jobs">Find More Jobs</Link>
        </Button>
      </div>

      {savedJobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto max-w-md">
              <i className="fa fa-heart-o text-6xl text-gray-400 mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">No Saved Jobs</h3>
              <p className="text-gray-500 mb-6">
                Start saving jobs you're interested in. You can save jobs by clicking the heart icon on any job listing.
              </p>
              <Button asChild className="downloadButton">
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <i className="fa fa-filter mr-2"></i>
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <i className="fa fa-sort mr-2"></i>
                Sort
              </Button>
            </div>
          </div>

          {savedJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold textBlue mb-2">
                        {job.job_title}
                      </h3>
                      <button
                        onClick={() => handleUnsaveJob(job.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title="Remove from saved jobs"
                      >
                        <i className="fa fa-heart text-lg"></i>
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <i className="fa fa-building"></i>
                        {job.company_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fa fa-map-marker"></i>
                        {job.location}
                        {job.country && `, ${job.country}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fa fa-bookmark"></i>
                        Saved: {new Date(job.saved_date).toLocaleDateString()}
                      </span>
                    </div>

                    {job.salary && (
                      <div className="flex items-center gap-1 text-green-600 text-sm mb-3">
                        <i className="fa fa-money"></i>
                        <span className="font-medium">{job.salary}</span>
                      </div>
                    )}

                    {job.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    {job.job_type && (
                      <Badge variant="outline" className="w-fit">
                        {job.job_type}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                    >
                      <Link href={`/job/${job.location}/${job.job_title}/${job.id}`}>
                        <i className="fa fa-eye mr-2"></i>
                        View Job
                      </Link>
                    </Button>
                    <Button 
                      className="downloadButton" 
                      size="sm"
                    >
                      <i className="fa fa-paper-plane mr-2"></i>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Bulk Actions */}
          <Card className="mt-8">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">Select all</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <i className="fa fa-trash mr-2"></i>
                    Remove Selected
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <i className="fa fa-share mr-2"></i>
                    Share Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Job Recommendations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fa fa-lightbulb-o"></i>
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Based on your saved jobs, you might be interested in these opportunities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/jobs?category=software">
                <i className="fa fa-code text-2xl textBlue"></i>
                <span>Software Development Jobs</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/jobs?location=singapore">
                <i className="fa fa-globe text-2xl textBlue"></i>
                <span>Jobs in Singapore</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
