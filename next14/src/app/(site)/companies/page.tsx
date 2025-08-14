"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SearchComponent } from '@/components/SearchComponent';
import { getCompanies } from '@/services/info.service';
import { toast } from 'sonner';
import Link from 'next/link';
import { Building2, MapPin, Users, Star } from 'lucide-react';

interface Company {
  id: number;
  companyName: string;
  companyLogo: string;
  description: string;
  location: string;
  totalEmployees: string;
  industryType: string;
  rating: number;
  totalJobs: number;
  website: string;
  establishedYear: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm, industryFilter]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await getCompanies(page);
      setCompanies(response?.data?.companies || []);
      setTotalPages(response?.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industryType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by industry
    if (industryFilter !== 'all') {
      filtered = filtered.filter(company =>
        company.industryType.toLowerCase() === industryFilter.toLowerCase()
      );
    }

    setFilteredCompanies(filtered);
  };

  const industries = [
    'Construction', 'Healthcare', 'Manufacturing', 'Hospitality', 
    'Agriculture', 'Technology', 'Retail', 'Transportation'
  ];

  if (loading && page === 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Recruiting Companies</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover leading companies hiring international workers. Connect with employers 
          offering overseas job opportunities across various industries.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search companies by name, location, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="lg:w-64">
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {filteredCompanies.length} companies
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Grid View</Button>
          <Button variant="outline" size="sm">List View</Button>
        </div>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {company.companyLogo ? (
                        <img
                          src={company.companyLogo}
                          alt={company.companyName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/company-placeholder.png';
                          }}
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                        {company.companyName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {company.location}
                      </div>
                    </div>
                  </div>
                  {company.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{company.rating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {company.description || "Leading company in the industry providing excellent career opportunities."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{company.industryType}</Badge>
                    {company.establishedYear && (
                      <Badge variant="outline">Est. {company.establishedYear}</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {company.totalEmployees || '500+'} employees
                    </div>
                    <div className="font-semibold text-blue-600">
                      {company.totalJobs || 0} open jobs
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t flex space-x-2">
                    <Link href={`/company-details/${company.id}`} className="flex-1">
                      <Button className="w-full" variant="outline">
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/jobs?company=${company.id}`} className="flex-1">
                      <Button className="w-full">
                        View Jobs
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="py-12">
            <h3 className="text-2xl font-bold mb-4">Are you a recruiter?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our platform to connect with skilled international workers. 
              Post jobs and find the perfect candidates for your company.
            </p>
            <div className="space-x-4">
              <Link href="/employer-signup">
                <Button size="lg">Join as Employer</Button>
              </Link>
              <Link href="/create-jobs">
                <Button size="lg" variant="outline">Post a Job</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
