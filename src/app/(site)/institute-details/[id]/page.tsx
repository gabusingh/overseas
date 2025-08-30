"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
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
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Shield,
  Clock
} from "lucide-react";
import Link from "next/link";

interface InstituteDetail {
  id: number;
  email: string;
  phone: string;
  instituteName: string;
  insRegNo: string;
  affilatedBy: string;
  insSince: string;
  insAddress: string;
  insWebsite?: string;
  course_count?: number;
  created_at: string;
  updated_at: string;
}

export default function InstituteDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const instituteId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [institute, setInstitute] = useState<InstituteDetail | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'contact' | 'courses'>('overview');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (instituteId) {
      fetchInstituteDetails();
    }
  }, [instituteId]);

  const fetchInstituteDetails = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching institute details for ID:', instituteId);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      const res = await fetch('https://backend.overseas.ai/api/list-training-institute', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-store',
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch institute details: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📊 Training Institutes API Response:', data);
      
      const institutes = data?.data || [];
      const foundInstitute = institutes.find((inst: any) => inst.id.toString() === instituteId);
      
      if (!foundInstitute) {
        console.warn('⚠️ Institute not found in response');
        toast.error('Institute not found');
        return;
      }
      
      console.log('✅ Institute details loaded:', foundInstitute);
      setInstitute(foundInstitute);
    } catch (error: any) {
      console.error('❌ Error fetching institute details:', error);
      toast.error(error.message || 'Failed to load institute details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count: number = 5) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
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
  
  const extractCity = (address: string) => {
    if (!address) return 'Location not specified';
    const parts = address.split(',').map(part => part.trim());
    return parts.length > 1 ? parts[parts.length - 1] : address;
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

  if (!institute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Institute Not Found</h1>
          <Button onClick={() => router.push('/training-institutes')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Training Institutes
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
            <li><Link href="/training-institutes" className="hover:text-blue-600 transition-colors">Training Institutes</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{institute.instituteName}</li>
          </ol>
        </nav>

        {/* Institute Header - More Compact Design */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold mb-1">{institute.instituteName}</h1>
                  <div className="flex items-center space-x-2 text-white/90 text-xs">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{extractCity(institute.insAddress)}</span>
                    </div>
                    {institute.insSince && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Est. {institute.insSince}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowContactModal(true)}
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-8 text-xs"
              >
                <Phone className="w-3 h-3 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </div>
        
        {/* Compact 3-Card Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Institute Information Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Institute Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 text-sm mb-4">
                <div>
                  <span className="font-medium text-gray-900">Registration:</span>
                  <span className="ml-2 text-gray-600">{institute.insRegNo || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Affiliated By:</span>
                  <span className="ml-2 text-gray-600">{institute.affilatedBy || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Established:</span>
                  <span className="ml-2 text-gray-600">{institute.insSince || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Courses:</span>
                  <span className="ml-2 text-blue-600 font-medium">{institute.course_count || '0'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700" 
                  onClick={() => setSelectedTab('courses')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Courses
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
                {institute.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-blue-600 mr-2" />
                    <a href={`tel:${institute.phone}`} className="text-blue-600 hover:underline">
                      {institute.phone}
                    </a>
                  </div>
                )}
                {institute.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-blue-600 mr-2" />
                    <a href={`mailto:${institute.email}`} className="text-blue-600 hover:underline text-xs break-all">
                      {institute.email}
                    </a>
                  </div>
                )}
                {institute.insWebsite && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-blue-600 mr-2" />
                    <a href={institute.insWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center text-sm">
                      Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700" 
                  onClick={() => setShowContactModal(true)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Institute
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Address & Features Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Location & Features
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 mb-4">
                {institute.insAddress && (
                  <div>
                    <p className="text-gray-600 text-sm leading-relaxed">{institute.insAddress}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="flex items-center p-2 bg-blue-50 rounded text-xs">
                    <Shield className="w-3 h-3 text-blue-600 mr-2" />
                    <span>Certified</span>
                  </div>
                  <div className="flex items-center p-2 bg-green-50 rounded text-xs">
                    <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                    <span>Approved</span>
                  </div>
                  <div className="flex items-center p-2 bg-purple-50 rounded text-xs">
                    <Users className="w-3 h-3 text-purple-600 mr-2" />
                    <span>Expert Staff</span>
                  </div>
                  <div className="flex items-center p-2 bg-orange-50 rounded text-xs">
                    <Clock className="w-3 h-3 text-orange-600 mr-2" />
                    <span>Flexible</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full h-9 border-blue-600 text-blue-600 hover:bg-blue-50" 
                  onClick={() => router.push('/training-institutes')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Institutes
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
                { id: 'contact', label: 'Contact', icon: Phone },
                { id: 'courses', label: 'Courses', icon: BookOpen }
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
                      Institute Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Registration No:</span>
                        <span className="ml-2 text-gray-600">{institute.insRegNo || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Affiliated By:</span>
                        <span className="ml-2 text-gray-600">{institute.affilatedBy || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Established:</span>
                        <span className="ml-2 text-gray-600">{institute.insSince || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Total Courses:</span>
                        <span className="ml-2 text-blue-600 font-medium">{institute.course_count || '0'}</span>
                      </div>
                    </div>
                    {institute.insAddress && (
                      <div className="pt-4 border-t mt-4">
                        <span className="font-medium text-gray-900 flex items-center mb-2">
                          <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                          Full Address:
                        </span>
                        <p className="text-gray-600 text-sm leading-relaxed">{institute.insAddress}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'contact' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {institute.phone && (
                        <div className="flex items-start space-x-3">
                          <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Phone</div>
                            <a 
                              href={`tel:${institute.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {institute.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {institute.email && (
                        <div className="flex items-start space-x-3">
                          <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Email</div>
                            <a 
                              href={`mailto:${institute.email}`}
                              className="text-blue-600 hover:underline break-all"
                            >
                              {institute.email}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {institute.insWebsite && (
                        <div className="flex items-start space-x-3">
                          <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Website</div>
                            <a 
                              href={institute.insWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              Visit Website
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {institute.insAddress && (
                        <div className="flex items-start space-x-3 md:col-span-2">
                          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Address</div>
                            <p className="text-gray-600 leading-relaxed">{institute.insAddress}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {selectedTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Available Courses</h3>
                  <Badge variant="secondary">
                    {institute.course_count || '0'} courses available
                  </Badge>
                </div>
                
                {institute.course_count && parseInt(institute.course_count.toString()) > 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {institute.course_count} Courses Available
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Contact the institute directly for detailed course information and enrollment.
                        </p>
                        <Button 
                          onClick={() => setShowContactModal(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contact for Course Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Course Information Not Available
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Please contact the institute directly to learn about their available courses and programs.
                        </p>
                        <Button 
                          onClick={() => setShowContactModal(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Institute
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Contact {institute.instituteName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {institute.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <a href={`tel:${institute.phone}`} className="text-gray-600 hover:text-blue-600">
                      {institute.phone}
                    </a>
                  </div>
                )}
                {institute.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <a href={`mailto:${institute.email}`} className="text-gray-600 hover:text-blue-600 break-all">
                      {institute.email}
                    </a>
                  </div>
                )}
                {institute.insWebsite && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <a href={institute.insWebsite} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 flex items-center">
                      Visit Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                {institute.insAddress && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-gray-600 text-sm leading-relaxed">{institute.insAddress}</p>
                  </div>
                )}
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => setShowContactModal(false)}
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
