import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { handleApiError } from '../../utils/errorHandler';

const BASE_URL = 'https://backend.overseas.ai/api/';

// Enhanced axios instance with better token management
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management utilities
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
};

export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  localStorage.removeItem('loggedUser');
};

// Request interceptor for automatic token injection
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    const separator = config.url?.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}_t=${timestamp}`;

    // Automatically inject auth token if available
    const token = getAuthToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Log errors in development with reduced spam for known issues
    if (process.env.NODE_ENV === 'development') {
      // Reduce spam for known 404 endpoints that we handle gracefully
      if (error.response?.status === 404 && error.config?.url?.includes('get-emp-data-for-edit')) {
        console.info(`ℹ️ ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url} (expected for new users - using fallback data)`);
      } else {
        console.error(`❌ ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error);
      }
    }

    // Handle authentication errors globally
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      clearAuthToken();
      
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Convert AxiosError to our standardized error format
    const standardError = handleApiError(error);
    
    // Create a new error object with our standardized format
    const enhancedError = new Error(standardError.message) as any;
    enhancedError.status = standardError.status;
    enhancedError.data = standardError.data;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  }
);

// Typed request methods for better type safety
export interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean; // Skip automatic token injection
}

export const api = {
  get: <T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get(url, config);
  },

  post: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post(url, data, config);
  },

  put: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put(url, data, config);
  },

  delete: <T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete(url, config);
  },

  patch: <T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch(url, data, config);
  },
};

// Utility functions for different content types
export const createFormDataRequest = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
};

export const createJsonRequest = (data: any): string => {
  return JSON.stringify(data);
};

// Enhanced request methods with retry logic (keeping for backward compatibility)
export const apiRequest = {
  get: async (url: string, token?: string, retries = 2) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    for (let i = 0; i <= retries; i++) {
      try {
        return await apiClient.get(url, config);
      } catch (error: any) {
        if (i === retries || error.status === 401 || error.status === 403) {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  },

  post: async (url: string, data: any, token?: string, contentType?: string, retries = 1) => {
    const headers: any = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    } else if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    const config = { headers };
    
    for (let i = 0; i <= retries; i++) {
      try {
        return await apiClient.post(url, data, config);
      } catch (error: any) {
        if (i === retries || error.status === 401 || error.status === 403 || error.status === 422) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  },

  put: async (url: string, data: any, token?: string, contentType?: string) => {
    const headers: any = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    } else if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    return await apiClient.put(url, data, { headers });
  },

  delete: async (url: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return await apiClient.delete(url, config);
  }
};

export default apiClient;

