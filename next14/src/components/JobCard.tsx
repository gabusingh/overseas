"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Share2, 
  MapPin, 
  Clock, 
  Building, 
  Users, 
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import { saveJobById, removeFromSaved } from "@/services/job.service";

interface JobCardProps {
  value: {
    id: number;
    jobTitle: string;
    jobWages: number;
    jobWagesCurrencyType: string;
    givenCurrencyValue?: number;
    jobDeadline: string;
    jobPhoto: string;
    jobLocationCountry: {
      name: string;
      countryFlag: string;
    };
    occupation: string;
    jobAgeLimit: string;
    passportType: string;
    jobExpTypeReq: string;
    companyName?: string;
    applicationStatus?: 'not_applied' | 'applied' | 'shortlisted' | 'rejected' | 'selected';
    isUrgent?: boolean;
    isFeatured?: boolean;
    savedByUser?: boolean;
    totalApplications?: number;
    companyRating?: number;
    salaryNegotiable?: boolean;
    jobVacancyNo?: number;
    jobWorkingDay?: string;
    jobOvertime?: string;
    jobAccommodation?: string;
    jobFood?: string;
    createdAt?: string;
  };
  showSaveButton?: boolean;
  showShareButton?: boolean;
  compact?: boolean;
}

export default function JobCard({ 
  value, 
  showSaveButton = true, 
  showShareButton = true, 
  compact = false 
}: JobCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(value.savedByUser || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleSaveJob = async (event: React.MouseEvent) => {
    event.stopPropagation();
    
    const userToken = localStorage.getItem("access_token");
    if (!userToken) {
      toast.warning("Please login to save job");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await removeFromSaved(value.id.toString(), userToken);
        setIsSaved(false);
        toast.success("Job removed from saved list");
      } else {
        await saveJobById(value.id.toString(), userToken);
        setIsSaved(true);
        toast.success("Job saved successfully");
      }
    } catch (error) {
      toast.error("Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareJob = async (event: React.MouseEvent) => {
    event.stopPropagation();
    
    const jobUrl = `${window.location.origin}/job/${value?.jobLocationCountry?.name
      ?.trim()
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")}/${value?.jobTitle
      ?.trim()
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")}/${value?.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: value.jobTitle,
          text: `Check out this job opportunity: ${value.jobTitle} in ${value.jobLocationCountry.name}`,
          url: jobUrl
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(jobUrl);
        toast.success("Job link copied to clipboard");
      }
    } else {
      navigator.clipboard.writeText(jobUrl);
      toast.success("Job link copied to clipboard");
    }
  };

  const handleApplyJob = async (event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Check if user is logged in
    const userToken = localStorage.getItem("access_token");
    if (!userToken) {
      toast.warning("Please login to apply");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          id: value.id,
          "apply-job": "",
        }),
      });

      const data = await response.json();
      
      if (data.msg === "Job Applied Successfully") {
        toast.success(data.msg);
      } else if (data.error === "You have already applied for Job.") {
        toast.info("You have already applied for Job.");
      } else {
        toast.error("Failed to apply for job");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    } finally {
      setIsApplying(false);
    }
  };

  const handleCardClick = () => {
    const jobUrl = `/job/${value?.jobLocationCountry?.name
      ?.trim()
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")}/${value?.jobTitle
      ?.trim()
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")}/${value?.id}`;
    
    router.push(jobUrl);
  };

  const getApplicationStatusBadge = () => {
    switch (value.applicationStatus) {
      case 'applied':
        return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>;
      case 'shortlisted':
        return <Badge className="bg-yellow-100 text-yellow-800">Shortlisted</Badge>;
      case 'selected':
        return <Badge className="bg-green-100 text-green-800">Selected</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getDaysAgo = (dateString?: string) => {
    if (!dateString) return 'Recently posted';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  return (
    <div className="col-12 p-0 p-md-2 cursor-pointer" onClick={handleCardClick}>
      <Card className={`mx-2 my-3 shadow hover:shadow-lg transition-all duration-300 relative ${
        value.isFeatured ? 'border-2 border-yellow-400' : ''
      } ${value.isUrgent ? 'border-l-4 border-l-red-500' : ''}`}>
        
        {/* Status Badges */}
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          {value.isUrgent && (
            <Badge className="bg-red-500 text-white animate-pulse">
              <TrendingUp className="w-3 h-3 mr-1" />
              Urgent
            </Badge>
          )}
          {value.isFeatured && (
            <Badge className="bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {getApplicationStatusBadge()}
        </div>

        <CardContent className="p-4">
          {/* Header Row with Save and Share */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">{value?.jobTitle}</h2>
                {value.salaryNegotiable && (
                  <Badge variant="outline" className="text-xs">
                    Negotiable
                  </Badge>
                )}
              </div>
              {value.companyName && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Building className="w-4 h-4 mr-1" />
                  <span>{value.companyName}</span>
                  {value.companyRating && (
                    <div className="flex items-center ml-2">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs ml-1">{value.companyRating}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Action Icons */}
            <div className="flex gap-2">
              {showSaveButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveJob}
                  disabled={isSaving}
                  className={`p-2 ${isSaved ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
              )}
              {showShareButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShareJob}
                  className="p-2 text-gray-400 hover:text-blue-500"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Salary and Deadline Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4">
              {value?.givenCurrencyValue ? (
                <p className="text-lg font-semibold text-green-600">
                  {value?.jobWages} {value?.jobWagesCurrencyType} 
                  <span className="text-sm text-gray-500 ml-2">
                    ≈ {Math.round(value?.jobWages * value?.givenCurrencyValue)} INR
                  </span>
                </p>
              ) : (
                <p className="text-lg font-semibold text-green-600">
                  {value?.jobWages} {value?.jobWagesCurrencyType}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <Badge variant="outline" className="text-xs">
                {value?.jobDeadline}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Job Details */}
            <div className="col-span-12 md:col-span-8">
              {/* Country with Flag */}
              <div className="flex items-center mb-3">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <div className="w-6 h-4 relative mr-2">
                  <Image
                    src={`https://backend.overseas.ai/storage/uploads/countryFlag/${value?.jobLocationCountry?.countryFlag}`}
                    alt="Flag"
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                <p className="font-medium text-gray-800">{value?.jobLocationCountry?.name}</p>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium text-gray-700">Department:</span>
                  <p className="text-gray-600">{value?.occupation}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Age Limit:</span>
                  <p className="text-gray-600">{value?.jobAgeLimit}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Passport:</span>
                  <p className="text-gray-600">{value?.passportType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Experience:</span>
                  <p className="text-gray-600">{value?.jobExpTypeReq}</p>
                </div>
                {value.jobVacancyNo && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Positions:</span>
                    <p className="text-gray-600 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {value.jobVacancyNo} openings
                    </p>
                  </div>
                )}
              </div>
              
              {/* Additional Benefits */}
              {(value.jobAccommodation || value.jobFood || value.jobOvertime) && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {value.jobAccommodation === 'Yes' && (
                    <Badge variant="secondary" className="text-xs">
                      <Building className="w-3 h-3 mr-1" />
                      Accommodation
                    </Badge>
                  )}
                  {value.jobFood === 'Yes' && (
                    <Badge variant="secondary" className="text-xs">
                      🍽️ Food
                    </Badge>
                  )}
                  {value.jobOvertime === 'Yes' && (
                    <Badge variant="secondary" className="text-xs">
                      ⏰ Overtime
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Job Image */}
            <div className="col-span-12 md:col-span-4">
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <Image
                  src={value?.jobPhoto}
                  alt="Job"
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Footer with Stats and Actions */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            {/* Stats Row */}
            <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                {value.totalApplications && (
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {value.totalApplications} applied
                  </span>
                )}
                <span>{getDaysAgo(value.createdAt)}</span>
              </div>
              {value.companyRating && (
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                  <span>{value.companyRating} rating</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button 
                onClick={handleApplyJob}
                disabled={isApplying || value.applicationStatus === 'applied'}
                className={`px-6 transition-all ${
                  value.applicationStatus === 'applied'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#17487f] hover:bg-[#135a8a]'
                } text-white`}
              >
                {isApplying ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                {value.applicationStatus === 'applied' ? 'Applied' : 'Apply Now'}
              </Button>
              
              <div className="flex items-center gap-3">
                <p className="text-[#17487f] cursor-pointer hover:underline text-sm font-medium">
                  View Details
                </p>
                {value.applicationStatus && value.applicationStatus !== 'not_applied' && (
                  <div className="flex items-center text-sm">
                    {value.applicationStatus === 'applied' && <CheckCircle className="w-4 h-4 text-blue-500 mr-1" />}
                    {value.applicationStatus === 'shortlisted' && <Star className="w-4 h-4 text-yellow-500 mr-1" />}
                    {value.applicationStatus === 'selected' && <CheckCircle className="w-4 h-4 text-green-500 mr-1" />}
                    {value.applicationStatus === 'rejected' && <AlertCircle className="w-4 h-4 text-red-500 mr-1" />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
