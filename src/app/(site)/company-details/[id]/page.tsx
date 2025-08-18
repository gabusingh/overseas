"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { getCompanyById } from "../../../../services/info.service";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Users, 
  Calendar,
  ExternalLink,
  Facebook,
  Linkedin,
  Award,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface CompanyDetail {
  id: number;
  userID: string;
  cmpName: string;
  cmpType: string;
  cmpOfficialMob: string;
  cmpEmail: string;
  RaLicenseNumber: string;
  cmpLogo: string;
  cmpState: string;
  cmpPin: string;
  cmpGSTIN: string | null;
  cmpContPerson: string;
  cmpPhone: string;
  cmpDescription: string;
  cmpApprovalSA: string;
  cmpGovtIdType: string | null;
  cmpGovtIdNo: string | null;
  cmpPhoneNoViewQ: string;
  cmpDataViewNo: string;
  cmpJobPostingStartingDate: string;
  cmpJobPostingEndingDate: string;
  cmpOfficialAddress: string;
  cmpOfficialAddress2nd: string | null;
  cmpWebsiteLink: string;
  cmpWorkingFrom: string;
  cmpYearlyPlacement: string;
  cmpWorkingCountry: string;
  cmpWorkingDepartment: string;
  clientName: string;
  cmpRating: string;
  cmpFBLink: string;
  created_at: string;
  updated_at: string;
  jobs_count: string;
  cmpLogoS3: string;
  cmpWorkingCountryNames: string[];
  cmpWorkingDepartmentNames: string[];
  state_name: {
    id: number;
    name: string;
    name_hi: string;
    name_bn: string;
    sname: string;
  };
}

export default function CompanyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'departments' | 'countries' | 'contact'>('overview');

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await getCompanyById(parseInt(companyId));
      console.log('Company Details Response:', response);
      
      if (response?.data?.company) {
        setCompany(response.data.company);
      } else if (response?.data) {
        // Handle case where company data is directly in response.data
        setCompany(response.data);
      } else {
        toast.error('Company not found');
        router.push('/companies');
      }
    } catch (error: any) {
      console.error('Error fetching company details:', error);
      if (error?.response?.status === 404) {
        toast.error('Company not found');
      } else {
        toast.error('Failed to load company details. Please try again.');
      }
      router.push('/companies');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: string) => {
    const stars = [];
    const numRating = parseInt(rating) || 0;
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < numRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h1>
          <Button onClick={() => router.push('/companies')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/companies" className="hover:text-blue-600 transition-colors">Companies</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{company.cmpName}</li>
          </ol>
        </nav>

        {/* Company Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <img
                  src={company.cmpLogoS3 || company.cmpLogo}
                  alt={`${company.cmpName} Logo`}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl bg-white p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/default-company-logo.svg";
                  }}
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.cmpName}</h1>
                <p className="text-blue-100 text-lg mb-3">{company.cmpType}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Since {formatDate(company.cmpWorkingFrom)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{company.cmpYearlyPlacement} placements/year</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{company.jobs_count} active jobs</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(company.cmpRating)}
                  <span className="text-sm">({company.cmpRating}/5)</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {company.cmpApprovalSA === "1" ? "Approved" : "Pending Approval"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: Building },
                    { id: 'departments', label: 'Departments', icon: Users },
                    { id: 'countries', label: 'Countries', icon: MapPin },
                    { id: 'contact', label: 'Contact', icon: Phone }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id as any)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          selectedTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {selectedTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">About {company.cmpName}</h3>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {company.cmpDescription}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium">{company.cmpType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500">Established</p>
                            <p className="font-medium">{formatDate(company.cmpWorkingFrom)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Yearly Placements</p>
                            <p className="font-medium">{company.cmpYearlyPlacement}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-gray-500">License Number</p>
                            <p className="font-medium">{company.RaLicenseNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'departments' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Working Departments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {company.cmpWorkingDepartmentNames?.map((dept, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{dept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === 'countries' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Working Countries</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {company.cmpWorkingCountryNames?.map((country, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">{country}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === 'contact' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{company.cmpPhone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{company.cmpEmail}</p>
                          </div>
                        </div>
                        {company.cmpWebsiteLink && (
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Website</p>
                              <a 
                                href={company.cmpWebsiteLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                Visit Website
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        )}
                        {company.cmpFBLink && (
                          <div className="flex items-center gap-3">
                            <Facebook className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">Facebook</p>
                              <a 
                                href={company.cmpFBLink.trim()} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                Follow on Facebook
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Address</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{company.cmpOfficialAddress}</p>
                        {company.cmpOfficialAddress2nd && (
                          <p className="text-gray-700 mt-2">{company.cmpOfficialAddress2nd}</p>
                        )}
                        <p className="text-gray-600 mt-2">
                          {company.state_name?.name} - {company.cmpPin}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Person</h4>
                      <p className="text-gray-700">{company.cmpContPerson}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => router.push(`/jobs?company=${company.id}`)}>
                    <Building className="w-4 h-4 mr-2" />
                    View Jobs
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Company
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                </CardContent>
              </Card>

              {/* Company Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      {renderStars(company.cmpRating)}
                      <span className="font-medium">{company.cmpRating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Jobs</span>
                    <span className="font-medium">{company.jobs_count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Yearly Placements</span>
                    <span className="font-medium">{company.cmpYearlyPlacement}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Working Countries</span>
                    <span className="font-medium">{company.cmpWorkingCountryNames?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Departments</span>
                    <span className="font-medium">{company.cmpWorkingDepartmentNames?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* License Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">License Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">{company.RaLicenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">GSTIN</p>
                    <p className="font-medium">{company.cmpGSTIN || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Approval Status</p>
                    <Badge variant={company.cmpApprovalSA === "1" ? "default" : "secondary"}>
                      {company.cmpApprovalSA === "1" ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
