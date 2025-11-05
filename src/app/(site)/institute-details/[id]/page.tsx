"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
// import { Separator } from "../../../../components/ui/separator";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  // Star, 
  // Users, 
  Calendar,
  ExternalLink,
  // Facebook,
  // Linkedin,
  Award,
  // CheckCircle,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Shield,
  // Clock
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
  type Course = {
    id: number;
    course_name: string;
    submission_date?: string;
    course_duration?: string;
    total_seats?: string | number;
    course_fee?: string | number;
    assessment_type?: string;
    course_type?: string;
    eligibility?: string;
    course_image?: string;
  };
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const toSlug = (value: string) =>
    (value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'course';

  useEffect(() => {
    if (instituteId) {
      fetchInstituteDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instituteId]);

  const fetchInstituteDetails = async (): Promise<void> => {
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
      
      const institutes: Array<InstituteDetail & { id: number }> = data?.data || [];
      const foundInstitute = institutes.find((inst) => String(inst.id) === instituteId);
      
      if (!foundInstitute) {
        console.warn('⚠️ Institute not found in response');
        toast.error('Institute not found');
        return;
      }
      
      console.log('✅ Institute details loaded:', foundInstitute);
      setInstitute(foundInstitute);
    } catch (error: unknown) {
      console.error('❌ Error fetching institute details:', error);
      const message = (error instanceof Error && error.message) ? error.message : 'Failed to load institute details. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (): Promise<void> => {
    try {
      setCoursesLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const res = await fetch('https://backend.overseas.ai/api/courses-by-institute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Accept': 'application/json'
        },
        body: JSON.stringify({ instId: instituteId })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.message || 'Failed to fetch courses');
      }
      setCourses(Array.isArray(data?.data) ? data.data : []);
    } catch (error: unknown) {
      console.error('❌ Error fetching courses:', error);
      const message = (error instanceof Error && error.message) ? error.message : 'Failed to load courses';
      toast.error(message);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 'courses' && instituteId) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, instituteId]);

  // const renderStars = (count: number = 5) => {
  //   const stars = [];
  //   for (let i = 0; i < 5; i++) {
  //     stars.push(
  //       <Star 
  //         key={i} 
  //         className={`w-4 h-4 ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
  //       />
  //     );
  //   }
  //   return stars;
  // };

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
          <div className="bgBlue p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
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
        
        {/* Modern Stats & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Available Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-8 h-8 bgBlue rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">Available Courses</span>
                </div>
                <div className="text-2xl font-bold textBlue">{institute.course_count || '0'}</div>
                <p className="text-xs text-gray-500 mt-1">Training programs</p>
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
                <div className="text-2xl font-bold text-green-600">{institute.insSince || 'N/A'}</div>
                <p className="text-xs text-gray-500 mt-1">Years of excellence</p>
              </div>
            </div>
          </div>

          {/* Accreditation Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">Accredited</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">✓</div>
                <p className="text-xs text-gray-500 mt-1">Authorized institute</p>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <div className="text-center">
              <div className="w-10 h-10 bgBlue rounded-lg flex items-center justify-center mx-auto mb-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold textBlue text-sm mb-2">Get In Touch</h3>
              <Button 
                size="sm"
                className="w-full bgBlue hover:bg-blue-700 h-8 text-xs"
                onClick={() => setShowContactModal(true)}
              >
                Contact Now
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Institute Details */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Building className="w-5 h-5 mr-3 textBlue" />
                Institute Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Registration No.</span>
                    <span className="text-sm text-gray-600 font-mono">{institute.insRegNo || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Affiliated By</span>
                    <span className="text-sm text-gray-600">{institute.affilatedBy || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Established</span>
                    <span className="text-sm text-gray-600">{institute.insSince || 'N/A'}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10" 
                    onClick={() => setSelectedTab('courses')}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Available Courses
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
                {institute.insAddress && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 textBlue mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-gray-700 mb-1">Address</div>
                        <p className="text-sm text-gray-600 leading-relaxed">{institute.insAddress}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Contact Methods */}
                <div className="space-y-2">
                  {institute.phone && (
                    <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 textBlue" />
                        <span className="text-sm font-medium text-gray-700">Phone</span>
                      </div>
                      <a href={`tel:${institute.phone}`} className="textBlue hover:underline text-sm font-medium">
                        {institute.phone}
                      </a>
                    </div>
                  )}
                  
                  {institute.email && (
                    <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 textBlue" />
                        <span className="text-sm font-medium text-gray-700">Email</span>
                      </div>
                      <a href={`mailto:${institute.email}`} className="textBlue hover:underline text-xs break-all">
                        {institute.email}
                      </a>
                    </div>
                  )}
                  
                  {institute.insWebsite && (
                    <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 textBlue" />
                        <span className="text-sm font-medium text-gray-700">Website</span>
                      </div>
                      <a href={institute.insWebsite} target="_blank" rel="noopener noreferrer" className="textBlue hover:underline flex items-center text-sm">
                        Visit Site
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex gap-2">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10" 
                    onClick={() => setShowContactModal(true)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-blue-600 textBlue hover:lightBlueBg h-10" 
                    onClick={() => router.push('/training-institutes')}
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
              {([
                { id: 'overview', label: 'Overview', icon: Building },
                { id: 'contact', label: 'Contact', icon: Phone },
                { id: 'courses', label: 'Courses', icon: BookOpen }
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
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
                    {courses.length || institute.course_count || '0'} courses available
                  </Badge>
                </div>
                
                {coursesLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading courses...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {courses.map((course) => (
                      <Card key={course.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={course.course_image || '/images/institute.png'}
                              alt={course.course_name}
                              className="w-12 h-12 rounded-md object-cover bg-gray-100 border border-gray-200 flex-shrink-0"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/institute.png'; }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">{course.course_name}</div>
                              <div className="text-xs text-gray-600 mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                                <span>Dur: <span className="font-medium">{course.course_duration || 'N/A'}</span></span>
                                <span>Seats: <span className="font-medium">{course.total_seats || 'N/A'}</span></span>
                                <span>Fee: <span className="font-medium">{course.course_fee ? `₹${course.course_fee}` : 'N/A'}</span></span>
                                <span>Type: <span className="font-medium">{course.course_type || 'N/A'}</span></span>
                                {course.submission_date && (
                                  <span>Apply by: <span className="font-medium">{formatDate(course.submission_date)}</span></span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Link
                            href={`/course-details/${toSlug(course.course_name)}/${course.id}`}
                            className="inline-flex items-center whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-md mt-3"
                          >
                            Apply Now
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white shadow-2xl border-0">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="text-gray-900 font-semibold">Contact {institute.instituteName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-white p-6">
                {institute.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Phone className="w-5 h-5 textBlue" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-700 mb-1">Phone</div>
                      <a href={`tel:${institute.phone}`} className="textBlue hover:underline font-medium">
                        {institute.phone}
                      </a>
                    </div>
                  </div>
                )}
                {institute.email && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Mail className="w-5 h-5 textBlue" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-700 mb-1">Email</div>
                      <a href={`mailto:${institute.email}`} className="textBlue hover:underline text-sm break-all">
                        {institute.email}
                      </a>
                    </div>
                  </div>
                )}
                {institute.insWebsite && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Globe className="w-5 h-5 textBlue" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-700 mb-1">Website</div>
                      <a href={institute.insWebsite} target="_blank" rel="noopener noreferrer" className="textBlue hover:underline flex items-center">
                        Visit Website
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
                {institute.insAddress && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="w-5 h-5 textBlue mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-700 mb-1">Address</div>
                      <p className="text-gray-700 text-sm leading-relaxed">{institute.insAddress}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <div className="flex justify-end gap-2 p-6 pt-0 bg-white border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowContactModal(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setShowContactModal(false)}
                  className="bgBlue hover:bg-blue-700"
                >
                  Got it
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
