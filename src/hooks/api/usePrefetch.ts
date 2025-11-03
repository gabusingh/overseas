import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { queryKeys } from '../../lib/api/types';

/**
 * Custom hook for prefetching data
 * Useful for preloading data on hover or route changes
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchJob = async (jobId: number) => {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.jobs, 'detail', jobId],
      queryFn: async () => {
        const response = await api.get(`${endpoints.jobs.getJobs}/${jobId}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const prefetchUserProfile = async () => {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.user, 'profile'],
      queryFn: async () => {
        const response = await api.get(endpoints.user.getEmpData);
        return response.data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const prefetchHrDashboard = async () => {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.hr, 'dashboard'],
      queryFn: async () => {
        const response = await api.get(endpoints.hr.getHraDashboardData);
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const prefetchJobs = async (filters: any = {}) => {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.jobs, 'list', filters],
      queryFn: async () => {
        const formData = new FormData();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        const response = await api.post(endpoints.jobs.filterAllJobs, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const prefetchCountries = async () => {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.countries, 'list'],
      queryFn: async () => {
        const response = await api.get(endpoints.info.getCountries);
        return response.data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const prefetchOccupations = async () => {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.departments, 'list'],
      queryFn: async () => {
        const response = await api.get(endpoints.jobs.getOccupations);
        return response.data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  return {
    prefetchJob,
    prefetchUserProfile,
    prefetchHrDashboard,
    prefetchJobs,
    prefetchCountries,
    prefetchOccupations,
  };
};

/**
 * Hook for prefetching data on hover
 * Usage: const { prefetchOnHover } = usePrefetchOnHover();
 * <div onMouseEnter={() => prefetchOnHover('job', jobId)}>
 */
export const usePrefetchOnHover = () => {
  const { prefetchJob, prefetchUserProfile, prefetchHrDashboard } = usePrefetch();

  const prefetchOnHover = async (type: string, id?: number) => {
    try {
      switch (type) {
        case 'job':
          if (id) await prefetchJob(id);
          break;
        case 'profile':
          await prefetchUserProfile();
          break;
        case 'hr-dashboard':
          await prefetchHrDashboard();
          break;
        default:
          break;
      }
    } catch (error) {
      // Silently fail prefetching - it's not critical
      console.debug('Prefetch failed:', error);
    }
  };

  return { prefetchOnHover };
};


