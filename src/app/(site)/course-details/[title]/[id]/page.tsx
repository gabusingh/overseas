"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { toast } from "sonner";
import { getCourseById, applyCourse } from "../../../../../services/course.service";

interface CourseDetail {
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
  institute_details?: {
    institute_id: string;
    instituteName: string;
    phone?: string;
    email?: string;
  };
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [course, setCourse] = useState<CourseDetail | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(courseId);
        const details = (data?.data || data) as CourseDetail;
        setCourse(details);
      } catch (error: unknown) {
        console.error('Error loading course details:', error);
        toast.error((error as any)?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    if (!isNaN(courseId)) fetchCourse();
  }, [courseId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleApply = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        toast.warning('Please login to apply');
        router.push('/login');
        return;
      }
      setApplying(true);
      const res = await applyCourse(courseId, token);
      if (res?.msg || res?.message) {
        toast.success(res.msg || res.message);
      } else if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Applied successfully');
      }
    } catch (error: unknown) {
      console.error('Apply course error:', error);
      toast.error((error as any)?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse max-w-3xl mx-auto">
            <div className="h-8 w-2/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-48 w-full bg-gray-200 rounded mb-6"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Course not found</h1>
          <Link href="/training-institutes" className="text-blue-600 hover:underline">Back to institutes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl font-bold text-gray-900">{course.course_name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <img
                  src={course.course_image || '/images/institute.png'}
                  alt={course.course_name}
                  className="w-28 h-28 rounded-md object-cover bg-gray-100 border border-gray-200"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/institute.png'; }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm w-full">
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-medium">{course.course_duration || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Total Seats</div>
                    <div className="font-medium">{course.total_seats || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Course Fee</div>
                    <div className="font-medium">{course.course_fee ? `₹${course.course_fee}` : 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Type</div>
                    <div className="font-medium">{course.course_type || 'N/A'}</div>
                  </div>
                  {course.assessment_type && (
                    <div>
                      <div className="text-gray-500">Assessment</div>
                      <div className="font-medium">{course.assessment_type}</div>
                    </div>
                  )}
                  {course.submission_date && (
                    <div>
                      <div className="text-gray-500">Apply By</div>
                      <div className="font-medium">{formatDate(course.submission_date)}</div>
                    </div>
                  )}
                </div>
              </div>

              {course.eligibility && (
                <div className="mt-4">
                  <div className="text-gray-500 text-sm mb-1">Eligibility</div>
                  <div className="text-sm text-gray-800">{course.eligibility}</div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button onClick={handleApply} disabled={applying} className="bg-blue-600 hover:bg-blue-700">
                  {applying ? 'Applying...' : 'Apply Now'}
                </Button>
                <Link href="/training-institutes">
                  <Button variant="outline">Back to institutes</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {course.institute_details && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Institute</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-gray-500">Name</div>
                    <div className="font-medium">{course.institute_details.instituteName}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Institute ID</div>
                    <div className="font-medium">{course.institute_details.institute_id}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


