"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { getHraDashboardAnalytics, getHraDashboardData, getAllCreatedJobs, HraDashboardData } from '@/services/hra.service';

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

      // Use jobs from analytics API if available, otherwise fetch separately
      let processedJobsData = [];
      if (analyticsData?.latestPostedJobs && analyticsData.latestPostedJobs.length > 0) {
        processedJobsData = analyticsData.latestPostedJobs;
        console.log('Using jobs data from analytics API');
      } else {
        // Fallback: fetch all jobs separately only if analytics doesn't have jobs data
        console.log('Fetching jobs data separately as fallback');
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
