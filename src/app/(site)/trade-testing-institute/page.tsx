"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { motion } from "framer-motion";

interface TradeTest {
  id: number | string;
  name: string;
  category?: string;
  description?: string;
  duration?: string;
}

export default function TradeTestingInstitutePage() {
  const router = useRouter();
  const [tests, setTests] = useState<TradeTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        
        const res = await fetch('https://backend.overseas.ai/api/list-all-trade-test', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: 'no-store',
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch trade tests: ${res.status}`);
        }
        
        const data = await res.json();
        
        // The API returns {msg, data: [array of tests]}
        const list = data?.data || [];
        
        const mapped: TradeTest[] = list.map((item: any) => {
          // Determine category from course name
          const courseName = item.course_name || 'Trade Test';
          let category = 'General';
          
          if (courseName.toLowerCase().includes('electrical') || 
              courseName.toLowerCase().includes('electrician')) {
            category = 'Electrical';
          } else if (courseName.toLowerCase().includes('weld')) {
            category = 'Welding';
          } else if (courseName.toLowerCase().includes('mechanic') || 
                     courseName.toLowerCase().includes('automotive')) {
            category = 'Automotive';
          } else if (courseName.toLowerCase().includes('construction') || 
                     courseName.toLowerCase().includes('carpenter') ||
                     courseName.toLowerCase().includes('plumb')) {
            category = 'Construction';
          } else if (courseName.toLowerCase().includes('hvac') ||
                     courseName.toLowerCase().includes('heating')) {
            category = 'HVAC';
          }
          
          return {
            id: item.id,
            name: courseName,
            category: category,
            description: `Duration: ${item.course_duration || 'N/A'} | Fee: ₹${item.course_fee || 'N/A'} | Seats: ${item.total_seats || 'N/A'} | Institute: ${item.institute_details?.instituteName || 'N/A'}`,
            duration: item.course_duration || 'Duration not specified',
          };
        });
        
        setTests(mapped);
      } catch (err: any) {
        console.error('Error fetching trade tests:', err);
        setError(err.message || 'Failed to load trade tests');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleScheduleTest = async (testId: number | string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      if (!token) {
        toast.warning('Please login to schedule a test');
        // Pass the intended destination as redirect parameter
        const redirectUrl = encodeURIComponent('/trade-test-center');
        router.push(`/login?redirect=${redirectUrl}&message=${encodeURIComponent('Please login to schedule your test')}`);
        return;
      }

      // Find the test details
      const test = tests.find(t => t.id === testId);
      if (!test) {
        toast.error('Test not found');
        return;
      }

      toast.success(`Scheduling test: ${test.name}`);
      
      // Navigate to trade test center to view available centers for scheduling
      router.push('/trade-test-center');
      
    } catch (error) {
      console.error('Error scheduling test:', error);
      toast.error('Failed to schedule test. Please try again.');
    }
  };

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
              Trade Testing Institute
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
              Professional trade testing and certification services to validate your skills for overseas employment
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-full">

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading trade tests...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="text-center py-8">
              <div className="text-red-500 text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Tests</h3>
              <p className="text-red-600 mb-3">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bgBlue text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!loading && !error && tests.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Trade Tests Found</h3>
              <p className="text-gray-600">Currently there are no trade tests available.</p>
            </div>
          )}
          
          {!loading && !error && tests.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600">Found {tests.length} trade tests available</p>
                  <p className="text-sm text-gray-500">Professional trade skills assessment and certification</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer h-full border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex gap-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bgBlue rounded-lg flex items-center justify-center">
                          <i className="fa fa-wrench text-white text-sm"></i>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                          {test.name}
                        </h3>
                        {test.category && (
                          <Badge variant="secondary" className="w-fit text-xs">{test.category}</Badge>
                        )}
                      </div>
                    </div>

                    {test.description && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 line-clamp-3">{test.description}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-2 mb-3">
                      {test.duration && (
                        <div className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-500">Duration</span>
                          <span className="text-sm font-medium text-gray-700">{test.duration}</span>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleScheduleTest(test.id)}
                      className="inline-flex items-center justify-center w-full px-3 py-2 bgBlue hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                    >
                      <i className="fa fa-calendar mr-2"></i>
                      Schedule Test
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
            </>
          )}

          <div className="mt-8 p-6 rounded-lg lightBlueBg">
            <h4 className="textBlue mb-4 text-lg font-semibold">How It Works</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bgBlue rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <p className="text-sm">Register for Test</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bgBlue rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <p className="text-sm">Prepare & Practice</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bgBlue rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <p className="text-sm">Take the Test</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bgBlue rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <p className="text-sm">Get Certified</p>
              </div>
            </div>
          </div>
          
          {/* <div className="text-center mt-8">
            <button className="downloadButton mr-4">
              Schedule Trade Test
            </button>
            <button className="border textBlue border-blue-600 px-6 py-2 rounded-full hover:lightBlueBg transition-colors">
              View Test Centers
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
