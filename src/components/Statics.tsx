"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Building, CheckSquare, TrendingUp, BarChart } from "lucide-react";

interface StaticsProps {
  stats: {
    totalJobs: number;
    jobSeekers: number;
    companies: number;
    placedCandidates: number;
    successRatio: string;
    growthRate: string;
  };
}

export default function Statics({ stats }: StaticsProps) {
  const statItems = [
    {
      icon: <Briefcase className="w-8 h-8 text-blue-500" />,
      value: stats.totalJobs.toLocaleString(),
      label: "Total Jobs Available",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      value: stats.jobSeekers.toLocaleString(),
      label: "Active Job Seekers",
      color: "bg-blue-50 border-green-200"
    },
    {
      icon: <Building className="w-8 h-8 text-purple-500" />,
      value: stats.companies.toLocaleString(),
      label: "Registered Companies",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <CheckSquare className="w-8 h-8 text-teal-500" />,
      value: stats.placedCandidates.toLocaleString(),
      label: "Placed Candidates",
      color: "bg-teal-50 border-teal-200"
    },
    {
      icon: <BarChart className="w-8 h-8 text-yellow-500" />,
      value: stats.successRatio,
      label: "Success Ratio",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-red-500" />,
      value: stats.growthRate,
      label: "Platform Growth",
      color: "bg-red-50 border-red-200"
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Global Impact in Numbers
          </h2>
          <p className="mt-3 text-lg text-gray-600 sm:mt-4">
            Connecting talent with opportunities worldwide
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {statItems.map((item, index) => (
            <Card key={index} className={`text-center transition-transform transform hover:-translate-y-2 ${item.color} border-2`}>
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-md">
                  {item.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
