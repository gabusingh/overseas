import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { 
  Job, 
  JobFilters, 
  JobApplication, 
  PaginatedResponse,
  ApiResponse,
  queryKeys 
} from '../../lib/api/types';
import { toast } from 'sonner';

// Get jobs with filters and pagination
export const useJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'list', filters],
    queryFn: async (): Promise<PaginatedResponse<Job>> => {
      const formData = new FormData();
      
      // Add filters to form data
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await api.post<ApiResponse<PaginatedResponse<Job>>>(
        endpoints.jobs.filterAllJobs,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get jobs with infinite scroll
export const useInfiniteJobs = (filters: JobFilters = {}) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.jobs, 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const formData = new FormData();
      
      // Add filters to form data
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      formData.append('page', String(pageParam));

      const response = await api.post<ApiResponse<PaginatedResponse<Job>>>(
        endpoints.jobs.filterAllJobs,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page 
        ? lastPage.current_page + 1 
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get job by ID
export const useJobById = (id: string | number) => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'detail', id],
    queryFn: async (): Promise<Job> => {
      const response = await api.get<ApiResponse<{ jobs: Job }>>(
        endpoints.jobs.getJobById(id)
      );
      return response.data.data.jobs;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search jobs
export const useSearchJobs = (searchKey: string) => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'search', searchKey],
    queryFn: async (): Promise<PaginatedResponse<Job>> => {
      const response = await api.post<ApiResponse<PaginatedResponse<Job>>>(
        endpoints.jobs.searchAllJobs,
        { searchKey: searchKey.replace(/-/g, ' ') },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    },
    enabled: !!searchKey,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get jobs by department
export const useJobsByDepartment = (departmentId: number) => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'department', departmentId],
    queryFn: async (): Promise<ApiResponse<Job[]>> => {
      const response = await api.get<ApiResponse<Job[]>>(
        endpoints.jobs.getJobsByDepartment(departmentId)
      );
      return response.data;
    },
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get jobs by country
export const useJobsByCountry = (countryId: number) => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'country', countryId],
    queryFn: async (): Promise<ApiResponse<Job[]>> => {
      const response = await api.get<ApiResponse<Job[]>>(
        endpoints.jobs.getJobsByCountry(countryId)
      );
      return response.data;
    },
    enabled: !!countryId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get latest jobs
export const useLatestJobs = () => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'latest'],
    queryFn: async (): Promise<Job[]> => {
      const response = await api.get<ApiResponse<Job[]>>(
        endpoints.jobs.getLatestJobs
      );
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get this week's jobs
export const useThisWeekJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'thisWeek', filters],
    queryFn: async (): Promise<PaginatedResponse<Job>> => {
      const formData = new FormData();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await api.post<ApiResponse<PaginatedResponse<Job>>>(
        endpoints.jobs.getLastWeekJobs,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get related jobs
export const useRelatedJobs = (jobId: number) => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'related', jobId],
    queryFn: async (): Promise<Job[]> => {
      const response = await api.get<ApiResponse<Job[]>>(
        endpoints.jobs.getRelatedJobs,
        {
          params: { jobId }
        }
      );
      return response.data.data;
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Apply for job
export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, coverLetter }: { jobId: number; coverLetter?: string }): Promise<ApiResponse> => {
      const formData = new FormData();
      formData.append('id', String(jobId));
      if (coverLetter) {
        formData.append('apply-job', coverLetter);
      }

      const response = await api.post<ApiResponse>(
        endpoints.jobs.applyJob,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate job-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'appliedJobs'] });
      
      toast.success('Job application submitted successfully!');
    },
    onError: (error: any) => {
      console.error('Job application error:', error);
      toast.error(error.message || 'Failed to apply for job. Please try again.');
    },
  });
};

// Get applied jobs
export const useAppliedJobs = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'appliedJobs'],
    queryFn: async (): Promise<JobApplication[]> => {
      const response = await api.get<ApiResponse<JobApplication[]>>(
        endpoints.jobs.appliedJobList
      );
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get applied job by ID
export const useAppliedJobById = (id: number) => {
  return useQuery({
    queryKey: [...queryKeys.user, 'appliedJob', id],
    queryFn: async (): Promise<JobApplication> => {
      const response = await api.get<ApiResponse<JobApplication>>(
        endpoints.jobs.appliedJobById(id)
      );
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get interview status
export const useInterviewStatus = (id: number) => {
  return useQuery({
    queryKey: [...queryKeys.user, 'interview', id],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse>(
        endpoints.jobs.interviewStatus(id)
      );
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

// Save job to favorites with optimistic updates
export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: number): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.jobs.saveJob,
        { jobId }
      );
      return response.data;
    },
    onMutate: async (jobId: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [...queryKeys.user, 'savedJobs'] });
      
      // Snapshot the previous value
      const previousSavedJobs = queryClient.getQueryData([...queryKeys.user, 'savedJobs']);
      
      // Optimistically update the cache
      queryClient.setQueryData([...queryKeys.user, 'savedJobs'], (old: Job[] = []) => {
        const job = queryClient.getQueryData([...queryKeys.jobs, 'detail', jobId]) as Job;
        if (job && !old.some(savedJob => savedJob.id === jobId)) {
          return [...old, job];
        }
        return old;
      });
      
      // Return a context object with the snapshotted value
      return { previousSavedJobs };
    },
    onSuccess: () => {
      toast.success('Job saved to favorites!');
    },
    onError: (error: any, jobId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSavedJobs) {
        queryClient.setQueryData([...queryKeys.user, 'savedJobs'], context.previousSavedJobs);
      }
      console.error('Save job error:', error);
      toast.error(error.message || 'Failed to save job. Please try again.');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'savedJobs'] });
    },
  });
};

// Get saved jobs
export const useSavedJobs = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'savedJobs'],
    queryFn: async (): Promise<Job[]> => {
      const response = await api.get<ApiResponse<Job[]>>(
        endpoints.jobs.savedJobList
      );
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Remove saved job with optimistic updates
export const useRemoveSavedJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: number): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.jobs.removeSavedJob,
        { jobId }
      );
      return response.data;
    },
    onMutate: async (jobId: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [...queryKeys.user, 'savedJobs'] });
      
      // Snapshot the previous value
      const previousSavedJobs = queryClient.getQueryData([...queryKeys.user, 'savedJobs']);
      
      // Optimistically update the cache
      queryClient.setQueryData([...queryKeys.user, 'savedJobs'], (old: Job[] = []) => {
        return old.filter(job => job.id !== jobId);
      });
      
      // Return a context object with the snapshotted value
      return { previousSavedJobs };
    },
    onSuccess: () => {
      toast.success('Job removed from favorites');
    },
    onError: (error: any, jobId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSavedJobs) {
        queryClient.setQueryData([...queryKeys.user, 'savedJobs'], context.previousSavedJobs);
      }
      console.error('Remove saved job error:', error);
      toast.error(error.message || 'Failed to remove job. Please try again.');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'savedJobs'] });
    },
  });
};

// Get favorite jobs
export const useFavoriteJobs = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'favoriteJobs'],
    queryFn: async (): Promise<Job[]> => {
      const response = await api.post<ApiResponse<Job[]>>(
        endpoints.jobs.favoriteJobList,
        {}
      );
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Submit job query
export const useJobQuery = () => {
  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.jobs.jobQuery,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Query submitted successfully!');
    },
    onError: (error: any) => {
      console.error('Job query error:', error);
      toast.error(error.message || 'Failed to submit query. Please try again.');
    },
  });
};

// Get job statistics
export const useJobStatistics = () => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'statistics'],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse>(
        endpoints.jobs.jobStatistics
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
