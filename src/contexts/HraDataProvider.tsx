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
        console.log('HR User ID found:', hrId);
        return hrId.toString();
      }
    }
    
    if (userSimple) {
      const userSimpleData = JSON.parse(userSimple);
      const hrId = userSimpleData?.id;
      
      if (hrId) {
        console.log('HR User ID found in userSimple:', hrId);
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
      console.log('Using cached HRA data');
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

      console.log('Fetching HRA data from API');
      
      // Fetch dashboard analytics data with proper transformation (primary source)
      const transformedData = await getHraDashboardData(token);
      
      console.log('Transformed dashboard data:', transformedData);
      setDashboardData(transformedData);
      
      // Also get raw analytics data for jobs fallback
      const analyticsResponse = await getHraDashboardAnalytics(token);
      const analyticsData = analyticsResponse?.data || analyticsResponse;

      // Get jobs posted by this specific HR user
      let processedJobsData = [];
      const hrUserId = getHrUserIdFromStorage();
      
      if (analyticsData?.latestPostedJobs && analyticsData.latestPostedJobs.length > 0) {
        processedJobsData = analyticsData.latestPostedJobs;
        console.log('Using jobs data from analytics API (should be HR-specific)');
      } else if (hrUserId) {
        // Fetch jobs posted by this specific HR user
        console.log('Fetching jobs posted by HR user ID:', hrUserId);
        const jobsResponse = await getJobsPostedByHra(hrUserId, token);
        const jobsResponseData = jobsResponse?.data || jobsResponse || [];
        processedJobsData = Array.isArray(jobsResponseData) ? jobsResponseData : [];
        console.log(`Found ${processedJobsData.length} jobs for HR user ${hrUserId}`);
      } else {
        // Fallback: fetch all jobs if we can't get HR user ID (should not happen in normal flow)
        console.warn('HR User ID not found, falling back to all jobs (this should not happen for company users)');
        const jobsResponse = await getAllCreatedJobs(token);
        const jobsResponseData = jobsResponse?.data || jobsResponse || [];
        processedJobsData = Array.isArray(jobsResponseData) ? jobsResponseData : [];
      }

      setJobsData(processedJobsData);
      setLastFetchTime(Date.now());
      
      console.log('HRA data fetched successfully:', {
        totalJobs: transformedData?.totalPostedJobs,
        totalCandidates: transformedData?.totalAppliedCandidates,
        recentApplicationsCount: transformedData?.recentApplications?.length || 0,
        jobsCount: processedJobsData.length
      });

    } catch (error) {
      console.error('Error fetching HRA data:', error);
      setError('Failed to load HRA data. Please try again.');
      
      // Don't clear existing data on error, just show error
      if (!dashboardData) {
        setDashboardData({
          totalPostedJobs: 0,
          totalAppliedCandidates: 0,
          totalPostedBulkHiring: 0,
          latestPostedJobs: [],
          latestAppliedCandidates: [],
          recentApplications: [],
          recentJobs: []
        });
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [isCacheValid, dashboardData]);

  const refreshData = useCallback(async () => {
    console.log('Force refreshing HRA data');
    await fetchHraData(true);
  }, [fetchHraData]);

  const clearCache = useCallback(() => {
    console.log('Clearing HRA data cache');
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
