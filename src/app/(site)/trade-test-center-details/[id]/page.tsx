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
  Award,
  CheckCircle,
  ArrowLeft,
  Wrench,
  Shield,
  Clock,
  FileText
} from "lucide-react";
import Link from "next/link";

interface TradeTestCenter {
  id: number;
  email?: string;
  phone?: string;
  instituteName: string; // Changed from centerName
  insRegNo?: string; // Changed from centerRegNo
  affilatedBy?: string;
  insSince?: string; // Changed from centerSince
  insAddress: string; // Changed from centerAddress
  insWebsite?: string; // Changed from centerWebsite
  test_count?: number;
  created_at: string;
  updated_at: string;
}

export default function TradeTestCenterDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const centerId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<TradeTestCenter | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'contact' | 'tests'>('overview');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (centerId) {
      fetchCenterDetails();
    }
  }, [centerId]);

  const fetchCenterDetails = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      const res = await fetch('https://backend.overseas.ai/api/list-trade-center', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-store',
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch trade test center details: ${res.status}`);
      }
      
      const data = await res.json();
      
      const centers = data?.data || [];
      const foundCenter = centers.find((center: any) => center.id.toString() === centerId);
      
      if (!foundCenter) {
        toast.error('Trade test center not found');
        return;
      }
      
      setCenter(foundCenter);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load trade test center details. Please try again.');
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

  if (!center) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Trade Test Center Not Found
            </h1>
            <p className="text-gray-600">
              The requested trade test center could not be found.
            </p>
          </div>
          
            <Button 
              variant="outline" 
              onClick={() => router.push('/trade-test-center')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trade Test Centers
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
            <li><Link href="/trade-test-center" className="hover:text-blue-600 transition-colors">Trade Test Centers</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{center.instituteName}</li>
          </ol>
        </nav>

        {/* Center Header - More Compact Design */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="bgBlue p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold mb-1">{center.instituteName}</h1>
                  <div className="flex items-center space-x-2 text-white text-xs font-medium">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{extractCity(center.insAddress)}</span>
                    </div>
                    {center.insSince && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Est. {center.insSince}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowContactModal(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white border-white h-8 text-xs font-semibold shadow-sm"
              >
                <Phone className="w-3 h-3 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Stats & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-8 h-8 bgBlue rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">Available Tests</span>
                </div>
                <div className="text-2xl font-bold textBlue">{center.test_count || '0'}</div>
                <p className="text-xs text-gray-500 mt-1">Trade tests offered</p>
              </div>
            </div>
          </div>

          {/* Establishment Year */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">Established</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{center.insSince || 'N/A'}</div>
                <p className="text-xs text-gray-500 mt-1">Years of experience</p>
              </div>
            </div>
          </div>

          {/* Registration Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">Certified</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">✓</div>
                <p className="text-xs text-gray-500 mt-1">Authorized center</p>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <div className="text-center">
              <div className="w-10 h-10 bgBlue rounded-lg flex items-center justify-center mx-auto mb-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold textBlue text-sm mb-2">Quick Contact</h3>
              <Button 
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
                onClick={() => setShowContactModal(true)}
              >
                Contact Now
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Center Details */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Building className="w-5 h-5 mr-3 textBlue" />
                Center Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Registration No.</span>
                    <span className="text-sm text-gray-600 font-mono">{center.insRegNo || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Affiliated By</span>
                    <span className="text-sm text-gray-600">{center.affilatedBy || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Established</span>
                    <span className="text-sm text-gray-600">{center.insSince || 'N/A'}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10" 
                    onClick={() => setSelectedTab('tests')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Available Tests
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Location */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <MapPin className="w-5 h-5 mr-3 bg-blue-600 text-white" />
                Contact & Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Address */}
                {center.insAddress && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 textBlue mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-gray-700 mb-1">Address</div>
                        <p className="text-sm text-gray-600 leading-relaxed">{center.insAddress}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Contact Methods */}
                <div className="space-y-2">
                  {center.phone && (
                    <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 textBlue" />
                        <span className="text-sm font-medium text-gray-700">Phone</span>
                      </div>
                      <a href={`tel:${center.phone}`} className="textBlue hover:underline text-sm font-medium">
                        {center.phone}
                      </a>
                    </div>
                  )}
                  
                  {center.email && (
                    <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 textBlue" />
                        <span className="text-sm font-medium text-gray-700">Email</span>
                      </div>
                      <a href={`mailto:${center.email}`} className="textBlue hover:underline text-xs break-all">
                        {center.email}
                      </a>
                    </div>
                  )}
                  
                  {center.insWebsite && (
                    <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 textBlue" />
                        <span className="text-sm font-medium text-gray-700">Website</span>
                      </div>
                      <a href={center.insWebsite} target="_blank" rel="noopener noreferrer" className="textBlue hover:underline flex items-center text-sm">
                        Visit Site
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex gap-2">
                  <Button 
                    className="flex-1 bgBlue hover:bg-blue-700 text-white h-10" 
                    onClick={() => setShowContactModal(true)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-blue-600 textBlue hover:lightBlueBg h-10" 
                    onClick={() => router.push('/trade-test-center')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
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
                { id: 'tests', label: 'Tests', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-500 textBlue'
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
                      Center Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Registration No:</span>
                        <span className="ml-2 text-gray-600">{center.insRegNo || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Affiliated By:</span>
                        <span className="ml-2 text-gray-600">{center.affilatedBy || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Established:</span>
                        <span className="ml-2 text-gray-600">{center.insSince || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Available Tests:</span>
                        <span className="ml-2 text-blue-600 font-medium">{center.test_count || '0'}</span>
                      </div>
                    </div>
                    {center.insAddress && (
                      <div className="pt-4 border-t mt-4">
                        <span className="font-medium text-gray-900 flex items-center mb-2">
                          <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                          Full Address:
                        </span>
                        <p className="text-gray-600 text-sm leading-relaxed">{center.insAddress}</p>
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
                      {center.phone && (
                        <div className="flex items-start space-x-3">
                          <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Phone</div>
                            <a 
                              href={`tel:${center.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {center.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {center.email && (
                        <div className="flex items-start space-x-3">
                          <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Email</div>
                            <a 
                              href={`mailto:${center.email}`}
                              className="text-blue-600 hover:underline break-all"
                            >
                              {center.email}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {center.insWebsite && (
                        <div className="flex items-start space-x-3">
                          <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Website</div>
                            <a 
                              href={center.insWebsite}
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
                      
                      {center.insAddress && (
                        <div className="flex items-start space-x-3 md:col-span-2">
                          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Address</div>
                            <p className="text-gray-600 leading-relaxed">{center.insAddress}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {selectedTab === 'tests' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Available Trade Tests</h3>
                  <Badge variant="secondary">
                    {center.test_count || '0'} tests available
                  </Badge>
                </div>
                
                {center.test_count && parseInt(center.test_count.toString()) > 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {center.test_count} Trade Tests Available
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Contact the center directly for trade test schedules, requirements, and booking.
                        </p>
                        <Button 
                          onClick={() => setShowContactModal(true)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contact for Test Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Test Information Not Available
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Please contact the center directly to learn about available trade tests and requirements.
                        </p>
                        <Button 
                          onClick={() => setShowContactModal(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Center
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
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white shadow-2xl border-0">
              <CardHeader>
                <CardTitle>Contact {center.instituteName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {center.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <a href={`tel:${center.phone}`} className="text-gray-600 hover:text-blue-600">
                      {center.phone}
                    </a>
                  </div>
                )}
                {center.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <a href={`mailto:${center.email}`} className="text-gray-600 hover:text-blue-600 break-all">
                      {center.email}
                    </a>
                  </div>
                )}
                {center.insWebsite && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <a href={center.insWebsite} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 flex items-center">
                      Visit Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                {center.insAddress && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-gray-600 text-sm leading-relaxed">{center.insAddress}</p>
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
