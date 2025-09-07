"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar, Clock, BookOpen, Eye, Award } from "lucide-react";
import { useRouter } from "next/navigation";

interface AppliedCourseCardProps {
  course: {
    id: number;
    course_name: string;
    institute_name: string;
    course_duration: string;
    assessment_type: string;
    course_type: string;
    course_image: string;
    appliedOn: string;
    applicationStatus: "pending" | "approved" | "enrolled" | "completed" | "rejected";
    submission_date: string;
    course_fee?: number;
    certification?: string;
  };
}

export default function AppliedCourseCard({ course }: AppliedCourseCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "enrolled":
        return "bg-blue-100 text-green-800 border-green-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewDetails = () => {
    router.push(`/course-details/${course.id}`);
  };

  // Handle placeholder image
  const courseImage = course?.course_image === "https://overseas.ai/placeholder/course.jpg" 
    ? "/images/institute.png" 
    : course?.course_image || "/images/institute.png";

  return (
    <Card className="shadow hover:shadow-lg transition-shadow duration-300 mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Course Image */}
          <div className="col-span-12 md:col-span-4">
            <div className="relative w-full h-32 rounded-lg overflow-hidden">
              <Image
                src={courseImage}
                alt="Course"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Course Details */}
          <div className="col-span-12 md:col-span-8">
            {/* Header with title and status */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.course_name}</h3>
                <p className="text-gray-600 font-medium">{course.institute_name}</p>
              </div>
              <Badge className={`mt-2 sm:mt-0 ${getStatusColor(course.applicationStatus)} capitalize`}>
                {course.applicationStatus}
              </Badge>
            </div>

            {/* Course Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Duration */}
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Duration: {course.course_duration}</span>
              </div>

              {/* Course Type */}
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Type: {course.course_type}</span>
              </div>

              {/* Applied Date */}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Applied: {course.appliedOn}</span>
              </div>

              {/* Assessment */}
              <div className="flex items-center">
                <Award className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-sm text-gray-600">Assessment: {course.assessment_type}</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {course.course_type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {course.assessment_type}
              </Badge>
              {course.certification && (
                <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                  {course.certification}
                </Badge>
              )}
            </div>

            {/* Application Status Message */}
            <div className="text-sm text-gray-500 mb-3">
              {course.applicationStatus === "pending" && "Your application is under review"}
              {course.applicationStatus === "approved" && "🎉 Application approved! You can now enroll"}
              {course.applicationStatus === "enrolled" && "You are enrolled in this course"}
              {course.applicationStatus === "completed" && "🎉 Course completed successfully!"}
              {course.applicationStatus === "rejected" && "Application was not successful this time"}
            </div>

            {/* Submission Deadline Alert */}
            {course.submission_date && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
                <p className="text-xs text-amber-700">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Submit before: {course.submission_date}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewDetails}
            className="flex items-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Course Details
          </Button>
          
          {course.applicationStatus === "approved" && (
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Enroll Now
            </Button>
          )}
          
          {course.applicationStatus === "enrolled" && (
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Access Course
            </Button>
          )}

          {course.applicationStatus === "completed" && (
            <Button 
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Download Certificate
            </Button>
          )}

          {course.course_fee && course.applicationStatus === "approved" && (
            <Badge variant="outline" className="self-center">
              Fee: ₹{course.course_fee}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
