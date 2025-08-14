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
        console.log(response);
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
    <div className="w-full md:w-1/2 p-2">
      <Card className="shadow-sm h-full">
        <CardContent className="p-4">
          <div className="flex justify-start mb-3">
            <Badge variant="secondary" className="bg-green-500 text-white">
              Total Seats: {v?.total_seats}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1">
              <img
                src={
                  v?.course_image === "https://overseas.ai/placeholder/course.jpg"
                    ? "/images/institute.png"
                    : v?.course_image
                }
                className="w-full h-auto rounded"
                alt="Test Image"
              />
            </div>
            
            <div className="md:col-span-2">
              <p className="mb-2">
                <span className="font-semibold">Test Name: </span>
                {v?.course_name}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Duration: </span>
                {v?.course_duration}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Fee: </span>
                {v?.course_fee}
              </p>
              <p className="mb-0">
                <span className="font-semibold">Videography Facility: </span>
                {v?.videographyAvlQ}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <Link 
              href={`/test-details/${v?.id}`}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Read More
            </Link>
            
            {v?.appliedStatus ? (
              <Button variant="outline" size="sm" className="w-auto" disabled>
                Applied
              </Button>
            ) : (
              <Button 
                size="sm"
                className="w-auto"
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
