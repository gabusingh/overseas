"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, ChevronRight, MapPin, Building2, TrendingUp, Clock, ArrowRight, ChevronLeft } from "lucide-react";
import { getOccupations, getJobByDepartment } from "../services/job.service";

interface Occupation {
  id: number;
  occupation: string;
  occuIcon: string;
  occuLgIcon: string;
  occuImage?: string | null;
  occupation_hi?: string | null;
  occupation_bn?: string | null;
  icon?: string | null;
  jobCount?: number;
  avgSalary?: string | null; // Made nullable since it comes from API
  popularLocations?: string[] | null; // Made nullable since it comes from API
  growth?: 'High' | 'Moderate' | 'Low' | null; // Made nullable since it comes from API
  created_at?: string | null;
  updated_at?: string | null;
}

interface FindJobsByDepartmentProps {
  limit?: number;
  showViewAll?: boolean;
}

const FindJobsByDepartment: React.FC<FindJobsByDepartmentProps> = ({
  limit = 12,
  showViewAll = true
}) => {
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobCounts, setJobCounts] = useState<Record<number, number>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Note: All data will come from API - no hardcoded values

  const fetchOccupationsData = async () => {
    try {
      setLoading(true);
      const response = await getOccupations();
      

      
      // Handle different response structures - try all possible paths
      let occupationData = [];
      
      // Try different response structures
      if (response?.occupation && Array.isArray(response.occupation)) {
        occupationData = response.occupation;
      } else if (response?.data?.occupation && Array.isArray(response.data.occupation)) {
        occupationData = response.data.occupation;
      } else if (response?.data && Array.isArray(response.data)) {
        occupationData = response.data;
      } else if (Array.isArray(response)) {
        occupationData = response;
      }
      
    
      
      if (occupationData && occupationData.length > 0) {
        const processedOccupations = occupationData.map((item: any, index: number) => {
          return {
            ...item,
            // Only use data from API - no hardcoded values
            avgSalary: item.avgSalary || null, // Use API salary data if available
            popularLocations: item.popularLocations || [], // Use API location data if available
            growth: item.growth || null // Use API growth data if available
          };
        });


        setOccupations(processedOccupations);
        
        // Fetch real job counts for top departments
        fetchJobCountsForDepartments(processedOccupations.slice(0, 6));
      } else {
        console.error('No occupation data found in response. Full response:', response);
        setOccupations([]); // Set empty array - no mock data
      }
    } catch (error) {
      console.error("Error fetching occupations:", error);
      setOccupations([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchJobCountsForDepartments = async (departments: Occupation[]) => {
    const jobCountPromises = departments.map(async (dept) => {
      try {
        const response = await getJobByDepartment(dept.id);
        return {
          deptId: dept.id,
          count: response?.data?.jobs?.length || response?.data?.data?.length || 0
        };
      } catch {
        return {
          deptId: dept.id,
          count: 0
        };
      }
    });

    try {
      const results = await Promise.all(jobCountPromises);
      const countsMap: Record<number, number> = {};
      results.forEach(result => {
        countsMap[result.deptId] = result.count;
      });
      setJobCounts(countsMap);
    } catch (error) {
      console.error("Error fetching job counts:", error);
    }
  };

  const getIconUrl = (occupation: Occupation): string => {
    if (occupation.occuLgIcon) {
      return `https://backend.overseas.ai/storage/uploads/occupationImage/${occupation.id}/${occupation.occuLgIcon}`;
    }
    return "/images/default-occupation.png";
  };

  const handleDepartmentClick = (occupation: Occupation) => {
    router.push(`/jobs?department=${occupation.id}&departmentName=${encodeURIComponent(occupation.occupation)}`);
  };

  const displayOccupations = occupations.slice(0, 3); // Always show only 3 cards
  const remainingOccupations = occupations.slice(3); // Rest for slider
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(remainingOccupations.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    fetchOccupationsData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20 mx-auto mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section  */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Jobs by Department
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore career opportunities across {occupations.length}+ specialized departments and industries
          </p>
        </div>

        {/* Popular Departments Highlight */}
        {displayOccupations.length > 0 && (
          <div className="mb-12 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6" />
              <h3 className="text-2xl font-semibold">Top Departments</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayOccupations.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleDepartmentClick(dept)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 px-4 py-3 rounded-lg text-left transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img 
                      src={getIconUrl(dept)}
                      alt={dept.occupation}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling && ((target.nextElementSibling as HTMLElement).style.display = 'block');
                      }}
                    />
                    <Briefcase className="w-6 h-6 text-white" style={{ display: 'none' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-white text-sm line-clamp-1 group-hover:text-blue-100">
                      {dept.occupation}
                    </div>
                    <div className="text-blue-100 text-xs">
                      {jobCounts[dept.id] || 'Available'} jobs
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{displayOccupations.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{occupations.length}</span> departments
          </div>
        </div>

        {/* Top 3 Departments - Main Cards */}
        {displayOccupations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayOccupations.map((occupation) => {
              const realJobCount = jobCounts[occupation.id] || 0;
              
              return (
                <div
                  key={occupation.id}
                  onClick={() => handleDepartmentClick(occupation)}
                  onMouseEnter={() => setHoveredCard(occupation.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 p-6 cursor-pointer transition-all duration-300 group hover:shadow-xl ${
                    hoveredCard === occupation.id ? 'transform scale-105 shadow-2xl' : 'hover:shadow-lg'
                  }`}
                >
                  {/* Department Icon */}
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                      <img 
                        src={getIconUrl(occupation)}
                        alt={occupation.occupation}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/default-occupation.png";
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-lg line-clamp-2 leading-tight">
                      {occupation.occupation}
                    </h3>
                  </div>

                  {/* Job Count Badge */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Briefcase className="w-3 h-3" />
                      {realJobCount > 0 ? `${realJobCount} jobs` : 'Available jobs'}
                    </div>
                  </div>

                  {/* Department Stats */}
                  <div className="space-y-3 mb-4">
                    {occupation.avgSalary && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          Salary Range
                        </span>
                        <span className="font-semibold text-gray-900">{occupation.avgSalary}</span>
                      </div>
                    )}
                    
                    {occupation.growth && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Growth
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          occupation.growth === 'High' 
                            ? 'bg-green-100 text-green-700' 
                            : occupation.growth === 'Moderate'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {occupation.growth}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Popular Locations */}
                  {occupation.popularLocations && occupation.popularLocations.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 font-medium">Top Locations</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {occupation.popularLocations.slice(0, 2).map((location, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 group-hover:bg-blue-50 text-gray-700 group-hover:text-blue-700 px-2 py-1 rounded text-xs font-medium transition-colors"
                          >
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-blue-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Updated today</span>
                    </div>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium text-sm">
                      <span>View Jobs</span>
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Remaining Departments Slider */}
        {remainingOccupations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">More Departments</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  disabled={totalSlides <= 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  {currentSlide + 1} / {totalSlides}
                </span>
                <button
                  onClick={nextSlide}
                  disabled={totalSlides <= 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="relative overflow-hidden">
              <div 
                ref={sliderRef}
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }, (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {remainingOccupations
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map((occupation) => {
                          const realJobCount = jobCounts[occupation.id] || 0;
                          return (
                            <div
                              key={occupation.id}
                              onClick={() => handleDepartmentClick(occupation)}
                              className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 p-4 cursor-pointer transition-all duration-300 group hover:shadow-lg"
                            >
                              <div className="text-center mb-3">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 rounded-lg flex items-center justify-center mb-2 transition-colors">
                                  <img 
                                    src={getIconUrl(occupation)}
                                    alt={occupation.occupation}
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = "/images/default-occupation.png";
                                    }}
                                  />
                                </div>
                                <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors text-sm line-clamp-2">
                                  {occupation.occupation}
                                </h4>
                              </div>
                              
                              <div className="text-center mb-3">
                                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  <Briefcase className="w-3 h-3" />
                                  {realJobCount > 0 ? `${realJobCount}` : 'Jobs'}
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <span className="text-xs text-blue-600 group-hover:text-blue-700 font-medium">
                                  View Opportunities →
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {displayOccupations.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-600 mb-6">
              Unable to load departments. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}

        {/* View All Button */}
        {showViewAll && occupations.length > 3 && (
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/jobs')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2 group"
            >
              View All {occupations.length} Departments
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FindJobsByDepartment;
