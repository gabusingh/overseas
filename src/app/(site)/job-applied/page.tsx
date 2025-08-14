"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { AppliedJobCard } from '../../components/AppliedJobCard';
import { getAppliedJobs } from '../../services/job.service';
import { useGlobalState } from '../../contexts/GlobalProvider';
import { toast } from 'sonner';
import Link from 'next/link';

interface AppliedJob {
  id: number;
  jobTitle: string;
  companyName: string;
  jobLocationCountry: {
    name: string;
    countryFlag: string;
  };
  applicationStatus: string;
  appliedDate: string;
  jobWages: number;
  jobWagesCurrencyType: string;
  jobPhoto: string;
}

export default function JobAppliedPage() {
  const { globalState } = useGlobalState();
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (globalState?.user) {
      fetchAppliedJobs();
    } else {
      setLoading(false);
    }
  }, [globalState?.user]);

  useEffect(() => {
    filterJobs();
  }, [appliedJobs, searchTerm, statusFilter]);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const response = await getAppliedJobs(globalState?.user?.user?.access_token);
      setAppliedJobs(response?.data || []);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      toast.error('Failed to load applied jobs');
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
        job.jobLocationCountry.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
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
      case 'accepted':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'interview':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!globalState?.user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
        <p className="text-gray-600 mb-6">Please login to view your applied jobs.</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Applied Jobs</h1>
          <p className="text-gray-600">Track your job applications and their status</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {filteredJobs.length} Applications
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by job title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="interview">Interview</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applied Jobs List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            {appliedJobs.length === 0 ? (
              <>
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-6">You haven't applied to any jobs yet. Start exploring opportunities!</p>
                <Link href="/jobs">
                  <Button>Browse Jobs</Button>
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  {/* Job Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-start space-x-4">
                      <img
                        src={job.jobPhoto}
                        alt="Job"
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/images/job-placeholder.png';
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{job.jobTitle}</h3>
                        <p className="text-gray-600 mb-2">{job.companyName}</p>
                        <div className="flex items-center">
                          <img
                            src={`https://backend.overseas.ai/storage/uploads/countryFlag/${job.jobLocationCountry?.countryFlag}`}
                            alt="Flag"
                            className="w-5 h-3 mr-2"
                          />
                          <span className="text-sm text-gray-600">{job.jobLocationCountry?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-center">
                    <Badge className={getStatusColor(job.applicationStatus)}>
                      {job.applicationStatus}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-gray-600">Applied: {job.appliedDate}</p>
                    <div className="flex space-x-2">
                      <Link href={`/job-description/${job.id}`}>
                        <Button size="sm" variant="outline">View Job</Button>
                      </Link>
                      {job.applicationStatus.toLowerCase() === 'interview' && (
                        <Button size="sm">View Details</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button (if needed) */}
      {filteredJobs.length > 0 && filteredJobs.length < appliedJobs.length && (
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => {}}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
