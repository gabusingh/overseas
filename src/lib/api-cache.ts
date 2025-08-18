// API Cache and Rate Limiting Utility
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface RateLimitInfo {
  lastRequest: number;
  requestCount: number;
  windowStart: number;
}

class ApiCache {
  private cache = new Map<string, CacheItem<any>>();
  private rateLimits = new Map<string, RateLimitInfo>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS_PER_WINDOW = 10; // Max 10 requests per minute

  private getCacheKey(endpoint: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}${paramString}`;
  }

  private isRateLimited(endpoint: string): boolean {
    const now = Date.now();
    const rateLimit = this.rateLimits.get(endpoint);

    if (!rateLimit) {
      this.rateLimits.set(endpoint, {
        lastRequest: now,
        requestCount: 1,
        windowStart: now
      });
      return false;
    }

    // Reset window if expired
    if (now - rateLimit.windowStart > this.RATE_LIMIT_WINDOW) {
      this.rateLimits.set(endpoint, {
        lastRequest: now,
        requestCount: 1,
        windowStart: now
      });
      return false;
    }

    // Check if within rate limit
    if (rateLimit.requestCount >= this.MAX_REQUESTS_PER_WINDOW) {
      return true;
    }

    // Update rate limit info
    this.rateLimits.set(endpoint, {
      lastRequest: now,
      requestCount: rateLimit.requestCount + 1,
      windowStart: rateLimit.windowStart
    });

    return false;
  }

  private getCachedData<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private setCachedData<T>(key: string, data: T): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    });
  }

  async request<T>(
    endpoint: string,
    requestFn: () => Promise<T>,
    params?: any
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);

    // Check cache first
    const cachedData = this.getCachedData<T>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${endpoint}`);
      return cachedData;
    }

    // Check rate limit
    if (this.isRateLimited(endpoint)) {
      console.warn(`Rate limited for ${endpoint}, using cached data if available`);
      const staleData = this.getCachedData<T>(cacheKey);
      if (staleData) {
        return staleData;
      }
      throw new Error(`Rate limited for ${endpoint}. Please try again later.`);
    }

    try {
      console.log(`Making API request to ${endpoint}`);
      const data = await requestFn();
      
      // Cache the successful response
      this.setCachedData(cacheKey, data);
      
      return data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn(`429 error for ${endpoint}, using cached data if available`);
        const staleData = this.getCachedData<T>(cacheKey);
        if (staleData) {
          return staleData;
        }
      }
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearRateLimits(): void {
    this.rateLimits.clear();
  }
}

export const apiCache = new ApiCache();
