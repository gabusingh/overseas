"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { getHraList } from "../services/hra.service";
import Link from "next/link";

interface Company {
  id: number;
  cmpName: string;
  cmpLogoS3?: string;
  cmpDescription?: string;
  jobCount?: number;
}

function JobOpeningInTopCompany() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get company list from API
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await getHraList();
      console.log('Companies data:', response?.cmpData);
      
      // Take only first 4 companies for display
      const companiesData = response?.cmpData?.slice(0, 4) || [];
      setCompanies(companiesData);
      setError(null);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies');
      
      // Fallback to mock data if API fails
      const fallbackCompanies = [
        { id: 1, cmpName: "TechCorp International", cmpLogoS3: "/images/company-logo.svg", jobCount: 45 },
        { id: 2, cmpName: "Global Solutions Ltd", cmpLogoS3: "/images/company-logo.svg", jobCount: 32 },
        { id: 3, cmpName: "Innovation Hub", cmpLogoS3: "/images/company-logo.svg", jobCount: 28 },
        { id: 4, cmpName: "Digital Ventures", cmpLogoS3: "/images/company-logo.svg", jobCount: 56 }
      ];
      setCompanies(fallbackCompanies);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Job Openings In Top Companies</h2>
            <p className="text-gray-600">Loading companies...</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="shadow-sm border-0 h-full animate-pulse">
                <CardContent className="flex items-center p-6">
                  <div className="w-[60px] h-[60px] bg-gray-200 rounded mr-4 flex-shrink-0"></div>
                  <div className="flex-grow">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20 ml-4"></div>
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
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Job Openings In Top Companies</h2>
          <p className="text-gray-600">Discover opportunities with leading global employers</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {companies.map((company, i) => (
            <Card key={company.id} className="shadow-sm border-0 h-full">
              <CardContent className="flex items-center p-6">
                <Image
                  src={
                    company.cmpLogoS3 === "placeholder/logo.png" || !company.cmpLogoS3
                      ? "/images/company-logo.svg"
                      : company.cmpLogoS3
                  }
                  alt={company.cmpName}
                  width={60}
                  height={60}
                  className="rounded mr-4 flex-shrink-0"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/company-logo.svg";
                  }}
                />
                <div className="flex-grow">
                  <h5 className="text-lg font-semibold text-blue-600 mb-1" style={{ height: "auto", minHeight: "24px" }}>
                    {company.cmpName}
                  </h5>
                  <p className="text-gray-600 text-sm">
                    {company.jobCount || "Multiple"} Open Positions
                  </p>
                </div>
                <Link href="/companies" className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors ml-4 inline-block text-center no-underline">
                  View Jobs
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Show View All button if we have companies */}
        {companies.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/companies" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block no-underline">
              View All Companies
            </Link>
          </div>
        )}
        
        {/* Show empty state if no companies and not loading */}
        {companies.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No companies available at the moment.</p>
            <button onClick={fetchCompanies} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default JobOpeningInTopCompany;
