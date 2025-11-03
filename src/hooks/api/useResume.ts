import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { 
  ApiResponse,
  queryKeys 
} from '../../lib/api/types';
import { toast } from 'sonner';

// Update resume
export const useUpdateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.updateResume,
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'profile'] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'resume'] });
      toast.success('Resume updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update resume error:', error);
      toast.error(error.message || 'Failed to update resume. Please try again.');
    },
  });
};

// Update resume experience
export const useUpdateResumeExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.updateResumeExperience,
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'experiences'] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'resume'] });
      toast.success('Resume experience updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update resume experience error:', error);
      toast.error(error.message || 'Failed to update resume experience. Please try again.');
    },
  });
};

// Update resume license
export const useUpdateResumeLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.updateResumeLicense,
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'documents'] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'resume'] });
      toast.success('Resume license updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update resume license error:', error);
      toast.error(error.message || 'Failed to update resume license. Please try again.');
    },
  });
};

// Update passport
export const useUpdatePassport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.updatePassport,
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'documents'] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'resume'] });
      toast.success('Passport updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update passport error:', error);
      toast.error(error.message || 'Failed to update passport. Please try again.');
    },
  });
};

// Get resume data
export const useResumeData = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'resume'],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse<any>>(
        endpoints.user.getResumeData
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};


