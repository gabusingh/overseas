import axios, { AxiosResponse, AxiosError } from 'axios';
import { handleApiError } from './errorHandler';

const BASE_URL = 'https://backend.overseas.ai/api/';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    const separator = config.url?.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}_t=${timestamp}`;

    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      }
    return response;
  },
  (error: AxiosError) => {
    // Log errors in development with reduced spam for known issues
    if (process.env.NODE_ENV === 'development') {
      // Reduce spam for known 404 endpoints that we handle gracefully
      if (error.response?.status === 404 && error.config?.url?.includes('get-emp-data-for-edit')) {
        } else {
        }
    }

    // Handle authentication errors globally
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
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

// Utility functions for different content types
export const createFormDataRequest = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  return formData;
};

export const createJsonRequest = (data: any) => {
  return JSON.stringify(data);
};

// Enhanced request methods with retry logic
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
