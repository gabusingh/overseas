"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface CourseCardProps {
  v: {
    id: number;
    course_name: string;
    course_duration: string;
    assessment_type: string;
    course_type: string;
    course_image: string;
    submission_date: string;
    appliedStatus?: boolean;
  };
  getCourseListFunc?: () => void;
}

export default function CourseCard({ v, getCourseListFunc }: CourseCardProps) {
  const handleCourseApply = async () => {
    const userToken = localStorage.getItem("access_token");
    
    if (userToken) {
      try {
        const response = await fetch("/api/courses/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            id: v?.id,
          }),
        });

        const data = await response.json();
        
        if (data.message === "Application submitted successfully!") {
          toast.success("Application submitted successfully!");
          setTimeout(() => {
            if (getCourseListFunc) {
              getCourseListFunc();
            }
          }, 5000);
        } else {
          toast.success(data?.message);
        }
      } catch (error) {
        toast.error("Failed to apply for course");
      }
    } else {
      toast.warning("Please login to apply for the course");
    }
  };

  // Handle placeholder image
  const courseImage = v?.course_image === "https://overseas.ai/placeholder/course.jpg" 
    ? "/images/institute.png" 
    : v?.course_image;

  return (
    <div className="col-span-12 md:col-span-6">
      <Card className="shadow hover:shadow-lg transition-shadow duration-300 mx-3 my-4">
        <CardContent className="p-4">
          {/* Submission Deadline Badge */}
          <div className="flex justify-start mb-3">
            <Badge className="bg-green-500 hover:bg-green-600">
              Applied Before: {v?.submission_date}
            </Badge>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Course Image */}
            <div className="col-span-12 md:col-span-4">
              <div className="relative w-full h-24 rounded-lg overflow-hidden">
                <Image
                  src={courseImage}
                  alt="Course"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="col-span-12 md:col-span-8 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Course Name:</span> {v?.course_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Duration:</span> {v?.course_duration}
              </p>
              <p className="text-sm">
                <span className="font-medium">Exam Mode:</span> {v?.assessment_type}
              </p>
              <p className="text-sm">
                <span className="font-medium">Course Type:</span> {v?.course_type}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            <Link 
              href={`/course-details/${v?.id}`}
              className="text-[#17487f] hover:underline font-medium text-sm"
            >
              Read More
            </Link>
            
            {v?.appliedStatus ? (
              <Button 
                size="sm" 
                variant="secondary"
                className="w-24 bg-yellow-500 hover:bg-yellow-600 text-white"
                disabled
              >
                Applied
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                className="w-24 border-[#17487f] text-[#17487f] hover:bg-[#17487f] hover:text-white"
                onClick={handleCourseApply}
              >
                Apply
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
