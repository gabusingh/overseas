import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { 
  LoginRequest, 
  OtpRequest, 
  OtpLoginRequest, 
  SignupRequest, 
  UserWithToken,
  ApiResponse,
  queryKeys 
} from '../../lib/api/types';
import { setAuthToken, clearAuthToken } from '../../lib/api/client';
import { toast } from 'sonner';

// Login with password
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<UserWithToken> => {
      const response = await api.post<ApiResponse<UserWithToken>>(
        endpoints.auth.passwordLogin,
        credentials
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Store token and user data
      setAuthToken(data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('loggedUser', JSON.stringify(data));
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
};

// Request OTP for login
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: async (data: OtpRequest): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.auth.otpRequest,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('OTP sent to your phone number');
    },
    onError: (error: any) => {
      console.error('OTP request error:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    },
  });
};

// Login with OTP
export const useOtpLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: OtpLoginRequest): Promise<UserWithToken> => {
      const response = await api.post<ApiResponse<UserWithToken>>(
        endpoints.auth.otpLogin,
        credentials
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Store token and user data
      setAuthToken(data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('loggedUser', JSON.stringify(data));
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      console.error('OTP login error:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
    },
  });
};

// Signup - get OTP
export const useSignupOtp = () => {
  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.auth.getOtp,
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
      toast.success('OTP sent to your phone number');
    },
    onError: (error: any) => {
      console.error('Signup OTP error:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    },
  });
};

// Verify OTP for signup
export const useVerifySignupOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData): Promise<UserWithToken> => {
      const response = await api.post<ApiResponse<UserWithToken>>(
        endpoints.auth.registerPersonStep1,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Store token and user data
      setAuthToken(data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('loggedUser', JSON.stringify(data));
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      console.error('Signup verification error:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
    },
  });
};

// Get email OTP
export const useEmailOtp = () => {
  return useMutation({
    mutationFn: async (data: FormData): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>(
        endpoints.auth.getEmailOtp,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('OTP sent to your email address');
    },
    onError: (error: any) => {
      console.error('Email OTP error:', error);
      toast.error(error.message || 'Failed to send OTP to email. Please try again.');
    },
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await api.post(endpoints.auth.logout, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn('Logout API call failed:', error);
        }
      }
    },
    onSuccess: () => {
      // Clear all stored data
      clearAuthToken();
      
      // Clear all queries from cache
      queryClient.clear();
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      toast.success('Logged out successfully');
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
      clearAuthToken();
      queryClient.clear();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });
};

// Check if user is authenticated
export const useAuthStatus = () => {
  return useQuery({
    queryKey: [...queryKeys.auth, 'status'],
    queryFn: () => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        return null;
      }
      
      try {
        const parsedUser = JSON.parse(user);
        return {
          isAuthenticated: true,
          user: parsedUser,
          token,
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get current user data
export const useCurrentUser = () => {
  const { data: authStatus } = useAuthStatus();
  
  return {
    user: authStatus?.user || null,
    isAuthenticated: authStatus?.isAuthenticated || false,
    token: authStatus?.token || null,
  };
};

