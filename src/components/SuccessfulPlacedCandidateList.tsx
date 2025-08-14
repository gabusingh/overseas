"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";

interface SuccessfulPlacedCandidateListProps {
  rounded?: boolean;
  backgroundColor?: string;
}

function SuccessfulPlacedCandidateList({ 
  rounded = false, 
  backgroundColor = "bg-blue-50" 
}: SuccessfulPlacedCandidateListProps) {
  const successStories = [
    {
      name: "Rajesh Kumar",
      position: "Software Engineer",
      company: "TechCorp Singapore",
      image: "/images/candidate1.svg",
      flag: "🇸🇬",
      testimonial: "Found my dream job through Overseas.ai!"
    },
    {
      name: "Priya Singh",
      position: "Nurse",
      company: "Dubai Healthcare",
      image: "/images/candidate2.svg", 
      flag: "🇦🇪",
      testimonial: "Amazing platform for overseas opportunities."
    },
    {
      name: "Mohammed Ali",
      position: "Project Manager",
      company: "Canadian Industries",
      image: "/images/candidate3.svg",
      flag: "🇨🇦", 
      testimonial: "Professional service and great job matches."
    },
    {
      name: "Sarah Johnson",
      position: "Marketing Specialist",
      company: "Australian Marketing Ltd",
      image: "/images/candidate4.svg",
      flag: "🇦🇺",
      testimonial: "Quick placement and excellent support."
    }
  ];

  return (
    <section className={`py-12 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Success Stories</h2>
          <p className="text-gray-600">Meet professionals who found their dream jobs overseas</p>
        </div>

        {/* Scrolling notification bar */}
        <div className="overflow-hidden mb-12">
          <div className="flex animate-scroll space-x-6">
            {[...successStories, ...successStories].map((candidate, i) => (
              <div key={i} className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm min-w-max">
                <Image
                  src={candidate.image}
                  alt={candidate.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">{candidate.name}</p>
                  <p className="text-xs text-gray-600">
                    {candidate.flag} {candidate.position} at {candidate.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {successStories.map((candidate, i) => (
            <Card key={i} className="shadow-sm border-0 h-full">
              <CardContent className="text-center p-6">
                <Image
                  src={candidate.image}
                  alt={candidate.name}
                  width={80}
                  height={80}
                  className={`mx-auto mb-4 ${rounded ? 'rounded-full' : 'rounded-lg'}`}
                  style={{ objectFit: "cover" }}
                />
                <h6 className="text-lg font-semibold text-blue-600 mb-2">{candidate.name}</h6>
                <p className="text-gray-600 text-sm mb-2">
                  {candidate.position}
                </p>
                <p className="text-green-600 text-sm mb-4">
                  {candidate.flag} {candidate.company}
                </p>
                <p className="text-sm italic text-gray-600">
                  &quot;{candidate.testimonial}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SuccessfulPlacedCandidateList;
