"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "../contexts/GlobalProvider";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";

interface HraJobCardProps {
  value: {
    id: number;
    jobTitle: string;
    jobWages: number;
    jobWagesCurrencyType: string;
    givenCurrencyValue?: number;
    created_at: string;
    jobPhoto: string;
    jobLocationCountry: {
      name: string;
      countryFlag: string;
    };
    occupation: string;
    jobAgeLimit: string;
    passportType: string;
    jobExpTypeReq: string;
    totalAppliedCandidates: number;
    jobDeadline: string;
    interviewPlaceNotification?: boolean;
  };
  slider?: boolean;
}

function HraJobCard({ value, slider }: HraJobCardProps) {
  const { globalState } = useGlobalState();
  const router = useRouter();

  const navigateToJobDetails = () => {
    router.push(`/job-description/${value?.id}`);
  };

  return (
    <div className={`${slider ? "w-full" : "lg:w-1/2"} w-full p-0 md:p-2`}>
      <Card className="mx-2 my-3 shadow-md">
        <CardContent className="p-3 md:p-4">
          {value?.interviewPlaceNotification && (
            <div className="flex justify-end text-xl mb-2">
              <i className="fa fa-bell-o text-red-500"></i>
            </div>
          )}
          
          <h2 className="text-xl font-semibold mb-3">{value?.jobTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                {value?.givenCurrencyValue ? (
                  <p className="text-sm mb-0">
                    {value?.jobWages} {value?.jobWagesCurrencyType} ={" "}
                    {Math.round(value?.jobWages * value?.givenCurrencyValue)} INR
                  </p>
                ) : (
                  <p className="text-sm mb-0">
                    {value?.jobWages} {value?.jobWagesCurrencyType}
                  </p>
                )}
                <p className="text-sm text-green-600 mb-0">
                  Job Posted On: {value?.created_at}
                </p>
              </div>
            </div>
            
            <div className="block md:hidden">
              <img
                className="w-full h-auto rounded"
                src={value?.jobPhoto}
                alt="Job Image"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <img
                  className="w-6 h-4 object-cover"
                  src={
                    "https://backend.overseas.ai/storage/uploads/countryFlag/" +
                    value?.jobLocationCountry?.countryFlag
                  }
                  alt="Flag Image"
                />
                <p className="ml-2 mb-0">{value?.jobLocationCountry?.name}</p>
              </div>
              
              <p className="my-1">Department: {value?.occupation}</p>
              <p className="my-1">Age Limit: {value?.jobAgeLimit}</p>
              <p className="my-1">Passport Type: {value?.passportType}</p>
              <p className="my-1">Experience Type: {value?.jobExpTypeReq}</p>
            </div>
            
            <div className="hidden md:block">
              <img
                className="w-full h-auto rounded"
                src={value?.jobPhoto}
                alt="Job Image"
              />
            </div>
          </div>
          
          {value?.totalAppliedCandidates > 0 ? (
            <p className="mt-3">
              <Link href="#" className="text-blue-600 hover:text-blue-800">
                {value?.totalAppliedCandidates} Candidates Applied in this Job
              </Link>
            </p>
          ) : (
            <p className="mt-3">
              {value?.totalAppliedCandidates} Candidates Applied in this Job
            </p>
          )}
          
          <p className="text-red-600 mb-4">
            Job Deadline - {value?.jobDeadline}
          </p>
          
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm"
                onClick={() => router.push(`/edit-jobs/${value.id}`)}
              >
                Update
              </Button>
              <Button size="sm" variant="outline">
                Applied Candidates
              </Button>
              <Button 
                size="sm"
                onClick={() => router.push(`/recommended-candidates/${value?.id}`)}
              >
                Get Recommendations
              </Button>
            </div>
            
            <p 
              className="text-blue-600 cursor-pointer hover:text-blue-800 mt-2 md:mt-0"
              onClick={navigateToJobDetails}
            >
              Read Details
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HraJobCard;
