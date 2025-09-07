"use client";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getOccupations, getCountriesForJobs, getNewsFeedData, getSuccessNotification } from '../../services/info.service';
import { getInstitutes } from '../../services/institute.service';
import { getHraList } from '../../services/hra.service';
import { toast } from 'sonner';

// Lazy load heavy components
const HeroSection = dynamic(() => import('../../components/HeroSection'), {
  ssr: true, // Keep SSR for hero section as it's above the fold
  loading: () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          <div className="h-16 bg-blue-200 rounded-lg mb-4 mx-auto w-3/4"></div>
          <div className="h-8 bg-blue-100 rounded-lg mb-8 mx-auto w-1/2"></div>
          <div className="h-20 bg-white rounded-lg mx-auto max-w-2xl"></div>
        </div>
      </div>
    </div>
  )
});
const TopCountriesHiring = dynamic(() => import('../../components/TopCountriesHiring'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-pulse rounded-lg"></div>
});

const FindJobsByDepartment = dynamic(() => import('../../components/FindJobsByDepartment'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-pulse rounded-lg"></div>
});

interface Department {
  id: number;
  title: string;
  name: string;
  label: string;
  value: number;
  img: string;
}

interface Country {
  id: number;
  name: string;
  countryFlag?: string;
}

interface Company {
  id: number;
  cmpName: string;
  cmpLogoS3?: string;
  cmpDescription?: string;
}

interface Institute {
  id: number;
  instituteName: string;
  profileImageUrl?: string;
}

interface NewsItem {
  id: number;
  news_title: string;
  news_description: string;
  image?: string;
  created_at: string;
  link?: string;
}

// Loading component
const LoadingSkeleton = () => (
  <div className="min-h-screen animate-pulse bg-gray-50">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-96 mb-8"></div>
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [instituteList, setInstituteList] = useState<Institute[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [successStories, setSuccessStories] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalNews, setModalNews] = useState<NewsItem | null>(null);

  // Cache key for localStorage
  const CACHE_KEY = 'overseas_home_data';
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  // Check cache first
  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      }
    return null;
  }, []);

  // Cache data to localStorage
  const setCachedData = useCallback((data: unknown) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      }
  }, []);

  // Fetch critical data first (Hero section needs)
  const fetchCriticalData = useCallback(async () => {
    try {
      const cachedData = getCachedData();
      if (cachedData && typeof cachedData === 'object') {
        // Use cached data immediately
        setDepartmentList((cachedData as any).occupations || []);
        setCountryList((cachedData as any).countries || []);
        setLoading(false);
        toast.success('Loaded from cache!');
        return;
      }

      // Fetch only critical data for initial render
      const [occupationsRes, countriesRes] = await Promise.all([
        getOccupations(),
        getCountriesForJobs()
      ]);

      const occupations = occupationsRes?.data?.map((item: any) => ({
        id: item.id,
        title: item.title || item.name || item.occupation,
        name: item.title || item.name || item.occupation,
        label: item.title || item.name || item.occupation,
        value: item.id,
        img: `/images/institute.png`,
      })) || [];
      
      setDepartmentList(occupations);
      setCountryList(countriesRes?.data || []);
      setLoading(false);

      // Cache the critical data
      setCachedData({ occupations, countries: countriesRes?.data || [] });
      
    } catch (error) {
      toast.error('Failed to load essential data. Please refresh.');
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  // Fetch non-critical data in background
  const fetchSecondaryData = useCallback(async () => {
    try {
      // Stagger secondary data loading
      setTimeout(async () => {
        const [companiesRes, institutesRes] = await Promise.all([
          getHraList(),
          getInstitutes()
        ]);
        
        setCompanyList(companiesRes?.cmpData || []);
        setInstituteList(institutesRes?.data || []);
      }, 100);

      // Load news and success stories even later
      setTimeout(async () => {
        const [newsRes, successRes] = await Promise.all([
          getNewsFeedData(),
          getSuccessNotification()
        ]);
        
        setNewsList(newsRes?.data?.newsData?.slice(0, 6) || []);
        setSuccessStories(successRes?.notifications?.slice(0, 8) || []);
      }, 500);
      
    } catch (error) {
      // Don't show error toast for non-critical data
    }
  }, []);

  // Main fetch function that orchestrates progressive loading
  const fetchData = useCallback(async () => {
    await fetchCriticalData();
    fetchSecondaryData();
  }, [fetchCriticalData, fetchSecondaryData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      
      {/* Optimized Hero Section */}
      <HeroSection data={departmentList} countryData={countryList} />

      {/* Top Countries Hiring Now - New Component */}
  <TopCountriesHiring limit={4} />

      {/* Find Jobs by Department Section */}
      <FindJobsByDepartment limit={12} showViewAll={true} />

      {/* Top Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Companies Hiring</h2>
            <p className="text-gray-600">Join leading companies from around the world</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {companyList.slice(0, 8).map((company) => (
              <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center relative">
                    {company.cmpLogoS3 && company.cmpLogoS3 !== "placeholder/logo.png" ? (
                      <>
                        <Image 
                          src={company.cmpLogoS3}
                          alt={company.cmpName}
                          width={48}
                          height={48}
                          className="object-contain"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo="
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <i className="fa fa-building text-2xl text-gray-400 hidden"></i>
                      </>
                    ) : (
                      <i className="fa fa-building text-2xl text-gray-400"></i>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">{company.cmpName}</h3>
                  <p className="text-sm text-gray-500 mb-4">Multiple openings</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Jobs →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold">
              View All Companies
            </button>
          </div>
        </div>
      </section>

      {/* Training Institutes */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Skill Up with Top Institutes</h2>
            <p className="text-gray-600">Get certified and increase your chances of getting hired abroad</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instituteList.slice(0, 6).map((institute) => (
              <div key={institute.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fa fa-graduation-cap text-blue-600"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{institute.instituteName}</h3>
                    <p className="text-sm text-gray-600 mb-3">Professional certification programs</p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600">Real people, real success stories from around the world</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successStories.slice(0, 4).map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fa fa-check-circle text-2xl text-green-600"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Success Story</h3>
                  <p className="text-sm text-gray-600">Another professional found their dream job abroad</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* News & Resources */}
      {newsList.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Latest News & Resources</h2>
              <p className="text-sm text-gray-700">Stay updated with the latest trends in overseas employment</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {newsList.map((news) => (
                <article
                  key={news.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden border border-blue-100"
                >
                  {/* News image removed as per request */}
                  <div className="flex-1 flex flex-col p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">{news.news_title}</h3>
                    <p className="text-gray-700 text-base mb-4 line-clamp-3">{news.news_description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-400">{new Date(news.created_at).toLocaleDateString()}</span>
                      {/* If news has a link, redirect. Otherwise, open modal with full description. */}
                      {news.link ? (
                        <a
                          href={news.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                        >
                          Read More →
                        </a>
                      ) : (
                        <button
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                          onClick={() => setModalNews(news)}
                        >
                          Read More →
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          {/* News Modal */}
          {modalNews && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl"
                  onClick={() => setModalNews(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                {/* News image removed as per request */}
                <h3 className="font-bold text-2xl text-blue-900 mb-2">{modalNews.news_title}</h3>
                <p className="text-gray-700 text-base mb-4 whitespace-pre-line">{modalNews.news_description}</p>
                <div className="text-xs text-gray-400 mb-2">{new Date(modalNews.created_at).toLocaleDateString()}</div>
                <button
                  className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={() => setModalNews(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Global Career?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who have successfully found their dream jobs abroad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/candidate-register')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Free Profile
            </button>
            <button 
              onClick={() => router.push('/jobs')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse All Jobs
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
