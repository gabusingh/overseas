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

interface AppliedTestCardProps {
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

function AppliedTestCard({ v, getTestTradeListFunc }: AppliedTestCardProps) {
  const { globalState } = useGlobalState();
  const router = useRouter();

  const handleCourseApply = async () => {
    if (globalState.user) {
      try {
        const response = await applyCourse(
          v?.id,
          globalState?.user?.user?.id
        );
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
    <Card className="mx-3 my-4 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-start mb-3">
          <Badge variant="secondary" className="bg-green-500 text-white">
            Total Seats: {v?.total_seats}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-1">
            <div className="relative w-full h-32 rounded-lg overflow-hidden">
              <Image
                src={
                  v?.course_image === "https://overseas.ai/placeholder/course.jpg"
                    ? "/images/institute.png"
                    : v?.course_image || "/images/institute.png"
                }
                alt="Course Image"
                fill
                className="object-cover"
              />
            </div>
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
            <Badge className="bg-green-500 text-white px-4 py-2">
              Applied
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AppliedTestCard;
