"use client";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { getHraList } from "../../../services/hra.service";
import { Star, Users, ExternalLink, Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/select";

interface Company {
  id: number;
  cmpName: string;
  cmpWorkingFrom?: string;
  cmpRating?: number;
  cmpWebsiteLink?: string;
  cmpDescription?: string;
  cmpLogoS3?: string;
}

export default function Companies() {
  const router = useRouter();
  const [hraList, setHraList] = useState<Company[]>([]);
  const [filteredArray, setFilteredArray] = useState<Company[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const [sortName, setSortName] = useState<string>("");
  const [sortSince, setSortSince] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const employerRegisterRef = useRef<HTMLDivElement>(null);

  const getHraListFunc = async () => {
    try {
      const response = await getHraList();


      // Check different possible response structures
      let companyData = [];

      if (response?.cmpData && Array.isArray(response.cmpData)) {
        companyData = response.cmpData;
      } else if (response?.data && Array.isArray(response.data)) {
        companyData = response.data;
      } else if (Array.isArray(response)) {
        companyData = response;
      } else {
        // Try to find any array in the response
        for (const [key, value] of Object.entries(response || {})) {
          if (Array.isArray(value) && value.length > 0 && value[0]?.cmpName) {
            companyData = value;
            break;
          }
        }
      }

      if (companyData.length > 0) {
        setHraList(companyData);
        setFilteredArray(companyData);
      } else {
        setHraList([]);
        setFilteredArray([]);
      }

    } catch (error) {
      // Set empty arrays on error
      setHraList([]);
      setFilteredArray([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHraListFunc();
  }, []);

  // Debounce search for better UX
  useEffect(() => {
    const id = setTimeout(() => {
      searchResultFunc(searchKey);
    }, 250);
    return () => clearTimeout(id);
  }, [searchKey]);

  const renderStars = (numRatings?: number) => {
    const stars = [] as React.ReactElement[];
    const count = Math.max(0, Math.min(5, Math.floor(Number(numRatings) || 0)));
    for (let i = 0; i < count; i++) {
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
    setSortName(order);
    if (order === "asc") {
      setFilteredArray(
        [...filteredArray].sort((a, b) => a.cmpName.localeCompare(b.cmpName))
      );
    } else if (order === "desc") {
      setFilteredArray(
        [...filteredArray].sort((a, b) => b.cmpName.localeCompare(a.cmpName))
      );
    } else if (order === "none") {
      setFilteredArray(hraList);
    }
  };

  const sinceSort = (order: string) => {
    setSortSince(order);
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
    } else if (order === "none") {
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

  const getCompanyLogo = (logoUrl?: string) => {
    if (!logoUrl || logoUrl === "placeholder/logo.png") {
      return "https://overseasdata.s3.ap-south-1.amazonaws.com/Company/6/logo.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWDCXZNCOULZNVOK6%2F20240924%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240924T122145Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=b2c7fd5bebe879e2a5c5140c9024b9004379aae58f729d3cda60539085e84edc";
    }
    return logoUrl;
  };

  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="h-24 w-24 bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-10">
        {/* Hero */}
        <div className="rounded-2xl p-8 md:p-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Companies that hire from us</h1>
              <p className="mt-2 text-blue-100">Discover trusted global employers actively hiring talented candidates.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm opacity-90 bg-white/10 px-4 py-2 rounded-full">
                {filteredArray.length} companies
              </div>
              <Button
                variant="outline"
                onClick={handleScrollToRegister}
                className="bg-white text-blue-700 hover:bg-blue-50 border-0"
              >
                <Users className="w-4 h-4 mr-2" /> Register as HRA
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Input
              placeholder="Search companies by name"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Select onValueChange={(v) => sortByName(v)} value={sortName || undefined}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="asc">Name: A to Z</SelectItem>
              <SelectItem value="desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => sinceSort(v)} value={sortSince || undefined}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by since" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="asc">Oldest to Newest</SelectItem>
              <SelectItem value="desc">Newest to Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <SkeletonCard />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArray.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No companies found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {searchKey ? `No companies match "${searchKey}". Try adjusting your search terms.` : "No companies are currently available. Please check back later."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => { setSearchKey(""); setFilteredArray(hraList); setSortName(""); setSortSince(""); }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Reset Filters
              </Button>
              {searchKey && (
                <Button
                  variant="outline"
                  onClick={() => setSearchKey("")}
                  className="border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {filteredArray.map((company, index) => (
              <Card
                key={company.id || index}
                className="group bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-[1.02]"
                onClick={() => router.push(`/company-details/${company.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <img
                        src={getCompanyLogo(company.cmpLogoS3)}
                        alt={`${company.cmpName} Logo`}
                        className="w-20 h-20 object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/default-company-logo.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-semibold text-gray-900 truncate">
                          {company.cmpName}
                        </h3>
                        <div className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 whitespace-nowrap">
                          Since {company.cmpWorkingFrom || "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {renderStars(company.cmpRating)}
                        {(!company.cmpRating || company.cmpRating === 0) && (
                          <span className="text-xs text-gray-400">No ratings</span>
                        )}
                      </div>
                      {company.cmpWebsiteLink && (
                        <a
                          href={company.cmpWebsiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {company.cmpDescription}
                  </p>

                  <Button
                    variant="outline"
                    className="w-full mt-4 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:text-blue-700 transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2 group-hover:text-blue-700" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Employer Register Section */}
        <div ref={employerRegisterRef} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2">
                BEST GLOBAL HIRING PLATFORM
              </h2>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
                Find the perfect candidate
              </h3>
              <p className="text-gray-600 text-lg">
                Trusted By Many Global Employers
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
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
                    <Input placeholder="+91" className="w-1/4" />
                    <Input placeholder="Phone number" className="w-3/4" />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree with overseas Terms & Conditions And The Privacy Policy
                  </label>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
