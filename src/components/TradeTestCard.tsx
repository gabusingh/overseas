"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "../contexts/GlobalProvider";
import { toast } from "sonner";
import { applyCourse } from "../services/institute.service";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import Image from "next/image";

interface TradeTestCardProps {
  v: {
    id: number;
    total_seats: number;
    course_image: string;
    course_name: string;
    course_duration: string;
    course_fee: string;
    videographyAvlQ: string;
    appliedStatus: boolean;
  };
  getTestTradeListFunc?: () => void;
}

function TradeTestCard({ v, getTestTradeListFunc }: TradeTestCardProps) {
  const { globalState } = useGlobalState();
  const router = useRouter();

  const handleCourseApply = async () => {
    if (globalState.user) {
      try {
        const response = await applyCourse({
          id: v?.id,
          access_token: globalState?.user?.user?.access_token,
        });
        if (response?.message === "Application submitted successfully!") {
          toast.success("Application submitted successfully!");
          setTimeout(() => {
            getTestTradeListFunc?.();
          }, 5000);
        } else {
          toast.success(response?.message);
        }
      } catch (error) {
        toast.error("Failed to apply for course");
      }
    } else {
      toast.warning("Please login to apply for the course");
    }
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-2">
      <Card className="shadow-sm h-full border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge variant="secondary" className="bgBlue text-white text-xs">
              {v?.total_seats} Seats
            </Badge>
            <div className="w-8 h-8 bgBlue rounded-full flex items-center justify-center">
              <i className="fa fa-certificate text-white text-xs"></i>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="relative w-full h-32 rounded-lg overflow-hidden">
              <Image
                src={
                  v?.course_image === "https://overseas.ai/placeholder/course.jpg"
                    ? "/images/institute.png"
                    : v?.course_image || "/images/institute.png"
                }
                alt="Test Image"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <h3 className="font-semibold text-base text-gray-900 line-clamp-2">
              {v?.course_name}
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
                <span className="text-gray-500 text-xs">Duration</span>
                <span className="font-medium">{v?.course_duration}</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
                <span className="text-gray-500 text-xs">Fee</span>
                <span className="font-medium">{v?.course_fee}</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
                <span className="text-gray-500 text-xs">Video</span>
                <span className="font-medium">{v?.videographyAvlQ}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Link 
              href={`/test-details/${v?.id}`}
              className="flex-1 text-center py-2 px-3 border textBlue border-blue-600 rounded-lg hover:lightBlueBg transition-colors text-sm font-medium"
            >
              Read More
            </Link>
            
            {v?.appliedStatus ? (
              <Button variant="outline" size="sm" className="flex-1" disabled>
                Applied
              </Button>
            ) : (
              <Button 
                size="sm"
                className="flex-1 bgBlue hover:bg-blue-700"
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

export default TradeTestCard;
