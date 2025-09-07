"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import PopularSearches from "./PopularSearches";
import { getPopularSearchKeywords } from "../services/popularSearch.service";

interface SearchComponentProps {
  fullWidth?: boolean;
  data?: Array<{ label: string; value: number; img: string }>;
  countryData?: Array<{ id: number; name: string }>;
}

// Speech recognition interface for browser compatibility
interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      [index: number]: { transcript: string };
    };
  };
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

// Experience levels for dropdown
const experienceLevels = [
  { label: "Fresher", value: "0" },
  { label: "1-2 years", value: "1-2" },
  { label: "3-5 years", value: "3-5" },
  { label: "6-10 years", value: "6-10" },
  { label: "10+ years", value: "10+" }
];

// Memoized SearchComponent to prevent unnecessary re-renders
const SearchComponent = React.memo(({ fullWidth, data = [], countryData = [] }: SearchComponentProps) => {
  const [searchKey, setSearchKey] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [popularSearches, setPopularSearches] = useState<Array<{ label: string; value: number }>>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();

  // Memoize speech recognition setup to prevent recreation
  const setupSpeechRecognition = useCallback(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setSearchKey(transcript);
        };

        recognition.onerror = (event) => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    setupSpeechRecognition();
  }, [setupSpeechRecognition]);

  // Fetch popular search keywords from actual job data
  useEffect(() => {
    let isMounted = true;
    
    const fetchPopularKeywords = async () => {
      try {
        const keywords = await getPopularSearchKeywords(6); // Get top 6 keywords
        
        if (isMounted) {
          setPopularSearches(keywords);
          setLoadingPopular(false);
        }
      } catch (error: any) {
        if (isMounted) {
          // Fallback to occupation data if available
          const fallbackData = data.slice(0, 6);
          if (fallbackData.length > 0) {
            setPopularSearches(fallbackData);
          } else {
            // Ultimate fallback with common job terms (limited to 6)
            const ultimateFallback = [
              { label: "Construction", value: 1 },
              { label: "Engineering", value: 2 },
              { label: "Healthcare", value: 3 },
              { label: "Hospitality", value: 4 },
              { label: "IT Support", value: 5 },
              { label: "Manufacturing", value: 6 }
            ];
            setPopularSearches(ultimateFallback);
          }
          setLoadingPopular(false);
        }
      }
    };
    
    fetchPopularKeywords();
    
    return () => {
      isMounted = false;
    };
  }, [data]);

  // Memoize search navigation function
  const handleSearchNavigate = useCallback(() => {
    let searchUrl = "/jobs";
    const formattedSearchKey = searchKey.trim().replace(/\s+/g, "-");
    const formattedLocation = locationInput.trim().replace(/\s+/g, "-");
    
    if (formattedSearchKey.length > 0) {
      searchUrl += "/" + formattedSearchKey;
    }
    
    if (formattedLocation.length > 0) {
      searchUrl += "/" + formattedLocation;
    }
    
    router.push(searchUrl);
  }, [searchKey, locationInput, router]);

  // Memoize microphone click handler
  const handleMicClick = useCallback(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  }, [isListening]);

  // Memoize key press handler
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchNavigate();
    }
  }, [handleSearchNavigate]);

  // Memoize search button click handler for popular searches
  const handlePopularSearchClick = useCallback((item: { label: string; value: number }) => {
    
    try {
      // Update the search input for visual feedback
      setSearchKey(item.label);
      
      // Format the search key for URL compatibility
      const formattedSearchKey = item.label
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .toLowerCase(); // Convert to lowercase for consistency
      
      const searchUrl = `/jobs/${formattedSearchKey}`;
      
      // Track the search for analytics
      if (typeof window !== 'undefined') {
        try {
          const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
          searchHistory.push({
            keyword: item.label,
            source: 'popular_search',
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(-50))); // Keep last 50
        } catch (storageError) {
          // Silent fail for localStorage
        }
      }
      
      // Show a loading toast while navigating
      if (typeof window !== 'undefined') {
        // Create a simple toast notification if available
        const event = new CustomEvent('search-navigation', {
          detail: { keyword: item.label, url: searchUrl }
        });
        window.dispatchEvent(event);
      }
      
      // Navigate to the search results
      router.push(searchUrl);
      
    } catch (error) {
      // Show error notification if possible
      if (typeof window !== 'undefined') {
        const errorEvent = new CustomEvent('search-error', {
          detail: { keyword: item.label, error: error.message }
        });
        window.dispatchEvent(errorEvent);
      }
      
      // Fallback to a simple search URL
      const fallbackUrl = `/jobs?search=${encodeURIComponent(item.label)}`;
      router.push(fallbackUrl);
    }
  }, [router]);

  // Memoize the desktop search bar - Compact and Rounded
  const desktopSearchBar = useMemo(() => (
    <div className="hidden md:block mb-6">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center max-w-5xl mx-auto">
        {/* Skills/Job Title Input */}
        <div className="flex-1 flex items-center px-4 py-2">
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Job title, skills, or company"
              className="w-full border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-base font-medium"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300"></div>

        {/* Experience Dropdown */}
        <div className="flex-1 flex items-center px-4 py-2">
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </div>
          <select 
            className="flex-1 border-0 focus:outline-none text-gray-900 bg-transparent cursor-pointer text-base font-medium"
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
          >
            <option value="">Experience Level</option>
            {experienceLevels?.map((level, index) => (
              <option key={index} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300"></div>

        {/* Location Input */}
        <div className="flex-1 flex items-center px-4 py-2">
          <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="City, state, or remote"
            className="flex-1 border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-base font-medium"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Search Button */}
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full font-semibold flex items-center transition-all transform hover:scale-105 shadow-md ml-2 text-sm"
          onClick={handleSearchNavigate}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>

        {/* Voice Search Button */}
        <button
          className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
            isListening 
              ? 'bg-blue-100 text-green-600 shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
          }`}
          onClick={handleMicClick}
          title="Voice Search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
    </div>
  ), [searchKey, selectedExperience, locationInput, handleKeyPress, handleSearchNavigate, handleMicClick, isListening]);

  // Memoize the mobile search bar - Compact and Rounded
  const mobileSearchBar = useMemo(() => (
    <div className="md:hidden space-y-3 mb-6">
      {/* Main Search Input */}
      <div className="bg-white rounded-full shadow-md border border-gray-200 p-3 flex items-center">
        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Job title, skills, or company"
          className="flex-1 border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-base font-medium"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-blue-100 text-green-600' 
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={handleMicClick}
          title="Voice Search"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>

      {/* Experience and Location Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-full shadow border border-gray-200 p-3 flex items-center">
          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </div>
          <select 
            className="flex-1 border-0 focus:outline-none text-gray-900 bg-transparent cursor-pointer text-sm font-medium"
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
          >
            <option value="">Experience</option>
            {experienceLevels?.map((level, index) => (
              <option key={index} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-full shadow border border-gray-200 p-3 flex items-center">
          <div className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Location"
            className="flex-1 border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      {/* Search Button */}
      <button
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-full font-semibold flex items-center justify-center transition-all transform hover:scale-105 shadow-md text-base"
        onClick={handleSearchNavigate}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search Jobs
      </button>
    </div>
  ), [searchKey, selectedExperience, locationInput, handleKeyPress, handleSearchNavigate, handleMicClick, isListening]);

  // Memoize the popular searches section
  const popularSearchesSection = useMemo(() => {
    // Don't show popular searches while loading
    if (loadingPopular) {
      return (
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500 mb-4">Loading popular searches...</div>
          <div className="flex justify-center gap-2">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      );
    }
    
    // Show popular searches from job data
    if (popularSearches.length > 0) {
      return (
        <PopularSearches 
          data={popularSearches}
          variant="hero"
          maxItems={6}
          onSearchClick={handlePopularSearchClick}
          className="mt-6"
        />
      );
    }
    return (
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">No popular searches available</p>
      </div>
    );
    
    // No popular searches available
    return null;
  }, [popularSearches, loadingPopular, handlePopularSearchClick]);

  // Memoize the voice search status
  const voiceSearchStatus = useMemo(() => {
    if (!isListening) return null;
    
    return (
      <div className="text-center mt-4">
        <div className="inline-flex items-center px-3 py-2 bg-blue-100 text-green-800 rounded-full animate-pulse">
          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span className="text-xs font-medium">Listening... Speak now</span>
        </div>
      </div>
    );
  }, [isListening]);

  return (
    <div className="w-full">
      {/* Main Search Bar - Compact and Rounded */}
      {desktopSearchBar}

      {/* Mobile Search Bar - Compact and Rounded */}
      {mobileSearchBar}

      {/* Popular Searches - Compact */}
      {popularSearchesSection}
      
      {/* Voice Search Status */}
      {voiceSearchStatus}
    </div>
  );
});

// Set display name for debugging
SearchComponent.displayName = 'SearchComponent';

export default SearchComponent;
