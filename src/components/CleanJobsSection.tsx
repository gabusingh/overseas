"use client";
import React from "react";
import Link from "next/link";
import { MapPin, Briefcase, ChevronRight } from "lucide-react";

interface Department {
  label: string;
  value: number;
  img: string;
}

interface Country {
  id: number;
  name: string;
}

interface CleanJobsSectionProps {
  countryData?: Country[];
  departmentData?: Department[];
}

function CleanJobsSection({ countryData = [], departmentData = [] }: CleanJobsSectionProps) {
  // Top countries for jobs (limit to 8)
  const topCountries = countryData.slice(0, 8);
  
  // Top job categories (limit to 6)
  const topCategories = departmentData.slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Countries Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Jobs by top countries
            </h2>
            <Link 
              href="/jobs"
              className="text-blue-600 hover:text-blue-700 flex items-center font-medium"
            >
              View all countries
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topCountries.map((country, index) => (
              <Link 
                key={index}
                href={`/jobs/${country.name.toLowerCase().replace(/\s+/g, "-")}-jobs`}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center mb-3">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {country.name}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Available positions
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Job Categories Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Popular job categories
            </h2>
            <Link 
              href="/jobs"
              className="text-blue-600 hover:text-blue-700 flex items-center font-medium"
            >
              View all categories
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCategories.map((category, index) => (
              <Link 
                key={index}
                href={`/jobs/${category.label.toLowerCase().replace(/\s+/g, "-")}-jobs`}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center mb-3">
                  <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {category.label}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Browse opportunities
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Jobs Preview */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Latest jobs
            </h2>
            <Link 
              href="/jobs"
              className="text-blue-600 hover:text-blue-700 flex items-center font-medium"
            >
              View all jobs
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {/* Sample Job Cards - You can replace this with actual job data from API */}
          <div className="space-y-4">
            {[
              {
                title: "Construction Supervisor",
                company: "Global Construction Co.",
                location: topCountries[0]?.name || "Dubai, UAE",
                salary: "$3,500 - $4,500",
                type: "Full-time",
                posted: "2 days ago",
                category: topCategories[0]?.label || "Construction"
              },
              {
                title: "Software Developer", 
                company: "Tech Solutions Inc.",
                location: topCountries[1]?.name || "Singapore",
                salary: "$4,000 - $6,000",
                type: "Full-time",
                posted: "1 day ago",
                category: topCategories[1]?.label || "IT"
              },
              {
                title: "Healthcare Professional",
                company: "Healthcare International",
                location: topCountries[2]?.name || "Canada", 
                salary: "$3,800 - $5,200",
                type: "Full-time",
                posted: "3 hours ago",
                category: topCategories[2]?.label || "Healthcare"
              }
            ].map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">{job.company}</p>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div>{job.salary}</div>
                      <div className="bg-blue-100 text-green-800 px-2 py-1 rounded text-xs">
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-2">{job.posted}</div>
                    <Link 
                      href="/jobs"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CleanJobsSection;
