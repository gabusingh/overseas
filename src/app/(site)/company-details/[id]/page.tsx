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
      console.log('🔄 Fetching company details for ID:', companyId);
      const response = await getCompanyById(parseInt(companyId));
      console.log('📊 Company Details Response:', response);
      
      if (response?.data?.company) {
        setCompany(response.data.company);
        console.log('✅ Company details loaded from nested data structure');
      } else if (response?.data) {
        // Handle case where company data is directly in response.data
        setCompany(response.data);
        console.log('✅ Company details loaded from direct data structure');
      } else {
        console.warn('⚠️ Company not found in response');
        toast.error('Company not found');
        router.push('/companies');
      }
    } catch (error: any) {
      console.error('❌ Error fetching company details:', error);
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

        {/* Company Header - Compact Design */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center p-2">
                  <img
                    src={company.cmpLogoS3 || company.cmpLogo}
                    alt={`${company.cmpName} Logo`}
                    className="w-full h-full object-contain rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/default-company-logo.svg";
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">{company.cmpName}</h1>
                  <div className="flex items-center space-x-3 text-white/90 text-sm">
                    <div className="flex items-center">
                      <Building className="w-3 h-3 mr-1" />
                      <span>{company.cmpType}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{company.jobs_count} jobs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(company.cmpRating)}
                      <span>({company.cmpRating})</span>
                    </div>
                  </div>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={`${company.cmpApprovalSA === "1" ? 'bg-blue-500/20 text-white border-blue-300' : 'bg-yellow-500/20 text-white border-yellow-300'} h-6`}
              >
                {company.cmpApprovalSA === "1" ? "Approved" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Compact 3-Card Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Company Information Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 text-sm mb-4">
                <div>
                  <span className="font-medium text-gray-900">Type:</span>
                  <span className="ml-2 text-gray-600">{company.cmpType}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">License:</span>
                  <span className="ml-2 text-gray-600">{company.RaLicenseNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Established:</span>
                  <span className="ml-2 text-gray-600">{formatDate(company.cmpWorkingFrom)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Jobs:</span>
                  <span className="ml-2 text-blue-600 font-medium">{company.jobs_count}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={() => router.push(`/jobs?company=${company.id}`)}
                >
                  <Building className="w-4 h-4 mr-2" />
                  View Jobs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 text-sm mb-4">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-600 mr-2" />
                  <a href={`tel:${company.cmpPhone}`} className="text-blue-600 hover:underline">
                    {company.cmpPhone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-blue-600 mr-2" />
                  <a href={`mailto:${company.cmpEmail}`} className="text-blue-600 hover:underline text-xs break-all">
                    {company.cmpEmail}
                  </a>
                </div>
                {company.cmpWebsiteLink && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-blue-600 mr-2" />
                    <a href={company.cmpWebsiteLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center text-sm">
                      Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-900">Contact Person:</span>
                  <span className="ml-2 text-gray-600">{company.cmpContPerson}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={() => setSelectedTab('contact')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Company
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats & Features Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Award className="w-5 h-5 mr-2 text-blue-600" />
                Stats & Features
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(company.cmpRating)}
                    <span className="font-medium">{company.cmpRating}/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Placements/Year:</span>
                  <span className="font-medium text-blue-600">{company.cmpYearlyPlacement}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Countries:</span>
                  <span className="font-medium">{company.cmpWorkingCountryNames?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Departments:</span>
                  <span className="font-medium">{company.cmpWorkingDepartmentNames?.length || 0}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="flex items-center p-2 bg-blue-50 rounded text-xs">
                    <CheckCircle className="w-3 h-3 text-blue-600 mr-2" />
                    <span>Licensed</span>
                  </div>
                  <div className="flex items-center p-2 bg-blue-50 rounded text-xs">
                    <Award className="w-3 h-3 text-blue-600 mr-2" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full h-9 border-blue-600 text-blue-600 hover:bg-blue-50" 
                  onClick={() => router.push('/companies')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Companies
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Sections - Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b">
            <nav className="flex px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Building },
                { id: 'departments', label: 'Departments', icon: Users },
                { id: 'countries', label: 'Countries', icon: MapPin },
                { id: 'contact', label: 'Contact', icon: Phone }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-blue-600" />
                      About {company.cmpName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {company.cmpDescription}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'departments' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Working Departments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {company.cmpWorkingDepartmentNames?.map((dept, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
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
                      <Mail className="w-5 h-5 text-blue-600" />
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
    </div>
  );
}
