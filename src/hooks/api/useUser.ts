import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { 
  User, 
  HrDetails,
  Experience,
  Document,
  ProfileStrength,
  ApiResponse,
  queryKeys 
} from '../../lib/api/types';
import { toast } from 'sonner';

// Get user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'profile'],
    queryFn: async (): Promise<User> => {
      const response = await api.get<ApiResponse<User>>(
        endpoints.user.getUserDashboard
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get user dashboard data
export const useUserDashboard = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'dashboard'],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse>(
        endpoints.user.getUserDashboard
      );
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get employee data for editing
export const useEmpDataForEdit = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'empData'],
    queryFn: async (): Promise<any> => {
      try {
        const response = await api.get<ApiResponse>(
          endpoints.user.getEmpDataForEdit
        );
        return response.data.data;
      } catch (error: any) {
        // Return empty data structure for new users
        if (error.status === 404) {
          return {
            empName: '',
            empDob: '',
            empGender: '',
            empWhatsapp: '',
            empMS: '',
            empEmail: '',
            empEdu: '',
            empTechEdu: '',
            empPassportQ: '',
            empSkill: '',
            empOccuId: '',
            empInternationMigrationExp: '',
            empDailyWage: '',
            empExpectedMonthlyIncome: '',
            empRelocationIntQ: '',
            empState: '',
            empDistrict: '',
            empPin: '',
            empRefName: '',
            empRefPhone: '',
            empRefDistance: ''
          };
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.editProfile,
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
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      
      if (error.status === 413) {
        toast.error('File size too large. Please reduce image size and try again.');
      } else if (error.status === 422) {
        toast.error(error.data?.message || 'Invalid data provided. Please check your inputs.');
      } else {
        toast.error(error.message || 'Failed to update profile. Please try again.');
      }
    },
  });
};

// Complete profile step 2
export const useCompleteProfileStep2 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.completeProfileStep2,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      toast.success('Profile step 2 completed successfully!');
    },
    onError: (error: any) => {
      console.error('Profile step 2 error:', error);
      toast.error(error.message || 'Failed to complete profile step 2. Please try again.');
    },
  });
};

// Complete profile step 3
export const useCompleteProfileStep3 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.completeProfileStep3,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      toast.success('Profile step 3 completed successfully!');
    },
    onError: (error: any) => {
      console.error('Profile step 3 error:', error);
      toast.error(error.message || 'Failed to complete profile step 3. Please try again.');
    },
  });
};

// Get profile strength
export const useProfileStrength = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'profileStrength'],
    queryFn: async (): Promise<ProfileStrength> => {
      const response = await api.get<ApiResponse<ProfileStrength>>(
        endpoints.user.getProfileStrength
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get experiences
export const useExperiences = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'experiences'],
    queryFn: async (): Promise<Experience[]> => {
      const response = await api.get<ApiResponse<Experience[]>>(
        endpoints.user.experienceList
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Add experience
export const useAddExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.addExperience,
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
      toast.success('Experience added successfully!');
    },
    onError: (error: any) => {
      console.error('Add experience error:', error);
      toast.error(error.message || 'Failed to add experience. Please try again.');
    },
  });
};

// Edit experience
export const useEditExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.editExperience,
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
      toast.success('Experience updated successfully!');
    },
    onError: (error: any) => {
      console.error('Edit experience error:', error);
      toast.error(error.message || 'Failed to update experience. Please try again.');
    },
  });
};

// Get experience by ID
export const useExperienceById = (id: number) => {
  return useQuery({
    queryKey: [...queryKeys.user, 'experience', id],
    queryFn: async (): Promise<Experience> => {
      const response = await api.get<ApiResponse<Experience>>(
        endpoints.user.viewExperience(id)
      );
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get past experiences
export const usePastExperiences = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'pastExperiences'],
    queryFn: async (): Promise<Experience[]> => {
      const response = await api.get<ApiResponse<Experience[]>>(
        endpoints.user.pastExperienceList
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Update past occupation
export const useUpdatePastOccupation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.updatePastOccupation,
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'pastExperiences'] });
      toast.success('Past occupation updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update past occupation error:', error);
      toast.error(error.message || 'Failed to update past occupation. Please try again.');
    },
  });
};

// Get all documents
export const useDocuments = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'documents'],
    queryFn: async (): Promise<Document[]> => {
      const response = await api.get<ApiResponse<Document[]>>(
        endpoints.user.getAllDocs
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Upload passport
export const useUploadPassport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.uploadPassport,
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
      toast.success('Passport uploaded successfully!');
    },
    onError: (error: any) => {
      console.error('Passport upload error:', error);
      toast.error(error.message || 'Failed to upload passport. Please try again.');
    },
  });
};

// Upload CV
export const useUploadCv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.uploadCv,
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
      toast.success('CV uploaded successfully!');
    },
    onError: (error: any) => {
      console.error('CV upload error:', error);
      toast.error(error.message || 'Failed to upload CV. Please try again.');
    },
  });
};

// Upload COVID certificate
export const useUploadCovidCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.uploadCovid,
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
      toast.success('COVID certificate uploaded successfully!');
    },
    onError: (error: any) => {
      console.error('COVID certificate upload error:', error);
      toast.error(error.message || 'Failed to upload COVID certificate. Please try again.');
    },
  });
};

// Upload driving license
export const useUploadDrivingLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.uploadDrivingLicense,
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
      toast.success('Driving license uploaded successfully!');
    },
    onError: (error: any) => {
      console.error('Driving license upload error:', error);
      toast.error(error.message || 'Failed to upload driving license. Please try again.');
    },
  });
};

// Upload education certificate
export const useUploadEducationCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.uploadEduCertificate,
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
      toast.success('Education certificate uploaded successfully!');
    },
    onError: (error: any) => {
      console.error('Education certificate upload error:', error);
      toast.error(error.message || 'Failed to upload education certificate. Please try again.');
    },
  });
};

// Upload other documents
export const useUploadOtherDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.uploadOtherDocs,
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
      toast.success('Documents uploaded successfully!');
    },
    onError: (error: any) => {
      console.error('Other documents upload error:', error);
      toast.error(error.message || 'Failed to upload documents. Please try again.');
    },
  });
};

// Get passport details
export const usePassportDetails = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'passport'],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse>(
        endpoints.user.viewPassport
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Edit passport
export const useEditPassport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.passportEdit,
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'passport'] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user, 'documents'] });
      toast.success('Passport updated successfully!');
    },
    onError: (error: any) => {
      console.error('Passport edit error:', error);
      toast.error(error.message || 'Failed to update passport. Please try again.');
    },
  });
};

// Edit driving license
export const useEditDrivingLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.editDrivingLicense,
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
      toast.success('Driving license updated successfully!');
    },
    onError: (error: any) => {
      console.error('Driving license edit error:', error);
      toast.error(error.message || 'Failed to update driving license. Please try again.');
    },
  });
};

// Store location
export const useStoreLocation = () => {
  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.storeLocation,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      console.error('Store location error:', error);
    },
  });
};

// Store app use time
export const useStoreAppUseTime = () => {
  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.storeAppUseTime,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      console.error('Store app use time error:', error);
    },
  });
};

// Store user location
export const useStoreUserLocation = () => {
  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.storeUserLocation,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      console.error('Store user location error:', error);
    },
  });
};

// Submit loan form
export const useSubmitLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.submitLoan,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      toast.success('Loan application submitted successfully!');
    },
    onError: (error: any) => {
      console.error('Loan submission error:', error);
      toast.error(error.message || 'Failed to submit loan application. Please try again.');
    },
  });
};

// Submit reference
export const useSubmitReference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.user.addRegistrationSource,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      toast.success('Reference submitted successfully!');
    },
    onError: (error: any) => {
      console.error('Reference submission error:', error);
      toast.error(error.message || 'Failed to submit reference. Please try again.');
    },
  });
};

// Check service status
export const useServiceStatus = () => {
  return useQuery({
    queryKey: [...queryKeys.user, 'serviceStatus'],
    queryFn: async (): Promise<any> => {
      const response = await api.get<ApiResponse>(
        endpoints.user.checkServiceStatus
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

