"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, FileText, Calendar, ArrowRight } from "lucide-react";

interface CourseCardProps {
  v: {
    id: number;
    course_name: string;
    course_duration: string;
    assessment_type: string;
    course_type: string;
    course_image?: string;
    submission_date: string;
    appliedStatus?: boolean;
    course_fee?: string;
    total_seats?: string;
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

  return (
    <Card className="group hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with Course Type and Deadline */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-white/20 text-white border-0 text-xs px-2 py-1">
                {v?.course_type}
              </Badge>
              <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2">{v?.course_name}</h3>
            <div className="flex items-center text-blue-100 text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Apply by: {v?.submission_date}</span>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-sm">{v?.course_duration}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-3 h-3 text-orange-600" />
              </div>
              <span className="text-sm">{v?.assessment_type}</span>
            </div>
          </div>
          
          {v?.course_fee && (
            <div className="bg-blue-50 border border-green-200 rounded-lg p-2 text-center">
              <span className="text-green-700 font-semibold text-lg">₹{v.course_fee}</span>
              {v?.total_seats && (
                <span className="text-gray-500 text-xs ml-2">({v.total_seats} seats)</span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex border-t border-gray-100">
          <Link 
            href={`/course-details/${v?.id}`}
            className="flex-1 p-3 text-center text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center space-x-1 group"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          
          <div className="w-px bg-gray-200"></div>
          
          {v?.appliedStatus ? (
            <div className="flex-1 p-3 text-center bg-yellow-50 text-yellow-700 font-medium text-sm">
              ✓ Applied
            </div>
          ) : (
            <button 
              onClick={handleCourseApply}
              className="flex-1 p-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Apply Now
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
