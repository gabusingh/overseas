/**
 * Authentication utilities for safer API calls
 * Simple, non-complicated approach to check user auth status
 */

/**
 * Check if user is authenticated (has valid token)
 * Simple check - no complex token validation
 */
export const isUserAuthenticated = (): boolean => {
  try {
    if (typeof window === 'undefined') return false; // SSR safety
    
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('token');
    
    return !!token && token.trim().length > 0;
  } catch {
    return false; // Safe fallback
  }
};

/**
 * Get auth token safely
 */
export const getAuthToken = (): string | null => {
  try {
    if (typeof window === 'undefined') return null; // SSR safety
    
    return localStorage.getItem('accessToken') || 
           localStorage.getItem('authToken') || 
           localStorage.getItem('token') ||
           null;
  } catch {
    return null; // Safe fallback
  }
};

/**
 * Safe wrapper for API calls that might require authentication
 * Returns null instead of throwing on auth errors
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  options: {
    requiresAuth?: boolean;
    fallbackValue?: T | null;
    description?: string;
  } = {}
): Promise<T | null> => {
  const { 
    requiresAuth = false, 
    fallbackValue = null, 
    description = 'API call' 
  } = options;

  try {
    // Skip API call if authentication is required but user is not authenticated
    if (requiresAuth && !isUserAuthenticated()) {
      return fallbackValue;
    }

    return await apiCall();
  } catch (error: any) {
    // Handle authentication errors gracefully
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return fallbackValue;
    }

    // Handle server errors gracefully
    if (error?.response?.status >= 500) {
      return fallbackValue;
    }

    // For unexpected errors, log and return fallback instead of throwing
    console.error(`Error during ${description}:`, error);
    return fallbackValue;
  }
};

export default {
  isUserAuthenticated,
  getAuthToken,
  safeApiCall
};
