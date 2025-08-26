"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getOccupations } from "../services/info.service";
import SearchComponent from "./SearchComponent";
import AnimatedLanguageText from "./AnimatedLanguageText";

interface Department {
  label: string;
  value: number;
  img: string;
}

interface Country {
  id: number;
  name: string;
}

interface HeroSectionProps {
  data?: Department[];
  countryData?: Country[];
}

// Memoized HeroSection component to prevent unnecessary re-renders
const HeroSection = React.memo(({ data: propData, countryData }: HeroSectionProps) => {
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [countryList, setCountryList] = useState<Country[]>([]);
  
  // Animation refs
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  // Indian language words for "Job"
  const jobWords = useMemo(() => [
    { text: "Job", language: "English" },
    { text: "नौकरी", language: "Hindi" },
    { text: "কাজ", language: "Bengali" },
    { text: "வேலை", language: "Tamil" },
    { text: "ಕೆಲಸ", language: "Kannada" },
    { text: "काम", language: "Marathi" },
    { text: "કામ", language: "Gujarati" },
    { text: "ജോലി", language: "Malayalam" },
    { text: "ఉద్యోగం", language: "Telugu" },
    { text: "ਨੌਕਰੀ", language: "Punjabi" },
    { text: "କାମ", language: "Odia" },
    { text: "नोकरी", language: "Konkani" }
  ], []);

  // Memoize the API call function to prevent recreation on every render
  const getOccupationsListFunc = useCallback(async () => {
    try {
      console.log('🔄 HeroSection: Fetching occupations...');
      const response = await getOccupations();
      console.log('📊 HeroSection: Occupations response:', response);
      
      const rawData = response?.occupation || response?.data || [];
      const occupations = rawData.map((item: { id: number; title: string; name: string; occupation?: string }) => ({
        label: item.title || item.name || item.occupation,
        value: item.id,
        img: `/images/institute.png`,
      }));
      setDepartmentList(occupations || []);
      console.log('✅ HeroSection: Occupations loaded:', occupations?.length || 0);
    } catch (error) {
      console.error('❌ HeroSection: Error fetching occupations:', error);
      // Set fallback data for hero section
      const fallbackOccupations = [
        { label: "Construction", value: 1, img: "/images/institute.png" },
        { label: "Hospitality", value: 2, img: "/images/institute.png" },
        { label: "Healthcare", value: 3, img: "/images/institute.png" },
        { label: "Oil & Gas", value: 4, img: "/images/institute.png" },
        { label: "IT & Software", value: 5, img: "/images/institute.png" },
      ];
      setDepartmentList(fallbackOccupations);
    }
  }, []);

  // Memoize the data processing to prevent unnecessary re-renders
  const processedDepartmentList = useMemo(() => {
    if (propData) {
      return propData;
    }
    return departmentList;
  }, [propData, departmentList]);

  const processedCountryList = useMemo(() => {
    return countryData || countryList;
  }, [countryData, countryList]);

  useEffect(() => {
    // Only fetch data if not provided as props
    if (!propData && departmentList.length === 0) {
      getOccupationsListFunc();
    }
  }, [propData, getOccupationsListFunc, departmentList.length]);

  useEffect(() => {
    if (countryData) {
      setCountryList(countryData);
    }
  }, [countryData]);

  // Memoize the hero content to prevent unnecessary re-renders
  const heroContent = useMemo(() => (
    <div ref={containerRef} className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          {/* Hero Title */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={{
                duration: 1,
                delay: 0.25,
              }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight"
            >
              Find Your Dream{" "}
              <AnimatedLanguageText 
                words={jobWords} 
                interval={2000}
                className="font-extrabold"
              />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={{
                duration: 1,
                delay: 0.5,
              }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            >
              Discover millions of job opportunities with all the information you need. It's your future.
            </motion.p>
          </div>

          {/* Search Component */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
            transition={{
              duration: 1,
              delay: 0.75,
            }}
            className="mb-12"
          >
            <SearchComponent 
              fullWidth={true} 
              data={processedDepartmentList} 
              countryData={processedCountryList} 
            />
          </motion.div>
        </div>
      </div>
    </div>
  ), [processedDepartmentList, processedCountryList, isInView, jobWords]);

  return heroContent;
});

// Set display name for debugging
HeroSection.displayName = 'HeroSection';

export default HeroSection;
