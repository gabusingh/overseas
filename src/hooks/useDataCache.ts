import { useState, useEffect, useCallback } from 'react';
import { cacheService } from '../services/cache.service';

interface UseDataCacheOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  expiry?: number;
  dependencies?: any[];
  enabled?: boolean;
}

export function useDataCache<T>({
  key,
  fetchFn,
  expiry = 15 * 60 * 1000, // 15 minutes default
  dependencies = [],
  enabled = true
}: UseDataCacheOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;

    // Check cache first if not forcing refresh
    if (!force) {
      const cached = cacheService.get<T>(key);
      if (cached) {
        console.log(`📦 Cache hit for ${key}`);
        setData(cached);
        setError(null);
        return cached;
      }
    }

    console.log(`🔄 Fetching fresh data for ${key}`);
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      
      // Cache the result
      cacheService.set(key, result, expiry);
      
      setData(result);
      setLastFetch(Date.now());
      console.log(`✅ Data cached for ${key}`);
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      console.error(`❌ Error fetching ${key}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, expiry, enabled]);

  // Initial load and dependency-based refetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, ...dependencies]);

  // Manual refresh function
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Clear cache for this key
  const clearCache = useCallback(() => {
    cacheService.clear(key);
    setData(null);
    setLastFetch(null);
  }, [key]);

  // Check if data is stale (beyond expiry time)
  const isStale = useCallback(() => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch > expiry;
  }, [lastFetch, expiry]);

  return {
    data,
    loading,
    error,
    refresh,
    clearCache,
    isStale: isStale(),
    lastFetch
  };
}

// Hook specifically for course data
export function useCourseData(courseId: string, enabled = true) {
  return useDataCache({
    key: `course_${courseId}`,
    fetchFn: async () => {
      const response = await fetch(`https://backend.overseas.ai/api/get-course-details-by-id/${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      return response.json();
    },
    expiry: 30 * 60 * 1000, // 30 minutes
    dependencies: [courseId],
    enabled
  });
}

// Hook specifically for institute data
export function useInstituteData(instituteId: string, enabled = true) {
  return useDataCache({
    key: `institute_${instituteId}`,
    fetchFn: async () => {
      const response = await fetch('https://backend.overseas.ai/api/list-training-institute');
      if (!response.ok) throw new Error('Failed to fetch institutes');
      const data = await response.json();
      const institute = data?.data?.find((inst: any) => inst.id.toString() === instituteId);
      if (!institute) throw new Error('Institute not found');
      return institute;
    },
    expiry: 15 * 60 * 1000, // 15 minutes
    dependencies: [instituteId],
    enabled
  });
}

// Hook for all courses data
export function useAllCoursesData(enabled = true) {
  return useDataCache({
    key: 'all_courses',
    fetchFn: async () => {
      const response = await fetch('https://backend.overseas.ai/api/list-all-course');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
    expiry: 15 * 60 * 1000, // 15 minutes
    dependencies: [],
    enabled
  });
}
