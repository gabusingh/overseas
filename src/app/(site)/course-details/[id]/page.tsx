"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { ArrowLeft, BookOpen, Target, Clock, Users, DollarSign, FileText, Calendar, MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";
import { getCourseById, applyCourse, getAllCourses } from "../../../../services/course.service";
import { useGlobalState } from "../../../../contexts/GlobalProvider";
import { withCache, cacheService } from "../../../../services/cache.service";

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { globalState } = useGlobalState();
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!dataLoaded) {
      fetchCourseDetails();
    }
  }, [courseId, dataLoaded]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching course details for ID:', courseId);
      
      // Try to get specific course details first
      try {
        const response = await getCourseById(parseInt(courseId));
        if (response?.data) {
          setCourse(response.data);
          setDataLoaded(true);
          console.log('✅ Course details loaded from specific API');
          return;
        }
      } catch (specificError) {
        console.log("📦 Specific course API failed, trying cached all courses API...");
      }
      
      // Fallback to getting all courses and finding the specific one (with caching)
      const allCoursesResponse = await getAllCourses();
      if (allCoursesResponse?.data) {
        const foundCourse = allCoursesResponse.data.find((course: any) => course.id === parseInt(courseId));
        if (foundCourse) {
          setCourse(foundCourse);
          setDataLoaded(true);
          console.log('✅ Course details loaded from cached all courses API');
        } else {
          toast.error("Course not found.");
        }
      } else {
        toast.error("Failed to load course details.");
      }
    } catch (error) {
      console.error('❌ Error fetching course details:', error);
      toast.error("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCourse = async () => {
    if (!globalState?.user?.access_token) {
      toast.warning("Please login to apply for courses");
      router.push("/login");
      return;
    }

    setApplying(true);
    try {
      const response = await applyCourse(course.id, globalState.user.access_token);
      if (response?.msg) {
        toast.success("Successfully applied for the course!");
      } else {
        toast.error("Failed to apply for the course");
      }
    } catch (error) {
      toast.error("Failed to apply for the course");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => router.push("/training-institutes")}>
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
        {/* Header */}
        <div className="mb-6">
          <Button 
            onClick={() => router.back()}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="bg-white shadow-sm">
          <div className="p-6">
            {/* Course Header - Compact */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                    {course.course_type}
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-1">
                    Apply by: {course.submission_date}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-900 pr-4">{course.course_name}</h1>
                <p className="text-gray-600 mb-4">By {course.institute_details?.instituteName}</p>
              </div>
              
              {/* Course Icon - No Image */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Details - Compact Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Duration</p>
                    <p className="text-sm font-semibold text-gray-900">{course.course_duration}</p>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-[8px] font-bold text-white">Fee</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Course Fee</p>
                    <p className="text-sm font-semibold text-gray-900">₹{course.course_fee}</p>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Seats</p>
                    <p className="text-sm font-semibold text-gray-900">{course.total_seats}</p>
                  </div>

                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Assessment</p>
                    <p className="text-sm font-semibold text-gray-900">{course.assessment_type}</p>
                  </div>
                </div>

                {/* Eligibility - Compact */}
                {course.eligibility && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-blue-600" />
                      Eligibility
                    </h3>
                    <p className="text-sm text-gray-700">{course.eligibility}</p>
                  </div>
                )}
              </div>

              {/* Institute Info & Apply - Compact Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-3 text-gray-900">Institute Details</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{course.institute_details?.instituteName}</p>
                      <p className="text-xs text-gray-600">ID: {course.institute_details?.instituteID}</p>
                    </div>
                    
                    {course.institute_details?.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <a href={`tel:${course.institute_details.phone}`} className="text-xs text-blue-600 hover:underline">
                          {course.institute_details.phone}
                        </a>
                      </div>
                    )}
                    
                    {course.institute_details?.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <a href={`mailto:${course.institute_details.email}`} className="text-xs text-blue-600 hover:underline break-all">
                          {course.institute_details.email}
                        </a>
                      </div>
                    )}
                    
                    {course.institute_details?.insWebLink && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <a 
                          href={course.institute_details.insWebLink.startsWith('http') ? course.institute_details.insWebLink : `https://${course.institute_details.insWebLink}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-600 hover:underline flex items-center"
                        >
                          Website
                          <ExternalLink className="w-2 h-2 ml-1" />
                        </a>
                      </div>
                    )}
                    
                    {course.institute_details?.insAddress && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 line-clamp-2">{course.institute_details.insAddress}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Apply Button - Compact */}
                  <div className="border-t border-gray-200 pt-4">
                    <Button 
                      onClick={handleApplyCourse}
                      disabled={applying}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-2 text-sm text-white"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      {applying ? "Applying..." : "Apply Now"}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Deadline: {course.submission_date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}