"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { appliedJobList } from "../../services/job.service";

interface AppliedJob {
  id: number;
  job_title: string;
  company_name: string;
  location: string;
  applied_date: string;
  status: string;
  salary?: string;
  job_type?: string;
}

export default function AppliedJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAppliedJobs(token);
  }, [router]);

  const fetchAppliedJobs = async (token: string) => {
    try {
      const response = await appliedJobList(token);
      setAppliedJobs(response?.data || []);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      toast.error("Failed to load applied jobs");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold textBlue">Applied Jobs</h1>
          <p className="text-gray-600 mt-2">Track your job applications and their status</p>
        </div>
        <Button asChild>
          <Link href="/jobs">Browse More Jobs</Link>
        </Button>
      </div>

      {appliedJobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto max-w-md">
              <i className="fa fa-briefcase text-6xl text-gray-400 mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">No Applications Yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't applied to any jobs yet. Start exploring opportunities to kickstart your career!
              </p>
              <Button asChild className="downloadButton">
                <Link href="/jobs">Find Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appliedJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold textBlue mb-2">
                        {job.job_title}
                      </h3>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <i className="fa fa-building"></i>
                        {job.company_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fa fa-map-marker"></i>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fa fa-calendar"></i>
                        Applied: {new Date(job.applied_date).toLocaleDateString()}
                      </span>
                    </div>

                    {job.salary && (
                      <div className="flex items-center gap-1 text-green-600 text-sm mb-3">
                        <i className="fa fa-money"></i>
                        <span className="font-medium">{job.salary}</span>
                      </div>
                    )}

                    {job.job_type && (
                      <Badge variant="outline" className="w-fit">
                        {job.job_type}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" size="sm">
                      <i className="fa fa-eye mr-2"></i>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <i className="fa fa-download mr-2"></i>
                      Download Application
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Load More Button */}
          {appliedJobs.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" className="px-8">
                Load More Applications
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fa fa-rocket"></i>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/my-profile">
                <i className="fa fa-user text-2xl"></i>
                <span>Update Profile</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/saved-jobs">
                <i className="fa fa-heart text-2xl"></i>
                <span>Saved Jobs</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/about-resume-building">
                <i className="fa fa-file-text text-2xl"></i>
                <span>Build Resume</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
