"use client";
import React, { useEffect, useState, Suspense, useCallback } from "react";
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { getOccupations, getCountriesForJobs, getNewsFeedData, getSuccessNotification } from '../../services/info.service';
import { getInstitutes } from '../../services/institute.service';
import { getAllCompanies } from '../../services/hra.service';
import { toast } from 'sonner';
import HeroSection from '../../components/HeroSection';
import TopCountriesHiring from '../../components/TopCountriesHiring';
import FindJobsByDepartment from '../../components/FindJobsByDepartment';

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
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [instituteList, setInstituteList] = useState<Institute[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [occupationsRes, countriesRes, companiesRes, institutesRes, newsRes, successRes] = await Promise.all([
        getOccupations(),
        getCountriesForJobs(),
        getAllCompanies(),
        getInstitutes(),
        getNewsFeedData(),
        getSuccessNotification()
      ]);

      // Set occupations/departments
      const occupations = occupationsRes?.data?.map((item: any) => ({
        id: item.id,
        title: item.title || item.name || item.occupation,
        name: item.title || item.name || item.occupation,
        label: item.title || item.name || item.occupation,
        value: item.id,
        img: `/images/institute.png`,
      })) || [];
      setDepartmentList(occupations);

      // Set countries
      setCountryList(countriesRes?.data || []);

      // Set companies
      setCompanyList(companiesRes?.cmpData || []);

      // Set institutes
      setInstituteList(institutesRes?.data || []);

      // Set news
      setNewsList(newsRes?.data?.newsData?.slice(0, 6) || []);

      // Set success stories
      setSuccessStories(successRes?.notifications?.slice(0, 8) || []);

      toast.success('Home page loaded successfully!');
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Some features may not work properly. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);


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
      <TopCountriesHiring limit={12} />

      {/* Find Jobs by Department Section */}
      <FindJobsByDepartment limit={12} showViewAll={true} />

      {/* Top Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Companies Hiring</h2>
            <p className="text-gray-600">Join leading companies from around the world</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {companyList.slice(0, 8).map((company) => (
              <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    {company.cmpLogoS3 && company.cmpLogoS3 !== "placeholder/logo.png" ? (
                      <img 
                        src={company.cmpLogoS3}
                        alt={company.cmpName}
                        className="w-12 h-12 object-contain"
                      />
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600">Real people, real success stories from around the world</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successStories.slice(0, 4).map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fa fa-check-circle text-2xl text-green-600"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Success Story</h3>
                  <p className="text-sm text-gray-600">Another professional found their dream job abroad</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Resources */}
      {newsList.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News & Insights</h2>
              <p className="text-gray-600">Stay updated with the latest trends in overseas employment</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsList.map((news) => (
                <article key={news.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{news.news_title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.news_description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{new Date(news.created_at).toLocaleDateString()}</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Read More →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
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
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Create Free Profile
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Browse All Jobs
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
