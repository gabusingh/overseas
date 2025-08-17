import { AxiosError } from 'axios';

export interface ErrorResponse {
  message: string;
  status?: number;
  data?: any;
}

export const handleApiError = (error: unknown): ErrorResponse => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError;
    
    // Network error (no response received)
    if (!axiosError.response) {
      if (axiosError.request) {
        return {
          message: 'Network error: Unable to connect to server. Please check your internet connection.',
          status: 0
        };
      }
      return {
        message: 'Request setup error. Please try again.',
        status: 0
      };
    }

    // Server responded with error status
    const { status, data } = axiosError.response;
    
    switch (status) {
      case 400:
        return {
        message: (data as any)?.message || (data as any)?.error || 'Invalid request. Please check your input and try again.',
          status: 400,
          data
        };
      case 401:
        return {
          message: 'Authentication failed. Please login again.',
          status: 401,
          data
        };
      case 403:
        return {
          message: 'Access denied. You don\'t have permission to perform this action.',
          status: 403,
          data
        };
      case 404:
        return {
          message: 'Resource not found. The requested service may be unavailable.',
          status: 404,
          data
        };
      case 422:
        return {
          message: (data as any)?.message || 'Validation error. Please check your input fields.',
          status: 422,
          data
        };
      case 429:
        return {
          message: 'Too many requests. Please wait a moment and try again.',
          status: 429,
          data
        };
      case 500:
        return {
          message: 'Internal server error. Please try again later.',
          status: 500,
          data
        };
      case 502:
        return {
          message: 'Server temporarily unavailable. Please try again in a few minutes.',
          status: 502,
          data
        };
      case 503:
        return {
          message: 'Service temporarily unavailable. Please try again later.',
          status: 503,
          data
        };
      default:
        return {
          message: (data as any)?.message || `Server error (${status}). Please try again.`,
          status,
          data
        };
    }
  }
  
  // Handle other types of errors
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred. Please try again.',
      status: 0
    };
  }
  
  return {
    message: 'An unknown error occurred. Please try again.',
    status: 0
  };
};

export const getValidationErrors = (error: ErrorResponse): Record<string, string[]> => {
  if (error.status === 422 && error.data?.errors) {
    return error.data.errors;
  }
  return {};
};

export const isNetworkError = (error: ErrorResponse): boolean => {
  return error.status === 0;
};

export const isAuthError = (error: ErrorResponse): boolean => {
  return error.status === 401;
};

export const isValidationError = (error: ErrorResponse): boolean => {
  return error.status === 422;
};
