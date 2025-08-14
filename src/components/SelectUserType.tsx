"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building, GraduationCap, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface SelectUserTypeProps {
  onSelect?: (userType: string) => void;
  showTitle?: boolean;
}

export default function SelectUserType({ onSelect, showTitle = true }: SelectUserTypeProps) {
  const router = useRouter();

  const handleSelection = (userType: string, route: string) => {
    if (onSelect) {
      onSelect(userType);
    } else {
      router.push(route);
    }
  };

  const userTypes = [
    {
      type: "candidate",
      title: "Job Seeker",
      description: "Looking for overseas job opportunities",
      icon: User,
      route: "/candidate-register",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800",
      iconColor: "text-blue-600"
    },
    {
      type: "employer",
      title: "Employer/Company",
      description: "Post jobs and hire skilled workers",
      icon: Building,
      route: "/employer-signup",
      color: "bg-green-50 border-green-200 hover:bg-green-100 text-green-800",
      iconColor: "text-green-600"
    },
    {
      type: "institute",
      title: "Training Institute",
      description: "Offer skill development courses",
      icon: GraduationCap,
      route: "/institute-signup",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-800",
      iconColor: "text-purple-600"
    },
    {
      type: "partner",
      title: "Business Partner",
      description: "Collaborate and expand overseas",
      icon: UserPlus,
      route: "/partner-signup",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-800",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Account Type</h2>
          <p className="text-gray-600">Select the option that best describes you to get started</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userTypes.map((userType) => {
          const IconComponent = userType.icon;
          
          return (
            <Card 
              key={userType.type}
              className={`cursor-pointer transition-all duration-300 border-2 ${userType.color} hover:shadow-lg hover:scale-105`}
              onClick={() => handleSelection(userType.type, userType.route)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-sm`}>
                  <IconComponent className={`w-8 h-8 ${userType.iconColor}`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{userType.title}</h3>
                <p className="text-sm opacity-80 mb-4">{userType.description}</p>
                
                <Button 
                  variant="outline" 
                  className={`w-full transition-all duration-300 ${
                    userType.type === 'candidate' 
                      ? 'border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white'
                      : userType.type === 'employer'
                      ? 'border-green-500 text-green-600 hover:bg-green-600 hover:text-white'
                      : userType.type === 'institute'
                      ? 'border-purple-500 text-purple-600 hover:bg-purple-600 hover:text-white'
                      : 'border-orange-500 text-orange-600 hover:bg-orange-600 hover:text-white'
                  }`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <button 
            onClick={() => router.push("/login")}
            className="text-[#17487f] hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
