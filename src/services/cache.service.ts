interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes
  private readonly LONG_EXPIRY = 30 * 60 * 1000; // 30 minutes

  // Set cache with custom expiry
  set<T>(key: string, data: T, expiry: number = this.DEFAULT_EXPIRY): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  // Get cached data if not expired
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.expiry) {
      // Data expired, remove from cache
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Check if data exists and is valid
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Clear specific cache key
  clear(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
  }

  // Get cache stats
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Specific cache keys for our application
  static readonly KEYS = {
    ALL_COURSES: 'all_courses',
    ALL_INSTITUTES: 'all_institutes',
    COURSE_DETAILS: (id: string) => `course_${id}`,
    INSTITUTE_DETAILS: (id: string) => `institute_${id}`,
    INSTITUTE_COURSES: (id: string) => `institute_courses_${id}`,
  };

  // Cache expiry times
  static readonly EXPIRY = {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 15 * 60 * 1000, // 15 minutes
    LONG: 30 * 60 * 1000, // 30 minutes
  };
}

// Create singleton instance
export const cacheService = new CacheService();

// Helper functions for common caching patterns
export const withCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  expiry: number = CacheService.EXPIRY.MEDIUM
): Promise<T> => {
  // Try to get from cache first
  const cached = cacheService.get<T>(key);
  if (cached) {
    console.log(`📦 Cache hit for key: ${key}`);
    return cached;
  }

  console.log(`🔄 Cache miss for key: ${key}, fetching fresh data...`);
  
  // Fetch fresh data
  const freshData = await fetchFn();
  
  // Store in cache
  cacheService.set(key, freshData, expiry);
  
  return freshData;
};

export default cacheService;
