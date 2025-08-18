"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { getHraList } from "../../../services/hra.service";
import { Star, Users, ExternalLink, Building } from "lucide-react";

interface Company {
  id: number;
  cmpName: string;
  cmpWorkingFrom: string;
  cmpRating: number;
  cmpWebsiteLink: string;
  cmpDescription: string;
  cmpLogoS3: string;
}

export default function Companies() {
  const router = useRouter();
  const [hraList, setHraList] = useState<Company[]>([]);
  const [filteredArray, setFilteredArray] = useState<Company[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const employerRegisterRef = useRef<HTMLDivElement>(null);

  const getHraListFunc = async () => {
    try {
      const response = await getHraList();
      setHraList(response?.data?.cmpData || []);
      setFilteredArray(response?.data?.cmpData || []);
    } catch (error) {
      console.error("Error fetching HRA list:", error);
    }
  };

  useEffect(() => {
    getHraListFunc();
  }, []);

  const renderStars = (numRatings: number) => {
    const stars = [];
    for (let i = 0; i < numRatings; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    return stars;
  };

  const searchResultFunc = (key: string) => {
    if (key.length !== 0) {
      setFilteredArray(
        hraList.filter((item) =>
          item?.cmpName.toLowerCase().includes(key.toLowerCase())
        )
      );
    } else {
      setFilteredArray(hraList);
    }
  };

  const sortByName = (order: string) => {
    if (order === "asc") {
      setFilteredArray(
        [...filteredArray].sort((a, b) => a.cmpName.localeCompare(b.cmpName))
      );
    } else if (order === "desc") {
      setFilteredArray(
        [...filteredArray].sort((a, b) => b.cmpName.localeCompare(a.cmpName))
      );
    }
  };

  const sinceSort = (order: string) => {
    if (order === "asc") {
      setFilteredArray(
        [...filteredArray].sort((a, b) => {
          const workingFromA = a.cmpWorkingFrom || "0000-00-00";
          const workingFromB = b.cmpWorkingFrom || "0000-00-00";
          return workingFromA.localeCompare(workingFromB);
        })
      );
    } else if (order === "desc") {
      setFilteredArray(
        [...filteredArray].sort((a, b) => {
          const workingFromA = a.cmpWorkingFrom || "0000-00-00";
          const workingFromB = b.cmpWorkingFrom || "0000-00-00";
          return workingFromB.localeCompare(workingFromA);
        })
      );
    } else {
      setFilteredArray(hraList);
    }
  };

  const handleScrollToRegister = () => {
    if (employerRegisterRef.current) {
      const offsetTop =
        employerRegisterRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        200;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  const getCompanyLogo = (logoUrl: string) => {
    if (logoUrl === "placeholder/logo.png") {
      return "https://overseasdata.s3.ap-south-1.amazonaws.com/Company/6/logo.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWDCXZNCOULZNVOK6%2F20240924%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240924T122145Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=b2c7fd5bebe879e2a5c5140c9024b9004379aae58f729d3cda60539085e84edc";
    }
    return logoUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4 md:mb-0">
            COMPANIES THAT HIRE FROM US
          </h1>
          <Button 
            variant="outline" 
            onClick={handleScrollToRegister}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Register As HRA
          </Button>
        </div>

        {/* Search and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-1">
            <Input
              placeholder="Search By Name"
              value={searchKey}
              onChange={(e) => {
                searchResultFunc(e.target.value);
                setSearchKey(e.target.value);
              }}
              className="w-full"
            />
          </div>
          <div>
            <select
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
              onChange={(e) => sortByName(e.target.value)}
            >
              <option value="">Sort By Name</option>
              <option value="asc">Name: A to Z</option>
              <option value="desc">Name: Z to A</option>
            </select>
          </div>
          <div>
            <select
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
              onChange={(e) => sinceSort(e.target.value)}
            >
              <option value="">Since</option>
              <option value="asc">Oldest to Newest</option>
              <option value="desc">Newest to Oldest</option>
            </select>
          </div>
        </div>

        {/* Company List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredArray?.map((company, index) => (
            <Card 
              key={company.id || index} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/company-details/${company.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <img
                      src={getCompanyLogo(company.cmpLogoS3)}
                      alt={`${company.cmpName} Logo`}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/default-company-logo.png";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {company.cmpName}
                    </h3>
                    <p className="text-gray-600 mb-2">Since {company.cmpWorkingFrom}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(company.cmpRating)}
                    </div>
                    {company.cmpWebsiteLink && (
                      <a
                        href={company.cmpWebsiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {company.cmpDescription?.substring(0, 200)}
                    {company.cmpDescription?.length > 200 && "..."}
                  </p>
                </div>
                
                <Button variant="outline" className="w-full">
                  View More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Employer Register Section */}
        <div ref={employerRegisterRef} className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                BEST GLOBAL HIRING PLATFORM
              </h2>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Find the perfect candidate
              </h3>
              <p className="text-gray-600 text-lg">
                Trusted By Many Global Employers
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h4 className="text-xl font-semibold">Employer Register</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Office
                  </label>
                  <Input placeholder="Enter company name" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Official Phone Number
                  </label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="+91" 
                      className="w-1/4"
                    />
                    <Input 
                      placeholder="Phone number" 
                      className="w-3/4"
                    />
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="terms"
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree with overseas Terms & Conditions And The Privacy Policy
                  </label>
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Sign Up
                </Button>
                
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
