"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar, MapPin, DollarSign, Clock, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface AppliedJobCardProps {
  job: {
    id: number;
    jobTitle: string;
    companyName: string;
    jobLocationCountry: {
      name: string;
      countryFlag: string;
    };
    jobWages: number;
    jobWagesCurrencyType: string;
    givenCurrencyValue?: number;
    appliedOn: string;
    applicationStatus: "pending" | "shortlisted" | "interviewed" | "selected" | "rejected";
    jobPhoto: string;
    jobDeadline: string;
    occupation: string;
    contractPeriod?: string;
  };
}

export default function AppliedJobCard({ job }: AppliedJobCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shortlisted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "interviewed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "selected":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewDetails = () => {
    const jobUrl = `/job/${job?.jobLocationCountry?.name
      ?.trim()
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")}/${job?.jobTitle
      ?.trim()
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")}/${job?.id}`;
    
    router.push(jobUrl);
  };

  return (
    <Card className="shadow hover:shadow-lg transition-shadow duration-300 mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Job Details */}
          <div className="col-span-12 lg:col-span-8">
            {/* Header with title and status */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.jobTitle}</h3>
                <p className="text-gray-600 font-medium">{job.companyName}</p>
              </div>
              <Badge className={`mt-2 sm:mt-0 ${getStatusColor(job.applicationStatus)} capitalize`}>
                {job.applicationStatus}
              </Badge>
            </div>

            {/* Job Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Location */}
              <div className="flex items-center">
                <div className="w-5 h-3 relative mr-2">
                  <Image
                    src={`https://backend.overseas.ai/storage/uploads/countryFlag/${job?.jobLocationCountry?.countryFlag}`}
                    alt="Flag"
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{job.jobLocationCountry.name}</span>
              </div>

              {/* Salary */}
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">
                  {job.givenCurrencyValue ? (
                    <>
                      {job.jobWages} {job.jobWagesCurrencyType} = {Math.round(job.jobWages * job.givenCurrencyValue)} INR
                    </>
                  ) : (
                    <>
                      {job.jobWages} {job.jobWagesCurrencyType}
                    </>
                  )}
                </span>
              </div>

              {/* Applied Date */}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">Applied: {job.appliedOn}</span>
              </div>

              {/* Job Deadline */}
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-red-400 mr-1" />
                <span className="text-sm text-gray-600">Deadline: {job.jobDeadline}</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {job.occupation}
              </Badge>
              {job.contractPeriod && (
                <Badge variant="outline" className="text-xs">
                  {job.contractPeriod} months
                </Badge>
              )}
            </div>

            {/* Application Status Message */}
            <div className="text-sm text-gray-500 mb-3">
              {job.applicationStatus === "pending" && "Your application is under review"}
              {job.applicationStatus === "shortlisted" && "🎉 You've been shortlisted! Expect a call soon"}
              {job.applicationStatus === "interviewed" && "Interview completed. Awaiting results"}
              {job.applicationStatus === "selected" && "🎉 Congratulations! You've been selected"}
              {job.applicationStatus === "rejected" && "Application was not successful this time"}
            </div>
          </div>

          {/* Job Image */}
          <div className="col-span-12 lg:col-span-4">
            <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
              <Image
                src={job.jobPhoto}
                alt="Job"
                fill
                className="object-cover"
              />
            </div>
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
            View Job Details
          </Button>
          
          {job.applicationStatus === "selected" && (
            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Download Offer Letter
            </Button>
          )}
          
          {job.applicationStatus === "shortlisted" && (
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Prepare for Interview
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
