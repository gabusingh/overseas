"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { appliedJobList, getInterviewById } from "../../../services/job.service";
import AppliedJobCard from "../../../components/AppliedJobCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

interface AppliedJob {
  id: number;
  jobTitle: string;
  companyName: string;
  jobLocationCountry: {
    name: string;
    countryFlag: string;
  };
  appliedOn: string;
  applicationStatus: "pending" | "shortlisted" | "interviewed" | "selected" | "rejected";
  jobWages: number;
  jobWagesCurrencyType: string;
  givenCurrencyValue?: number;
  jobPhoto: string;
  jobDeadline: string;
  occupation: string;
  contractPeriod?: string;
}

export default function AppliedJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAppliedJobs(token);
  }, [router]);

  useEffect(() => {
    filterJobs();
  }, [appliedJobs, searchTerm, statusFilter]);

  const fetchAppliedJobs = async (token: string) => {
    try {
      const response = await appliedJobList(token);
      const jobs = Array.isArray(response?.data) ? response.data : [];
      setAppliedJobs(jobs);
    } catch (error) {
      toast.error("Failed to load applied jobs");
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = appliedJobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobLocationCountry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.occupation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(job =>
        job.applicationStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
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
          <div className="mt-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {filteredJobs.length} Applications
            </Badge>
          </div>
        </div>
        <Button asChild>
          <Link href="/jobs">Browse More Jobs</Link>
        </Button>
      </div>

      {/* Search and Filters */}
      {appliedJobs.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by job title, company, location, or occupation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interviewed">Interviewed</SelectItem>
                    <SelectItem value="selected">Selected</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {appliedJobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto max-w-md">
              <i className="fa fa-briefcase text-6xl text-gray-400 mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">No Applications Yet</h3>
              <p className="text-gray-500 mb-6">
                You haven&apos;t applied to any jobs yet. Start exploring opportunities to kickstart your career!
              </p>
              <Button asChild className="downloadButton">
                <Link href="/jobs">Find Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto max-w-md">
              <i className="fa fa-search text-6xl text-gray-400 mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">No Results Found</h3>
              <p className="text-gray-500 mb-6">
                No applications match your search criteria. Try adjusting your search terms or filters.
              </p>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}>
                  Clear Filters
                </Button>
                <Button asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <AppliedJobCard key={job.id} job={job} />
          ))}

          {/* Load More Button */}
          {filteredJobs.length > 0 && (
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
