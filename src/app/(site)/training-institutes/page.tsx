"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";

interface Institute {
  id: number | string;
  name: string;
  location?: string;
  description?: string;
  courses?: string[];
}

export default function TrainingInstitutesPage() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitutes = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        
        const res = await fetch('https://backend.overseas.ai/api/list-training-institute', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: 'no-store',
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch training institutes: ${res.status}`);
        }
        
        const data = await res.json();
        
        // The API returns {msg, data: [array of institutes]}
        const list = data?.data || [];
        
        const mapped: Institute[] = list.map((item: any) => {
          // Extract location from address
          const address = item.insAddress || 'Address not available';
          const location = address.length > 80 ? 
            address.substring(0, 80) + '...' : address;
          
          return {
            id: item.id,
            name: item.instituteName || 'Training Institute',
            location: location,
            description: `Established: ${item.insSince || 'N/A'} | Affiliated: ${item.affilatedBy || 'N/A'} | Registration: ${item.insRegNo || 'N/A'}`,
            courses: [`${item.course_count || '0'} courses available`], // Will be enhanced later
          };
        });
        
        setInstitutes(mapped);
      } catch (err: any) {
        console.error('Error fetching training institutes:', err);
        setError(err.message || 'Failed to load training institutes');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
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
              Training Institutes
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
              Discover certified training institutes for overseas career opportunities
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading training institutes...</p>
        </div>
      )}
      
      {error && !loading && (
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Institutes</h3>
          <p className="text-red-600 mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bgBlue text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && institutes.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-3">🏫</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Institutes Found</h3>
          <p className="text-gray-600">Currently there are no training institutes available.</p>
        </div>
      )}
      
      {!loading && !error && institutes.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">Found {institutes.length} training institutes</p>
              <p className="text-sm text-gray-500">Discover certified training institutes for overseas career opportunities</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutes.map((institute, index) => (
              <motion.div
                key={institute.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer h-full border border-gray-100">
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex gap-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bgBlue rounded-lg flex items-center justify-center">
                          <i className="fa fa-university text-white text-sm"></i>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                          {institute.name}
                        </h3>
                        {institute.location && (
                          <p className="text-sm text-gray-600 line-clamp-2 flex items-center">
                            <i className="fa fa-map-marker mr-1 text-gray-400"></i>
                            {institute.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {institute.description && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 line-clamp-3">{institute.description}</p>
                      </div>
                    )}
                    
                    {institute.courses && institute.courses.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Available</p>
                        <div className="flex flex-wrap gap-1">
                          {institute.courses.slice(0, 2).map((course, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                          {institute.courses.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{institute.courses.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-grow"></div>
                    <Link
                      href={`/institute-details/${institute.id}`}
                      className="inline-flex items-center justify-center w-full px-3 py-2 bgBlue hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                    >
                      <i className="fa fa-eye mr-2"></i>
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
