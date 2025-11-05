/**
 * Reusable API helper functions for consistent API calls
 * These functions standardize data handling and reduce code duplication
 */

import { api } from './client';
import { endpoints } from './endpoints';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

// In-flight request cache to prevent duplicate simultaneous calls
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Creates a cache key from endpoint and params
 */
function createCacheKey(endpoint: string, params?: any): string {
  if (!params) return endpoint;
  const sortedParams = JSON.stringify(params, Object.keys(params).sort());
  return `${endpoint}:${sortedParams}`;
}

/**
 * Standardized GET request with automatic token injection
 * Includes request deduplication for identical in-flight requests
 * Returns the full axios response structure to maintain backward compatibility
 */
export async function makeGetRequest<T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const cacheKey = createCacheKey(endpoint, config?.params);
  
  // Check if same request is already in flight
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const requestPromise = api.get<T>(endpoint, config)
    .then(response => {
      // Return full axios response to maintain backward compatibility
      // Callers expect response.data or response.data.jobs structure
      inFlightRequests.delete(cacheKey);
      return response;
    })
    .catch(error => {
      inFlightRequests.delete(cacheKey);
      throw error;
    });

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

/**
 * Standardized FormData POST request with automatic token injection
 * Returns the full axios response structure to maintain backward compatibility
 */
export async function makeFormDataRequest<T = any>(
  endpoint: string,
  data: FormData,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const response = await api.post<T>(endpoint, data, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config?.headers,
    },
  });
  
  // Return full axios response to maintain backward compatibility
  return response;
}

/**
 * Standardized JSON POST request with automatic token injection
 * Returns the full axios response structure to maintain backward compatibility
 */
export async function makeJsonRequest<T = any>(
  endpoint: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const response = await api.post<T>(endpoint, data, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  });
  
  // Return full axios response to maintain backward compatibility
  return response;
}

/**
 * Standardized PUT request with automatic token injection
 * Returns the full axios response structure to maintain backward compatibility
 */
export async function makePutRequest<T = any>(
  endpoint: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const isFormData = data instanceof FormData;
  const response = await api.put<T>(endpoint, data, {
    ...config,
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      ...config?.headers,
    },
  });
  
  // Return full axios response to maintain backward compatibility
  return response;
}

/**
 * Standardized DELETE request with automatic token injection
 * Returns the full axios response structure to maintain backward compatibility
 */
export async function makeDeleteRequest<T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const response = await api.delete<T>(endpoint, config);
  
  // Return full axios response to maintain backward compatibility
  return response;
}

/**
 * Creates FormData from a plain object
 * Handles arrays, files, and nested objects properly
 */
export function createFormDataFromObject(data: Record<string, any>): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(`${key}[${index}]`, String(item));
          }
        });
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
}

/**
 * Export endpoints for convenience
 */
export { endpoints };

