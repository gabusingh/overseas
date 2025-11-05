"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "./ui/card";
import { getNewsFeedData } from "../services/info.service";

interface NewsItem {
  id?: number;
  title: string;
  excerpt?: string;
  description?: string;
  image?: string;
  date?: string;
  created_at?: string;
  news_image?: string;
  news_title?: string;
  news_description?: string;
}

function NewsSlider() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get news feed from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getNewsFeedData();
      
      // Process the news data and take first 4 items
      const newsData = (response?.data?.newsData || response?.data || []).slice(0, 4).map((item: any) => ({
        id: item.id,
        title: item.news_title || item.title,
        excerpt: item.news_description || item.description || item.excerpt,
        image: item.news_image || item.image || `/images/news${Math.floor(Math.random() * 4) + 1}.svg`,
        date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : item.date
      })) || [];
      
      setNews(newsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching news feed:', error);
      setError('Failed to load news');
      
      // Fallback to mock data if API fails
      const fallbackNews = [
        {
          title: "New Job Opportunities in Singapore Tech Sector",
          excerpt: "Singapore continues to be a hub for technology professionals with 500+ new openings...",
          image: "/images/news1.svg",
          date: "Dec 10, 2024"
        },
        {
          title: "UAE Healthcare Sector Hiring International Nurses",
          excerpt: "The UAE healthcare system is actively recruiting qualified international nurses...",
          image: "/images/news2.svg",
          date: "Dec 8, 2024"
        },
        {
          title: "Canada Express Entry Program Updates",
          excerpt: "Latest changes to Canada's Express Entry system for skilled workers...",
          image: "/images/news3.svg",
          date: "Dec 5, 2024"
        },
        {
          title: "Australia Skills Shortage Creates Opportunities",
          excerpt: "Australia faces skills shortage in multiple sectors, creating opportunities for overseas workers...",
          image: "/images/news4.svg",
          date: "Dec 3, 2024"
        }
      ];
      setNews(fallbackNews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Latest News & Updates</h2>
            <p className="text-gray-600">Loading latest news...</p>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="shadow-sm border-0 h-full flex flex-col animate-pulse">
                <CardHeader className="p-0">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                </CardHeader>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="mb-3">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
                  <div className="flex-grow mb-4">
                    <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24 mt-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Latest News & Updates</h2>
          <p className="text-gray-600">Stay updated with the latest overseas job market trends</p>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {news.map((item, i) => (
            <Card key={i} className="shadow-sm border-0 h-full flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={item.image || "/images/news1.svg"}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <small className="text-gray-500 text-sm">{item.date}</small>
                </div>
                <h6 className="text-lg font-semibold text-blue-600 mb-3">{item.title}</h6>
                <p className="text-gray-600 text-sm flex-grow mb-4">
                  {item.excerpt}
                </p>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-600 hover:text-white transition-colors mt-auto">
                  Read More
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Show View All button if we have news */}
        {news.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View All News
            </button>
          </div>
        )}
        
        {/* Show empty state if no news and not loading */}
        {news.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No news available at the moment.</p>
            <button onClick={fetchNews} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default NewsSlider;
