import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { 
  HrDetails,
  HrDashboardData,
  Company,
  Job,
  ApiResponse,
  queryKeys 
} from '../../lib/api/types';
import { toast } from 'sonner';

// Get HR profile details
export const useHrProfile = () => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'profile'],
    queryFn: async (): Promise<HrDetails> => {
      const response = await api.get<ApiResponse<HrDetails>>(
        endpoints.hr.getEnhancedHrDetails
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get HR dashboard data
export const useHrDashboard = () => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'dashboard'],
    queryFn: async (): Promise<HrDashboardData> => {
      const response = await api.get<ApiResponse<HrDashboardData>>(
        endpoints.hr.getHrDashboard
      );
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get HR dashboard analytics
export const useHrDashboardAnalytics = () => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'analytics'],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse>(
        endpoints.hr.getHrDashboardAnalytics
      );
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get jobs posted by HR
export const useHrJobs = (hrId?: string) => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'jobs', hrId],
    queryFn: async (): Promise<Job[]> => {
      if (!hrId) {
        throw new Error('HR ID is required');
      }
      
      const response = await api.get<ApiResponse<Job[]>>(
        endpoints.hr.getJobsPostedByHra(hrId)
      );
      return response.data.data;
    },
    enabled: !!hrId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get all companies
export const useAllCompanies = () => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'companies'],
    queryFn: async (): Promise<Company[]> => {
      const response = await api.get<ApiResponse<{ cmpData: Company[] }>>(
        endpoints.hr.getAllCompanies
      );
      return response.data.data.cmpData;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get companies with pagination
export const useCompanies = (page: number = 1) => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'companies', 'paginated', page],
    queryFn: async (): Promise<{ data: Company[]; total: number; current_page: number; last_page: number }> => {
      const response = await api.get<ApiResponse<Company[]>>(
        endpoints.hr.getCompanies,
        {
          params: { page }
        }
      );
      return {
        data: response.data.data,
        total: response.data.total || 0,
        current_page: response.data.current_page || page,
        last_page: response.data.last_page || 1,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get company by ID
export const useCompanyById = (id: number) => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'company', id],
    queryFn: async (): Promise<Company> => {
      const response = await api.get<ApiResponse<Company>>(
        endpoints.hr.getCompanyById(id)
      );
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create job
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.hr.createJob,
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
      // Invalidate HR-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.hr });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      
      toast.success('Job created successfully!');
    },
    onError: (error: any) => {
      console.error('Create job error:', error);
      toast.error(error.message || 'Failed to create job. Please try again.');
    },
  });
};

// Update job
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }): Promise<ApiResponse> => {
      const response = await api.put<ApiResponse>(
        endpoints.hr.updateJob,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.hr });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      
      toast.success('Job updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update job error:', error);
      toast.error(error.message || 'Failed to update job. Please try again.');
    },
  });
};

// Delete job
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<ApiResponse> => {
      const response = await api.delete<ApiResponse>(
        endpoints.hr.deleteJob,
        {
          data: { id }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hr });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      
      toast.success('Job deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Delete job error:', error);
      toast.error(error.message || 'Failed to delete job. Please try again.');
    },
  });
};

// Get candidate applications
export const useCandidateApplications = (jobId?: number) => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'applications', jobId],
    queryFn: async (): Promise<any[]> => {
      const response = await api.get<ApiResponse<any[]>>(
        endpoints.hr.getCandidateApplications,
        {
          params: jobId ? { job_id: jobId } : {}
        }
      );
      return response.data.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

// Update application status
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      status 
    }: { 
      applicationId: number; 
      status: 'pending' | 'accepted' | 'rejected' | 'interview_scheduled' 
    }): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.hr.updateApplicationStatus,
        { application_id: applicationId, status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.hr, 'applications'] });
      
      toast.success('Application status updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update application status error:', error);
      toast.error(error.message || 'Failed to update application status. Please try again.');
    },
  });
};

// Register HR
export const useRegisterHra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.hr.registerHra,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.hr });
      
      toast.success('HR registration successful!');
    },
    onError: (error: any) => {
      console.error('HR registration error:', error);
      toast.error(error.message || 'Failed to register as HR. Please try again.');
    },
  });
};

// Get HR data
export const useHrData = () => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'data'],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse>(
        endpoints.hr.getHrData
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Helper hook to get HR user ID from localStorage
export const useHrUserId = () => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'userId'],
    queryFn: () => {
      if (typeof window === 'undefined') return null;
      
      try {
        const loggedUser = localStorage.getItem("loggedUser");
        const userSimple = localStorage.getItem("user");
        
        if (loggedUser) {
          const userData = JSON.parse(loggedUser);
          const hrId = userData?.user?.id || 
                       userData?.cmpData?.id || 
                       userData?.id || 
                       userData?.hrId || 
                       userData?.empId ||
                       userData?.user?.empId ||
                       userData?.cmpData?.empId;
          
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
        console.error('Error extracting HR user ID:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Helper hook to check if user is HR
export const useIsHrUser = () => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'isHr'],
    queryFn: () => {
      if (typeof window === 'undefined') return false;
      
      try {
        const loggedUser = localStorage.getItem("loggedUser");
        const userSimple = localStorage.getItem("user");
        
        if (loggedUser) {
          const userData = JSON.parse(loggedUser);
          return userData?.user?.type === 'company' || userData?.type === 'company';
        }
        
        if (userSimple) {
          const userSimpleData = JSON.parse(userSimple);
          return userSimpleData?.type === 'company';
        }
        
        return false;
      } catch (error) {
        console.error('Error checking HR user status:', error);
        return false;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

