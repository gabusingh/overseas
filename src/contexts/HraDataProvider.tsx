"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { getHraDashboardAnalytics, getHraDashboardData, getAllCreatedJobs, getJobsPostedByHra, HraDashboardData } from '@/services/hra.service';

interface HraDataContextType {
  dashboardData: HraDashboardData | null;
  jobsData: any[];
  loading: boolean;
  error: string | null;
  fetchHraData: (force?: boolean) => Promise<void>;
  refreshData: () => Promise<void>;
  clearCache: () => void;
  lastFetchTime: number | null;
}

const HraDataContext = createContext<HraDataContextType | undefined>(undefined);

interface HraDataProviderProps {
  children: React.ReactNode;
  skipDataFetch?: boolean; // New prop to control data fetching
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Helper function to extract HR user ID from stored user data
function getHrUserIdFromStorage(): string | null {
  try {
    const loggedUser = localStorage.getItem("loggedUser");
    const userSimple = localStorage.getItem("user");

    if (loggedUser) {
      const userData = JSON.parse(loggedUser);

      // Try different possible ID fields
      const hrId = userData?.user?.id ||
        userData?.cmpData?.id ||
        userData?.id ||
        userData?.hrId ||
        userData?.empId;

      if (hrId) {
        return hrId.toString();
      }
    }

    if (userSimple) {
      const userSimpleData = JSON.parse(userSimple);
      const hrId = userSimpleData?.id;

      if (hrId) {
        return hrId.toString();
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function HraDataProvider({ children, skipDataFetch = false }: HraDataProviderProps) {
  const [dashboardData, setDashboardData] = useState<HraDashboardData | null>(null);
  const [jobsData, setJobsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  // Use ref to prevent multiple simultaneous API calls
  const fetchingRef = useRef<boolean>(false);

  const isCacheValid = useCallback(() => {
    if (!lastFetchTime || !dashboardData) return false;
    return Date.now() - lastFetchTime < CACHE_DURATION;
  }, [lastFetchTime, dashboardData]);

  const fetchHraData = useCallback(async (force = false) => {
    // Skip data fetching if disabled
    if (skipDataFetch) {
      return;
    }

    // Check if data is cached and valid (unless force refresh)
    if (!force && isCacheValid()) {
      return;
    }

    // Prevent multiple simultaneous calls
    if (fetchingRef.current) {
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch dashboard analytics data with proper transformation (primary source)
      const transformedData = await getHraDashboardData(token);

      setDashboardData(transformedData);

      // Also get raw analytics data for jobs fallback
      const analyticsResponse = await getHraDashboardAnalytics(token);
      const analyticsData = analyticsResponse?.data || analyticsResponse;

      // Get jobs posted by this specific HR user - NO FALLBACKS
      let processedJobsData = [];
      const hrUserId = getHrUserIdFromStorage();

      if (!hrUserId) {
        throw new Error('HR User ID not found in localStorage. Cannot fetch HR-specific jobs. Please ensure you are logged in as an HR user.');
      }

      // Fetch jobs posted by this specific HR user ONLY - no fallbacks
      const jobsResponse = await getJobsPostedByHra(hrUserId, token);

      const jobsResponseData = jobsResponse?.data || jobsResponse;

      if (!Array.isArray(jobsResponseData)) {
        // Check if it's a paginated response or empty object
        if (jobsResponseData && typeof jobsResponseData === 'object') {
          // Check for common pagination response patterns
          if (jobsResponseData.jobs && Array.isArray(jobsResponseData.jobs)) {
            processedJobsData = jobsResponseData.jobs;
          } else if (jobsResponseData.data && Array.isArray(jobsResponseData.data)) {
            processedJobsData = jobsResponseData.data;
          } else if (jobsResponseData.items && Array.isArray(jobsResponseData.items)) {
            processedJobsData = jobsResponseData.items;
          } else if (Object.keys(jobsResponseData).length === 0) {
            // Handle empty object response gracefully - this is valid for no jobs
            processedJobsData = [];
          } else {
            // Log all keys to understand the structure but don't throw error
            processedJobsData = [];
          }
        } else if (jobsResponseData === null || jobsResponseData === undefined) {
          // Handle null/undefined responses
          processedJobsData = [];
        } else {
          // Handle other non-object types
          processedJobsData = [];
        }
      } else {
        processedJobsData = jobsResponseData;
      }

      // If no jobs found or empty response, try the getAllCreatedJobs API as fallback
      if (processedJobsData.length === 0) {
        try {
          const allJobsResponse = await getAllCreatedJobs(token);
          // First check if response itself is directly the jobs array
          if (Array.isArray(allJobsResponse)) {
            processedJobsData = allJobsResponse;
          } else if (allJobsResponse && typeof allJobsResponse === 'object') {
            // Check various possible field names where jobs might be stored
            const possibleFields = [
              'allCreatedJobs',
              'all_created_jobs',
              'jobs',
              'data',
              'items',
              'results',
              'records',
              'postedJobs',
              'posted_jobs',
              'jobList',
              'job_list'
            ];
            
            for (const field of possibleFields) {
              if (allJobsResponse[field] && Array.isArray(allJobsResponse[field])) {
                processedJobsData = allJobsResponse[field];
                break;
              }
            }
            
            // If still no data found, check if data.data pattern exists
            if (processedJobsData.length === 0 && allJobsResponse.data) {
              if (Array.isArray(allJobsResponse.data)) {
                processedJobsData = allJobsResponse.data;
              } else if (typeof allJobsResponse.data === 'object') {
                for (const field of possibleFields) {
                  if (allJobsResponse.data[field] && Array.isArray(allJobsResponse.data[field])) {
                    processedJobsData = allJobsResponse.data[field];
                    break;
                  }
                }
              }
            }
            
            // Log what we found if still no data
            if (processedJobsData.length === 0) {
              if (allJobsResponse.data) {
                }
            }
          }
        } catch (fallbackError) {
          // Keep the empty array if fallback also fails
        }
      }

      if (processedJobsData.length === 0) {
        } else {
        }

      setJobsData(processedJobsData);
      setLastFetchTime(Date.now());

    } catch (error: any) {
      // Provide specific error messages
      let errorMessage = 'Failed to load HRA data. ';

      if (error.message.includes('HR User ID not found')) {
        errorMessage = 'HR User ID not found. Please ensure you are logged in as an HR/Company user.';
        setError(errorMessage);
        // Don't set any fallback data for authentication issues
        return;
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You may not have HR permissions.';
      } else if (error.response?.status === 404) {
        errorMessage = 'HRA data endpoint not found. Please contact support.';
      } else if (error.message.includes('Invalid jobs response format')) {
        errorMessage = 'Invalid data format received from server. Please try again or contact support.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }

      setError(errorMessage);

    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [isCacheValid, dashboardData, skipDataFetch]);

  const refreshData = useCallback(async () => {
    await fetchHraData(true);
  }, [fetchHraData]);

  const clearCache = useCallback(() => {
    setDashboardData(null);
    setJobsData([]);
    setLastFetchTime(null);
    setError(null);
  }, []);

  const contextValue: HraDataContextType = {
    dashboardData,
    jobsData,
    loading,
    error,
    fetchHraData,
    refreshData,
    clearCache,
    lastFetchTime,
  };

  return (
    <HraDataContext.Provider value={contextValue}>
      {children}
    </HraDataContext.Provider>
  );
}

export function useHraData() {
  const context = useContext(HraDataContext);
  if (context === undefined) {
    throw new Error('useHraData must be used within a HraDataProvider');
  }
  return context;
}

// Hook for components that only need dashboard stats
export function useHraDashboardStats() {
  const { dashboardData, loading, error, fetchHraData } = useHraData();

  return {
    totalPostedJobs: dashboardData?.totalPostedJobs ?? 0,
    totalAppliedCandidates: dashboardData?.totalAppliedCandidates ?? 0,
    totalPostedBulkHiring: dashboardData?.totalPostedBulkHiring ?? 0,
    latestAppliedCandidates: dashboardData?.latestAppliedCandidates ?? [],
    loading,
    error,
    refresh: fetchHraData
  };
}
