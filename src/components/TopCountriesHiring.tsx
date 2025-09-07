"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, TrendingUp, Building, Users, Search, Filter } from 'lucide-react';

interface TopCountryHiring {
  id: number;
  name: string;
  name_hi?: string;
  name_bn?: string;
  countryFlag?: string;
  totalJobs: string | number;
  currencyName?: string;
  currencyValue?: string;
}

interface TopCountriesHiringProps {
  className?: string;
  limit?: number;
}

const TopCountriesHiring: React.FC<TopCountriesHiringProps> = ({ className = "", limit = 12 }) => {
  const [countries, setCountries] = useState<TopCountryHiring[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<TopCountryHiring[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'jobCount' | 'name' | 'currency'>('jobCount');
  const router = useRouter();

  // Fetch top countries hiring data
  const fetchTopCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://backend.overseas.ai/api/country-list-for-jobs');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.countries && Array.isArray(data.countries)) {
        // Sort by total jobs initially (descending)
        const sortedCountries = data.countries.sort((a: TopCountryHiring, b: TopCountryHiring) => {
          const jobsA = parseInt(String(a.totalJobs)) || 0;
          const jobsB = parseInt(String(b.totalJobs)) || 0;
          return jobsB - jobsA;
        });
        
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries.slice(0, limit));
        toast.success('Top countries data loaded successfully!');
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch countries data';
      setError(errorMessage);
      toast.error(errorMessage);
      } finally {
      setLoading(false);
    }
  }, [limit]);

  // Handle search and filtering
  useEffect(() => {
    let result = [...countries];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.name_hi?.includes(searchTerm) ||
        country.name_bn?.includes(searchTerm)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'jobCount':
          return (parseInt(String(b.totalJobs)) || 0) - (parseInt(String(a.totalJobs)) || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'currency':
          return (parseFloat(b.currencyValue || '0') - parseFloat(a.currencyValue || '0'));
        default:
          return 0;
      }
    });

    setFilteredCountries(result.slice(0, limit));
  }, [countries, searchTerm, sortBy, limit]);

  // Handle country click
  const handleCountryClick = useCallback((country: TopCountryHiring) => {
    try {
      const countrySlug = country.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/jobs?country=${encodeURIComponent(country.name)}`);
      toast.success(`Exploring jobs in ${country.name}`);
    } catch (error) {
      toast.error('Unable to navigate to jobs page');
    }
  }, [router]);

  // Get trend indicator based on job count
  const getTrendIndicator = (jobCount: string | number) => {
    const count = parseInt(String(jobCount)) || 0;
    if (count >= 10) return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-blue-100', label: 'High Demand' };
    if (count >= 5) return { icon: Building, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Growing' };
    return { icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Available' };
  };

  // Calculate total statistics
  const totalJobs = countries.reduce((sum, country) => sum + (parseInt(String(country.totalJobs)) || 0), 0);
  const activeCountries = countries.filter(country => parseInt(String(country.totalJobs)) > 0).length;

  useEffect(() => {
    fetchTopCountries();
  }, [fetchTopCountries]);

  if (loading) {
    return (
      <section className={`py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 21.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Countries</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchTopCountries}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Naukri.com Style */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            Global Opportunities
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Top Countries Hiring <span className="text-blue-600">Now</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the best international job opportunities. Start your global career journey today.
          </p>
        </div>

        {/* Statistics Bar  */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalJobs}+</div>
              <div className="text-sm text-gray-600">Total Jobs Available</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{activeCountries}</div>
              <div className="text-sm text-gray-600">Active Countries</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{countries.length}</div>
              <div className="text-sm text-gray-600">Total Destinations</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50k+</div>
              <div className="text-sm text-gray-600">Jobs Applied</div>
            </div>
          </div>
        </div> */}

        {/* Search and Filter Controls */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'jobCount' | 'name' | 'currency')}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="jobCount">Sort by Jobs</option>
                  <option value="name">Sort by Name</option>
                  <option value="currency">Sort by Currency Value</option>
                </select>
              </div>
              <button
                onClick={fetchTopCountries}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div> */}

        {/* Countries Grid  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredCountries.map((country) => {
            const trend = getTrendIndicator(country.totalJobs);
            const TrendIcon = trend.icon;
            
            return (
              <div
                key={country.id}
                onClick={() => handleCountryClick(country)}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                {/* Header with Flag and Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {country.countryFlag ? (
                        <img
                          src={`https://backend.overseas.ai/storage/uploads/countryFlag/${country.countryFlag}`}
                          alt={country.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                      ) : (
                        <MapPin className="w-6 h-6 text-gray-400" />
                      )}
                      <MapPin className="w-6 h-6 text-gray-400" style={{ display: 'none' }} />
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${trend.bg} ${trend.color}`}>
                    <TrendIcon className="w-3 h-3 inline mr-1" />
                    {trend.label}
                  </div>
                </div>

                {/* Country Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {country.name}
                </h3>

                {/* Job Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      Available Jobs:
                    </span>
                    <span className="font-bold text-blue-600 text-lg">
                      {parseInt(String(country.totalJobs)) || 0}+
                    </span>
                  </div>

                  {country.currencyName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Currency:</span>
                      <span className="font-medium text-gray-900">
                        {country.currencyName} ({parseFloat(country.currencyValue || '0').toFixed(2)})
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700 flex items-center">
                      Explore Jobs
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/jobs')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Countries & Jobs
          </button>
        </div>

        {/* No Results State */}
        {filteredCountries.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Countries Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSortBy('jobCount');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopCountriesHiring;
