"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, IdCard, Play } from "lucide-react";
import Image from "next/image";

interface CandidateCardProps {
  value: {
    empName: string;
    fid: string;
    age: number;
    empDistrict: string;
    empState: string;
    empPhoto: string;
    videoUrl?: string;
    appliedOn?: string;
    jobId?: string;
    JobPrimaryId?: string;
    personId: number;
    markedDetails?: {
      status: number;
    };
  };
  slider?: boolean;
  jobId?: string;
  showMarkBtn?: boolean;
  jobPrimaryId?: string;
  getRecommandedCandidate?: (jobId: string) => void;
}

export default function CandidateCard({
  value,
  slider,
  jobId,
  showMarkBtn,
  jobPrimaryId,
  getRecommandedCandidate,
}: CandidateCardProps) {
  const router = useRouter();

  const handleMarkCandidate = async () => {
    try {
      const userToken = localStorage.getItem("access_token");
      if (!userToken || !jobPrimaryId) return;

      const response = await fetch("/api/hra/mark-candidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          jobId: jobPrimaryId,
          candidateId: value.personId,
        }),
      });

      const data = await response.json();
      
      if (data.message === "Job matching candidate accepted successfully") {
        toast.success("Job matching candidate accepted successfully");
        if (getRecommandedCandidate && jobPrimaryId) {
          getRecommandedCandidate(jobPrimaryId);
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  const handleNotInterestedCandidate = async () => {
    try {
      const userToken = localStorage.getItem("access_token");
      if (!userToken || !jobPrimaryId) return;

      const response = await fetch("/api/hra/reject-candidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          jobId: jobPrimaryId,
          candidateId: value.personId,
        }),
      });

      const data = await response.json();
      
      if (data.message === "Job unmatching candidate rejected successfully") {
        toast.success("Job unmatching candidate rejected successfully");
        if (getRecommandedCandidate && jobPrimaryId) {
          getRecommandedCandidate(jobPrimaryId);
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  const handleJobClick = () => {
    router.push(`/job/job-country/job-department/${value?.JobPrimaryId}`);
  };

  return (
    <div className={`${slider ? "col-span-12" : "col-span-12 lg:col-span-6"} p-2`}>
      <Card className="shadow hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Candidate Details */}
            <div className="col-span-8">
              {/* Name with Icon */}
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#17487f]" />
                {value?.empName}
              </h2>

              {/* FID Badge */}
              <Badge variant="secondary" className="mb-3 flex items-center w-fit">
                <IdCard className="w-4 h-4 mr-1" />
                {value?.fid}
              </Badge>

              {/* Candidate Info */}
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <span className="font-medium">Age:</span>
                  <span className="ml-2">{value?.age}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium">District:</span>
                  <span className="ml-2">{value?.empDistrict}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium">State:</span>
                  <span className="ml-2">{value?.empState}</span>
                </p>
              </div>

              {/* Video Link */}
              {value.videoUrl && (
                <a
                  href={value.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-3 px-3 py-1 text-sm border border-[#17487f] text-[#17487f] rounded hover:bg-[#17487f] hover:text-white transition-colors"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Play Video
                </a>
              )}
            </div>

            {/* Candidate Photo */}
            <div className="col-span-4 flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={value?.empPhoto} alt={value?.empName} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Applied Date and Job ID */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            {value?.appliedOn && (
              <div className="flex items-center">
                <span className="text-sm font-medium">Applied On:</span>
                <Badge variant="secondary" className="ml-2">
                  {value?.appliedOn}
                </Badge>
              </div>
            )}

            <div 
              className="flex items-center cursor-pointer"
              onClick={handleJobClick}
            >
              <span className="text-sm font-medium">Job ID:</span>
              <Badge className="ml-2 bg-[#17487f] hover:bg-[#135a8a]">
                {jobId || value?.jobId}
              </Badge>
            </div>
          </div>

          {/* Mark/Reject Buttons */}
          {showMarkBtn && (
            <div className="flex space-x-2 mt-3">
              {value?.markedDetails?.status === 1 ? (
                <Button size="sm" variant="outline" disabled className="border-green-500 text-green-500">
                  Marked
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleMarkCandidate}
                  className="border-green-500 text-green-500 hover:bg-blue-500 hover:text-white"
                >
                  Mark
                </Button>
              )}
              
              {value?.markedDetails?.status !== 1 && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={handleNotInterestedCandidate}
                >
                  Not Interested
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
