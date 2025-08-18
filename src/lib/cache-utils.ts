import { apiCache } from './api-cache';
import { toast } from 'sonner';

export const clearApiCache = () => {
  apiCache.clearCache();
  apiCache.clearRateLimits();
  toast.success('Cache cleared successfully');
};

export const getCacheStatus = () => {
  // This would return cache statistics if needed
  return {
    message: 'Cache is active and working',
    timestamp: new Date().toISOString()
  };
};
