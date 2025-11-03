import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { 
  Course,
  ApiResponse,
  queryKeys 
} from '../../lib/api/types';
import { toast } from 'sonner';

// Get all courses
export const useCourses = () => {
  return useQuery({
    queryKey: [...queryKeys.courses, 'list'],
    queryFn: async (): Promise<Course[]> => {
      const response = await api.get<ApiResponse<Course[]>>(
        endpoints.course.getAllCourses
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get course by ID
export const useCourseById = (id: number) => {
  return useQuery({
    queryKey: [...queryKeys.courses, 'detail', id],
    queryFn: async (): Promise<Course> => {
      const response = await api.get<ApiResponse<Course>>(
        endpoints.course.getCourseById(id)
      );
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get courses by institute
export const useCoursesByInstitute = (instituteId: number) => {
  return useQuery({
    queryKey: [...queryKeys.courses, 'institute', instituteId],
    queryFn: async (): Promise<Course[]> => {
      const response = await api.get<ApiResponse<Course[]>>(
        endpoints.course.getCoursesByInstitute(instituteId)
      );
      return response.data.data;
    },
    enabled: !!instituteId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Apply for course
export const useApplyCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.course.applyCourse,
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'appliedCourses'] });
      
      toast.success('Course application submitted successfully!');
    },
    onError: (error: any) => {
      console.error('Course application error:', error);
      toast.error(error.message || 'Failed to apply for course. Please try again.');
    },
  });
};

// Get applied courses
export const useAppliedCourses = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'appliedCourses'],
    queryFn: async (): Promise<Course[]> => {
      const response = await api.get<ApiResponse<Course[]>>(
        endpoints.course.getAppliedCourses
      );
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get course applications (for institute)
export const useCourseApplications = (courseId: number) => {
  return useQuery({
    queryKey: [...queryKeys.courses, 'applications', courseId],
    queryFn: async (): Promise<any[]> => {
      const response = await api.get<ApiResponse<any[]>>(
        endpoints.course.getCourseApplications(courseId)
      );
      return response.data.data;
    },
    enabled: !!courseId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

