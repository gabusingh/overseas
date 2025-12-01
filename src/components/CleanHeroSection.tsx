"use client";
import React, { useMemo } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import SearchComponent from "./SearchComponent";
import PopularSearches from "./PopularSearches";
import { useOccupations } from "../hooks/useInfoQueries";

interface Department {
  label: string;
  value: number;
  img: string;
}

interface Country {
  id: number;
  name: string;
}

interface CleanHeroSectionProps {
  data?: Department[];
  countryData?: Country[];
}

function CleanHeroSection({ data: propData, countryData }: CleanHeroSectionProps) {
  // Use cached hook instead of direct API calls
  const { data: occupationsData = [] } = useOccupations();
  
  // Process department list from props or cached data
  const departmentList = useMemo(() => {
    if (propData) {
      return propData;
    }
    return occupationsData.map((item: { id: number; title?: string; name?: string; occupation?: string }) => ({
      id: item.id,
      title: item.title || item.name || item.occupation,
      name: item.title || item.name || item.occupation,
      label: item.title || item.name || item.occupation || 'Unknown',
      value: item.id,
      img: `/images/institute.png`,
    }));
  }, [propData, occupationsData]);

  // Process country list from props
  const countryList = useMemo(() => {
    return countryData || [];
  }, [countryData]);

  return (
    <section className="relative py-12 md:py-20 min-h-[600px] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homeBg.jpg')"
        }}
      />
      <div className="absolute inset-0 bg-blue-900/60" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Find your dream job abroad
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Discover thousands of international job opportunities in 50+ countries
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-6">
            <SearchComponent fullWidth={true} data={departmentList} countryData={countryList} />
          </div>

          {/* Popular Searches */}
          <PopularSearches 
            data={departmentList.length > 0 ? departmentList.slice(0, 6) : undefined}
            variant="hero"
            maxItems={6}
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">50+</h3>
            <p className="text-blue-100 mt-1">Countries</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">10,000+</h3>
            <p className="text-blue-100 mt-1">Active Jobs</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">5,000+</h3>
            <p className="text-blue-100 mt-1">Companies</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">25,000+</h3>
            <p className="text-blue-100 mt-1">Job Seekers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CleanHeroSection;
