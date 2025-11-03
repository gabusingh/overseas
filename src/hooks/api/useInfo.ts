import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { 
  Country,
  Department,
  Skill,
  NewsItem,
  SuccessStory,
  ApiResponse,
  queryKeys 
} from '../../lib/api/types';

// Get countries
export const useCountries = () => {
  return useQuery({
    queryKey: [...queryKeys.countries, 'list'],
    queryFn: async (): Promise<Country[]> => {
      const response = await api.get<ApiResponse<Country[]>>(
        endpoints.info.getCountries
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get countries for jobs
export const useCountriesForJobs = () => {
  return useQuery({
    queryKey: [...queryKeys.countries, 'forJobs'],
    queryFn: async (): Promise<Country[]> => {
      const response = await api.get<ApiResponse<Country[]>>(
        endpoints.info.getCountriesForJobs
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Get departments/occupations
export const useOccupations = () => {
  return useQuery({
    queryKey: [...queryKeys.departments, 'list'],
    queryFn: async (): Promise<Department[]> => {
      const response = await api.get<ApiResponse<Department[]>>(
        endpoints.jobs.getOccupations
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Get skills
export const useSkills = () => {
  return useQuery({
    queryKey: [...queryKeys.skills, 'list'],
    queryFn: async (): Promise<Skill[]> => {
      const response = await api.post<ApiResponse<Skill[]>>(
        endpoints.jobs.getSkills
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Get news feed
export const useNewsFeed = () => {
  return useQuery({
    queryKey: [...queryKeys.notifications, 'news'],
    queryFn: async (): Promise<NewsItem[]> => {
      const response = await api.get<ApiResponse<{ newsData: NewsItem[] }>>(
        endpoints.info.getNewsFeed
      );
      return response.data.data.newsData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get success notifications
export const useSuccessNotifications = () => {
  return useQuery({
    queryKey: [...queryKeys.notifications, 'success'],
    queryFn: async (): Promise<SuccessStory[]> => {
      const response = await api.get<ApiResponse<{ notifications: SuccessStory[] }>>(
        endpoints.info.getSuccessNotifications
      );
      return response.data.data.notifications;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

// Get job statistics
export const useJobStats = () => {
  return useQuery({
    queryKey: [...queryKeys.jobs, 'stats'],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse>(
        endpoints.info.getJobStats
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Get company statistics
export const useCompanyStats = () => {
  return useQuery({
    queryKey: [...queryKeys.hr, 'stats'],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse>(
        endpoints.info.getCompanyStats
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

