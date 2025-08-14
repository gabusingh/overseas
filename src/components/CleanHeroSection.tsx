"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import SearchComponent from "./SearchComponent";
import { getOccupations } from "../services/info.service";

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
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [countryList, setCountryList] = useState<Country[]>([]);
  
  const getOccupationsListFunc = useCallback(async () => {
    try {
      const response = await getOccupations();
      const occupations = response?.data?.map((item: { id: number; title: string; name: string }) => ({
        label: item.title || item.name,
        value: item.id,
        img: `/images/institute.png`,
      }));
      setDepartmentList(occupations || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!propData) {
      getOccupationsListFunc();
    } else {
      setDepartmentList(propData);
    }
  }, [propData, getOccupationsListFunc]);

  useEffect(() => {
    if (countryData) {
      setCountryList(countryData);
    }
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
          <div className="mt-8 text-center">
            <p className="text-blue-100 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {departmentList.slice(0, 6).map((dept) => (
                <button
                  key={dept.value}
                  className="px-4 py-2 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>
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
