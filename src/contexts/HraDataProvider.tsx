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

    console.warn('HR User ID not found in stored user data');
    return null;
  } catch (error) {
    console.error('Error extracting HR user ID:', error);
    return null;
  }
}

export function HraDataProvider({ children }: HraDataProviderProps) {
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
    // Check if data is cached and valid
    if (!force && isCacheValid()) {
      return;
    }

    // Prevent multiple simultaneous calls
    if (fetchingRef.current) {
      console.log('API call already in progress');
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
        console.error('❌ Jobs response is not an array:', {
          responseType: typeof jobsResponseData,
          responseValue: jobsResponseData,
          fullResponse: jobsResponse
        });
        throw new Error(`Invalid jobs response format. Expected array, got ${typeof jobsResponseData}. This indicates an API issue.`);
      }

      processedJobsData = jobsResponseData;


      if (processedJobsData.length === 0) {
        console.warn('⚠️ No jobs found for HR user. This might be normal if no jobs have been posted yet.');
      } else {
        console.log('📋 First job sample:', processedJobsData[0]);
      }

      setJobsData(processedJobsData);
      setLastFetchTime(Date.now());


    } catch (error: any) {
      console.error('❌ HRA Data Fetch Error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        response: error.response?.data,
        status: error.response?.status
      });

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
  }, [isCacheValid, dashboardData]);

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
