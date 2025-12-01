"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCountries,
  getCountriesForJobs,
  getOccupations,
  getState,
  getHomeData,
  getTopCountriesHiring,
  normalizeCountryHiringData,
} from "../services/info.service";

// Query keys for cache management
export const queryKeys = {
  countries: ["countries"] as const,
  countriesForJobs: ["countriesForJobs"] as const,
  occupations: ["occupations"] as const,
  states: ["states"] as const,
  homeData: ["homeData"] as const,
  topCountriesHiring: ["topCountriesHiring"] as const,
};

/**
 * Hook to fetch and cache countries list
 * Data is cached for 10 minutes (countries rarely change)
 */
export function useCountries() {
  return useQuery({
    queryKey: queryKeys.countries,
    queryFn: async () => {
      const response = await getCountries();
      // Normalize response - API returns either { data: [] } or { countries: [] }
      return response?.data || response?.countries || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
  });
}

/**
 * Hook to fetch and cache countries that have active jobs
 * Data is cached for 5 minutes
 */
export function useCountriesForJobs() {
  return useQuery({
    queryKey: queryKeys.countriesForJobs,
    queryFn: async () => {
      const response = await getCountriesForJobs();
      return response?.data || response?.countries || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch and cache occupations/categories list
 * Data is cached for 10 minutes
 */
export function useOccupations() {
  return useQuery({
    queryKey: queryKeys.occupations,
    queryFn: async () => {
      const response = await getOccupations();
      // Normalize response - API returns either { data: [] } or { occupation: [] }
      return response?.data || response?.occupation || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to fetch and cache states list
 * Data is cached for 30 minutes (states never change)
 */
export function useStates() {
  return useQuery({
    queryKey: queryKeys.states,
    queryFn: async () => {
      const response = await getState();
      return response?.data || [];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to fetch and cache home page data
 * Data is cached for 5 minutes
 */
export function useHomeData() {
  return useQuery({
    queryKey: queryKeys.homeData,
    queryFn: getHomeData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch and cache top countries hiring data
 * Data is cached for 5 minutes
 */
export function useTopCountriesHiring() {
  return useQuery({
    queryKey: queryKeys.topCountriesHiring,
    queryFn: async () => {
      const response = await getTopCountriesHiring();
      return normalizeCountryHiringData(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Type exports for consumers
export interface Country {
  id: number;
  name: string;
}

export interface Occupation {
  id: number;
  title?: string;
  name?: string;
  occupation?: string;
}

export interface State {
  id: number;
  name: string;
}

