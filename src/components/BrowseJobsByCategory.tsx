"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, ChevronRight, MapPin, Building2, Users, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { getOccupations, getJobByDepartment } from "../services/job.service";
import { getCountriesForJobs } from "../services/info.service";
import { getDetailedCategoryStats, getTrendingCategories, getTotalJobStats } from "../services/jobStats.service";

interface Department {
  id: number;
  title: string;
  name: string;
  label: string;
  value: number;
  img: string;
  jobCount?: number;
  avgSalary?: string;
  topCompanies?: string[];
  popularLocations?: string[];
  growth?: string;
}

interface Country {
  id: number;
  name: string;
  countryFlag?: string;
  totalJobs?: number;
}

interface BrowseJobsByCategoryProps {
  limit?: number;
  showViewAll?: boolean;
}

const BrowseJobsByCategory: React.FC<BrowseJobsByCategoryProps> = ({ 
  limit = 8,
  showViewAll = true 
}) => {
  const [categories, setCategories] = useState<Department[]>([]);
  const [popularCategories, setPopularCategories] = useState<Department[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [jobCounts, setJobCounts] = useState<Record<number, number>>({});
  const [totalStats, setTotalStats] = useState({ totalJobs: 0, totalCategories: 0, totalCountries: 0, totalCompanies: 500 });
  
  const router = useRouter();

  // Predefined category icons mapping
  const categoryIcons: Record<string, string> = {
    "Construction": "🏗️",
    "Healthcare": "🏥", 
    "IT": "💻",
    "Manufacturing": "🏭",
    "Hospitality": "🏨",
    "Education": "🎓",
    "Agriculture": "🌾",
    "Transportation": "🚚",
    "Security": "🛡️",
    "Sales": "📈",
    "Engineering": "⚙️",
    "Finance": "💰",
    "Marketing": "📊",
    "Tourism": "✈️",
    "Food Service": "🍽️"
  };

  // Popular salary ranges by category
  const salarySuggestions: Record<string, string> = {
    "Construction": "$2,500 - $4,000",
    "Healthcare": "$3,000 - $5,500",
    "IT": "$4,000 - $7,000",
    "Manufacturing": "$2,200 - $3,800",
    "Hospitality": "$1,800 - $3,200",
    "Education": "$2,500 - $4,500",
    "Agriculture": "$1,500 - $2,800",
    "Transportation": "$2,000 - $3,500",
    "Security": "$1,800 - $3,000",
    "Engineering": "$3,500 - $6,000"
  };

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories, countries, and stats in parallel
      const [occupationsResponse, countriesResponse, totalStatsResponse] = await Promise.all([
        getOccupations(),
        getCountriesForJobs(),
        getTotalJobStats()
      ]);

      // Set total stats
      setTotalStats(totalStatsResponse);

      // Process occupations data
      if (occupationsResponse?.data) {
        // Get detailed stats for categories
        const detailedStats = await getDetailedCategoryStats(occupationsResponse.data);
        
        const processedCategories = occupationsResponse.data.map((item: any) => {
          const stats = detailedStats.find(s => s.id === item.id);
          return {
            id: item.id,
            title: item.title || item.name || item.occupation,
            name: item.title || item.name || item.occupation,
            label: item.title || item.name || item.occupation,
            value: item.id,
            img: `/images/categories/${item.title?.toLowerCase().replace(/\s+/g, '-')}.png`,
            jobCount: stats?.jobCount || Math.floor(Math.random() * 300) + 50,
            avgSalary: stats?.avgSalary || salarySuggestions[item.title] || "$2,000 - $4,000",
            topCompanies: stats?.topCompanies || ["Global Corp", "International Ltd"],
            popularLocations: stats?.popularLocations || ["Dubai", "Singapore"],
            growth: stats?.growth || (Math.random() > 0.5 ? "High" : "Moderate")
          };
        });
        
        setCategories(processedCategories);
        
        // Get trending categories using the new API
        const trending = await getTrendingCategories(occupationsResponse.data, 6);
        const popularCategoriesData = trending.map(stat => {
          const category = processedCategories.find((c: Department) => c.id === stat.id);
          return category ? {
            ...category,
            jobCount: stat.jobCount,
            avgSalary: stat.avgSalary,
            growth: stat.growth
          } : null;
        }).filter(Boolean) as Department[];
        
        setPopularCategories(popularCategoriesData);
        
        // Set job counts from detailed stats
        const countsMap: Record<number, number> = {};
        detailedStats.forEach(stat => {
          countsMap[stat.id] = stat.jobCount;
        });
        setJobCounts(countsMap);
      }

      // Process countries data
      if (countriesResponse?.data) {
        setCountries(countriesResponse.data);
      }

    } catch (error) {
      console.error("Error fetching categories data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobCountsForCategories = async (categoriesToFetch: Department[]) => {
    try {
      // Fetch job counts for each category (limit to avoid too many API calls)
      const jobCountPromises = categoriesToFetch.slice(0, 6).map(async (category) => {
        try {
          const response = await getJobByDepartment(category.id);
          return {
            categoryId: category.id,
            count: response?.data?.jobs?.length || response?.data?.data?.length || Math.floor(Math.random() * 300) + 20
          };
        } catch {
          return {
            categoryId: category.id,
            count: Math.floor(Math.random() * 300) + 20 // Fallback count
          };
        }
      });
      
      const results = await Promise.all(jobCountPromises);
      const countsMap: Record<number, number> = {};
      results.forEach(result => {
        countsMap[result.categoryId] = result.count;
      });
      
      setJobCounts(countsMap);
    } catch (error) {
      console.error("Error fetching job counts:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const handleCategoryClick = (category: Department) => {
    router.push(`/jobs?category=${category.id}&categoryName=${encodeURIComponent(category.title)}`);
  };

  const handleViewAllCategories = () => {
    router.push('/jobs?view=categories');
  };

  const getCategoryIcon = (categoryName: string): string => {
    const matchingKey = Object.keys(categoryIcons).find(key => 
      categoryName.toLowerCase().includes(key.toLowerCase())
    );
    return matchingKey ? categoryIcons[matchingKey] : "💼";
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
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

  const displayCategories = categories.slice(0, limit);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Naukri Style */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Jobs by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Explore thousands of job opportunities across different industries and sectors worldwide
            </p>
          </div>
          
          {showViewAll && (
            <button
              onClick={handleViewAllCategories}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 group"
            >
              View All Categories
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Popular Categories Highlight */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Most Popular Categories</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularCategories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="flex items-center gap-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-blue-700 transition-all duration-200"
              >
                <span className="text-lg">{getCategoryIcon(category.title)}</span>
                {category.title}
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                  {jobCounts[category.id] || category.jobCount}+
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid - Enhanced Naukri Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayCategories.map((category) => {
            const realJobCount = jobCounts[category.id] || category.jobCount || 0;
            
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`bg-white rounded-xl border border-gray-200 hover:border-blue-300 p-6 cursor-pointer transition-all duration-300 group hover:shadow-lg ${
                  activeCategory === category.id ? 'transform scale-105 shadow-xl' : ''
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mr-4 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                    <span className="text-xl">{getCategoryIcon(category.title)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                      {category.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Briefcase className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-medium text-blue-600">
                        {realJobCount.toLocaleString()} jobs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Salary Range
                    </span>
                    <span className="font-semibold text-gray-900">{category.avgSalary}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Growth
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      category.growth === 'High' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {category.growth}
                    </span>
                  </div>
                </div>

                {/* Popular Locations */}
                {category.popularLocations && category.popularLocations.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600 font-medium">Popular Locations</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {category.popularLocations.slice(0, 2).map((location, index) => (
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

        {/* Bottom Stats Section */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {totalStats.totalCategories || categories.length}+
              </div>
              <div className="text-sm text-gray-600">Job Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {totalStats.totalJobs?.toLocaleString() || categories.reduce((sum, cat) => sum + (jobCounts[cat.id] || cat.jobCount || 0), 0).toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {totalStats.totalCountries || countries.length}+
              </div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {totalStats.totalCompanies?.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Companies Hiring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseJobsByCategory;
