"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";

interface Center {
  id: number | string;
  name: string;
  address?: string;
  phone?: string;
  availableTests?: string[];
  city?: string;
}

export default function TradeTestCenterPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        
        const res = await fetch('https://backend.overseas.ai/api/list-trade-center', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: 'no-store',
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch trade test centers: ${res.status}`);
        }
        
        const data = await res.json();
        
        // The API returns {msg, data: [array of centers]}
        const list = data?.data || [];
        
        const mapped: Center[] = list.map((item: any) => {
          // Extract city from address
          const address = item.insAddress || 'Address not available';
          const addressParts = address.split(',');
          const city = addressParts.length > 1 ? 
            addressParts[addressParts.length - 2]?.trim() || 'India' : 'India';
          
          return {
            id: item.id,
            name: item.instituteName || 'Trade Test Center',
            address: address.length > 80 ? address.substring(0, 80) + '...' : address,
            phone: item.phone || 'Contact not available',
            city: city,
            availableTests: [`${item.test_count || '0'} tests available`], // Will show actual test count
          };
        });
        
        setCenters(mapped);
      } catch (err: any) {
        setError(err.message || 'Failed to load trade test centers');
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bgBlue py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              Trade Test Centers
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
              Find authorized trade test centers near you for professional skill certification
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-full">

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading trade test centers...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="text-center py-8">
              <div className="text-red-500 text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Centers</h3>
              <p className="text-red-600 mb-3">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bgBlue text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!loading && !error && centers.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">🏢</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Test Centers Found</h3>
              <p className="text-gray-600">Currently there are no trade test centers available.</p>
            </div>
          )}
          
          {!loading && !error && centers.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600">Found {centers.length} authorized trade test centers</p>
                  <p className="text-sm text-gray-500">Professional trade testing and certification services</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {centers.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer h-full border border-gray-100 flex flex-col">
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="flex gap-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bgBlue rounded-lg flex items-center justify-center">
                          <i className="fa fa-certificate text-white text-sm"></i>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                          {center.name}
                        </h3>
                        {center.city && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <i className="fa fa-map-marker-alt mr-1 text-gray-400"></i>
                            {center.city}
                          </p>
                        )}
                      </div>
                    </div>

                    {center.address && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{center.address}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-2 mb-3 flex-grow">
                      {center.phone && (
                        <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-500">Contact</span>
                          <span className="text-sm text-gray-700 flex items-center">
                            <i className="fa fa-phone mr-1 text-gray-400"></i>
                            <span className="truncate">{center.phone}</span>
                          </span>
                        </div>
                      )}
                      {center.availableTests && center.availableTests.length > 0 && (
                        <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-500">Tests</span>
                          <Badge variant="secondary" className="text-xs">
                            {center.availableTests[0]}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <Link
                        href={`/trade-test-center-details/${center.id}`}
                        className="inline-flex items-center justify-center w-full px-3 py-2 bgBlue hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                      >
                        <i className="fa fa-eye mr-2"></i>
                        View Details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
                ))}
              </div>
            </>
          )}
        
          <div className="mt-8 p-6 rounded-lg lightBlueBg">
            <h4 className="textBlue mb-4 text-lg font-semibold">How to Book a Test</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ol className="space-y-3">
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-semibold">1</span>
                    <span className="text-sm">Select your nearest test center</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-semibold">2</span>
                    <span className="text-sm">Choose your trade skill</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-semibold">3</span>
                    <span className="text-sm">Book your preferred date</span>
                  </li>
                </ol>
              </div>
              <div>
                <ol className="space-y-3">
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-semibold">4</span>
                    <span className="text-sm">Pay the test fee</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-semibold">5</span>
                    <span className="text-sm">Receive confirmation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-semibold">6</span>
                    <span className="text-sm">Attend the test</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        
          <div className="text-center mt-8">
           {/*  <button className="downloadButton mr-4">
              Find Test Center
            </button>
            <button className="border textBlue border-blue-600 px-6 py-2 rounded-full hover:lightBlueBg transition-colors">
              Book Test Online
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
