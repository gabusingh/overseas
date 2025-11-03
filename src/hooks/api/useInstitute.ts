import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { 
  Institute,
  ApiResponse,
  queryKeys 
} from '../../lib/api/types';
import { toast } from 'sonner';

// Get all institutes
export const useInstitutes = () => {
  return useQuery({
    queryKey: [...queryKeys.institutes, 'list'],
    queryFn: async (): Promise<Institute[]> => {
      const response = await api.get<ApiResponse<Institute[]>>(
        endpoints.institute.listTrainingInstitutes
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get institute by ID
export const useInstituteById = (id: number) => {
  return useQuery({
    queryKey: [...queryKeys.institutes, 'detail', id],
    queryFn: async (): Promise<Institute> => {
      const response = await api.get<ApiResponse<Institute>>(
        endpoints.institute.getInstituteById(id)
      );
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get institute courses
export const useInstituteCourses = (instituteId: number) => {
  return useQuery({
    queryKey: [...queryKeys.institutes, 'courses', instituteId],
    queryFn: async (): Promise<any[]> => {
      const response = await api.get<ApiResponse<any[]>>(
        endpoints.institute.getInstituteCourses(instituteId)
      );
      return response.data.data;
    },
    enabled: !!instituteId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Register institute
export const useRegisterInstitute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.institute.registerInstitute,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.institutes });
      
      toast.success('Institute registration successful!');
    },
    onError: (error: any) => {
      console.error('Institute registration error:', error);
      toast.error(error.message || 'Failed to register institute. Please try again.');
    },
  });
};

