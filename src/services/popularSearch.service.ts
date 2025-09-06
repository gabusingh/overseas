import { getJobList, JobDetail, getLatestJobsSafe } from './job.service';
import { getOccupations } from './info.service';

interface PopularSearchItem {
  id: number;
  label: string;
  value: number;
  searchCount: number;
  category: string;
  img: string;
  lastUpdated?: string;
}

interface KeywordFrequency {
  [key: string]: {
    count: number;
    category: string;
    jobIds: number[];
  };
}

// Cache for popular search results
interface PopularSearchCache {
  data: PopularSearchItem[];
  timestamp: number;
  jobCount: number;
}

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache
let popularSearchCache: PopularSearchCache | null = null;

/**
 * Fetch comprehensive job data from multiple sources for analysis
 */
async function getAllJobsForAnalysis(): Promise<any[]> {
  try {
    let allJobs: any[] = [];
    
    // Strategy 1: Get multiple pages from main job API
    try {
      const maxPagesToFetch = 5; // Fetch first 5 pages
      
      for (let page = 1; page <= maxPagesToFetch; page++) {
        const formData = new FormData();
        formData.append('page', page.toString());
        formData.append('per_page', '50'); // Request more items per page
        
        try {
          const jobResponse = await getJobList(formData);
          let pageJobs: any[] = [];
          
          if (jobResponse?.jobs) {
            pageJobs = jobResponse.jobs;
          } else if (jobResponse?.data) {
            pageJobs = jobResponse.data;
          } else if (Array.isArray(jobResponse)) {
            pageJobs = jobResponse;
          }
          
          if (pageJobs.length > 0) {
            allJobs.push(...pageJobs);
          } else {
            break; // No more jobs available
          }
          
          // If we got less than expected, we've reached the end
          if (pageJobs.length < 50) {
            break;
          }
          
        } catch (pageError: any) {
          break; // Stop on error
        }
        
        // Small delay between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      // Continue to supplement strategy
    }
    
    // Strategy 2: Supplement with latest jobs API if available (skip if authentication issues)
    try {
      const latestJobsResponse = await getLatestJobsSafe();
      
      let latestJobs: any[] = [];
      if (latestJobsResponse === null) {
        // Latest jobs API skipped due to authentication requirements
      } else if (latestJobsResponse?.jobs) {
        latestJobs = latestJobsResponse.jobs;
      } else if (latestJobsResponse?.data) {
        latestJobs = latestJobsResponse.data;
      } else if (Array.isArray(latestJobsResponse)) {
        latestJobs = latestJobsResponse;
      }
      
      if (latestJobs.length > 0) {
        // Merge latest jobs, avoiding duplicates
        const existingJobIds = new Set(allJobs.map(job => job.id || job.jobId));
        const newLatestJobs = latestJobs.filter(job => {
          const jobId = job.id || job.jobId;
          return jobId && !existingJobIds.has(jobId);
        });
        
        allJobs.push(...newLatestJobs);
      }
      
    } catch (error: any) {
      // Continue without latest jobs - this is not critical for popular search
    }
    
    // Remove duplicates based on job ID
    const uniqueJobs = allJobs.reduce((unique, job) => {
      const jobId = job.id || job.jobId || `temp_${unique.length}`;
      const existingJob = unique.find(u => (u.id || u.jobId) === jobId);
      if (!existingJob) {
        unique.push(job);
      }
      return unique;
    }, [] as any[]);
    
    // Continue with analysis regardless of job count
    
    return uniqueJobs;
    
  } catch (error) {
    return [];
  }
}

/**
 * Extract popular keywords from job data
 */
export const getPopularSearchKeywords = async (limit: number = 6): Promise<PopularSearchItem[]> => {
  try {
    // Check cache first
    if (popularSearchCache && 
        Date.now() - popularSearchCache.timestamp < CACHE_DURATION && 
        popularSearchCache.data.length > 0) {
      return popularSearchCache.data.slice(0, limit);
    }
    
    // Get comprehensive job data from multiple sources
    const jobs = await getAllJobsForAnalysis();

    if (jobs.length === 0) {
      return await getFallbackPopularSearches(limit);
    }

    // Extract and count keywords
    const keywordFrequency: KeywordFrequency = {};
    
    jobs.forEach((job: any, index: number) => {
      const jobId = job.id || job.jobId || index;
      
      // Extract from job titles
      const jobTitle = job.jobTitle || job.title || job.job_title || job.jobOccupation;
      if (jobTitle && typeof jobTitle === 'string') {
        const cleanTitle = cleanJobTitle(jobTitle);
        if (cleanTitle) {
          addKeyword(keywordFrequency, cleanTitle, 'job_title', jobId);
        }
      }

      // Extract from job occupation
      const occupation = job.jobOccupation || job.occupation || job.department;
      if (occupation && typeof occupation === 'string' && occupation !== jobTitle) {
        const cleanOccupation = cleanJobTitle(occupation);
        if (cleanOccupation) {
          addKeyword(keywordFrequency, cleanOccupation, 'occupation', jobId);
        }
      }

      // Extract from skills
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach((skill: any) => {
          const skillName = skill.skill || skill.name;
          if (skillName && typeof skillName === 'string') {
            const cleanSkill = cleanJobTitle(skillName);
            if (cleanSkill) {
              addKeyword(keywordFrequency, cleanSkill, 'skill', jobId);
            }
          }
        });
      }

      // Extract from company names (as employer keywords)
      const company = job.companyName || job.cmpName || job.company;
      if (company && typeof company === 'string') {
        const cleanCompany = cleanJobTitle(company);
        if (cleanCompany && cleanCompany.length > 2) {
          addKeyword(keywordFrequency, cleanCompany, 'company', jobId);
        }
      }
    });

    // Convert to popular search format and sort by frequency
    // Only include keywords that appear in at least 2 jobs for better relevance
    const minOccurrences = Math.max(1, Math.floor(jobs.length / 100)); // Dynamic threshold based on job count
    
    const popularSearches: PopularSearchItem[] = Object.entries(keywordFrequency)
      .filter(([keyword, data]) => data.count >= minOccurrences) // Filter out rare keywords
      .map(([keyword, data], index) => ({
        id: index + 1,
        label: keyword,
        value: index + 1,
        searchCount: data.count,
        category: data.category,
        img: '/images/institute.png',
        lastUpdated: new Date().toISOString()
      }))
      .sort((a, b) => b.searchCount - a.searchCount)
      .slice(0, limit);

    // If we don't have enough keywords, supplement with occupation data
    if (popularSearches.length < limit) {
      const occupationSearches = await getFallbackPopularSearches(limit - popularSearches.length);
      popularSearches.push(...occupationSearches.filter(occ => 
        !popularSearches.some(pop => pop.label.toLowerCase() === occ.label.toLowerCase())
      ));
    }
    
    // Cache the results for future use
    popularSearchCache = {
      data: popularSearches,
      timestamp: Date.now(),
      jobCount: jobs.length
    };
    
    return popularSearches.slice(0, limit);

  } catch (error) {
    return await getFallbackPopularSearches(limit);
  }
};

/**
 * Clean and normalize job titles/keywords
 */
function cleanJobTitle(title: string): string | null {
  if (!title || typeof title !== 'string') return null;
  
  // Remove common prefixes/suffixes that don't add search value
  let cleaned = title
    .trim()
    .replace(/^(job|position|role|work|employment)\s+/gi, '')
    .replace(/\s+(job|position|role|work|employment)$/gi, '')
    .replace(/^(urgent|immediate|hiring)\s+/gi, '')
    .replace(/\s+(urgent|immediate|hiring)$/gi, '')
    .replace(/^\d+\s+/, '') // Remove leading numbers
    .replace(/\s+\d+$/, '') // Remove trailing numbers
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Filter out very short or very long titles
  if (cleaned.length < 3 || cleaned.length > 50) return null;
  
  // Filter out common non-specific terms
  const stopWords = ['job', 'work', 'employment', 'position', 'role', 'hiring', 'urgent', 'immediate', 'required', 'needed', 'vacancy'];
  if (stopWords.includes(cleaned.toLowerCase())) return null;
  
  // Capitalize first letter of each word for consistency
  return cleaned.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Add a keyword to frequency tracking
 */
function addKeyword(keywordFreq: KeywordFrequency, keyword: string, category: string, jobId: number) {
  if (!keywordFreq[keyword]) {
    keywordFreq[keyword] = {
      count: 0,
      category,
      jobIds: []
    };
  }
  keywordFreq[keyword].count++;
  keywordFreq[keyword].jobIds.push(jobId);
}

/**
 * Fallback popular searches from occupation data
 */
async function getFallbackPopularSearches(limit: number): Promise<PopularSearchItem[]> {
  try {
    const occupationResponse = await getOccupations();
    const occupations = occupationResponse?.data || occupationResponse?.occupation || [];
    
    if (occupations.length > 0) {
      return occupations
        .slice(0, limit * 2)
        .map((occupation: any, index: number) => ({
          id: occupation.id || index + 1,
          label: occupation.title || occupation.name || occupation.occupation || 'Unknown',
          value: occupation.id || index + 1,
          searchCount: Math.floor(Math.random() * 300) + 50, // Simulated search count
          category: 'occupation',
          img: '/images/institute.png',
          lastUpdated: new Date().toISOString()
        }))
        .filter(item => item.label !== 'Unknown' && item.label.length > 2)
        .sort((a, b) => b.searchCount - a.searchCount)
        .slice(0, limit);
    }
  } catch (error) {
    // Continue to ultimate fallback
  }

  // Ultimate fallback with realistic job keywords
  return [
    { id: 1, label: "Construction Worker", value: 1, searchCount: 450, category: "construction", img: "/images/institute.png" },
    { id: 2, label: "Electrician", value: 2, searchCount: 380, category: "technical", img: "/images/institute.png" },
    { id: 3, label: "Plumber", value: 3, searchCount: 340, category: "technical", img: "/images/institute.png" },
    { id: 4, label: "Cook", value: 4, searchCount: 320, category: "hospitality", img: "/images/institute.png" },
    { id: 5, label: "Driver", value: 5, searchCount: 300, category: "transportation", img: "/images/institute.png" },
    { id: 6, label: "Security Guard", value: 6, searchCount: 280, category: "security", img: "/images/institute.png" },
    { id: 7, label: "Cleaner", value: 7, searchCount: 260, category: "services", img: "/images/institute.png" },
    { id: 8, label: "Waiter", value: 8, searchCount: 240, category: "hospitality", img: "/images/institute.png" }
  ].slice(0, limit);
}

/**
 * Track search queries (for future analytics)
 */
export const trackSearchQuery = async (searchKeyword: string, userId?: string): Promise<void> => {
  try {
    // Store in localStorage for future analytics (optional)
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    searchHistory.push({
      keyword: searchKeyword,
      timestamp: new Date().toISOString(),
      userId: userId || null
    });
    
    // Keep only last 100 searches to prevent localStorage bloat
    if (searchHistory.length > 100) {
      searchHistory.splice(0, searchHistory.length - 100);
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
  } catch (error) {
    // Silent fail
  }
};

/**
 * Get search suggestions based on partial input
 */
export const getSearchSuggestions = async (partialKeyword: string, limit: number = 5): Promise<string[]> => {
  try {
    if (!partialKeyword || partialKeyword.length < 2) return [];
    
    const popularSearches = await getPopularSearchKeywords(20); // Get more for better matching
    
    return popularSearches
      .filter(item => item.label.toLowerCase().includes(partialKeyword.toLowerCase()))
      .sort((a, b) => b.searchCount - a.searchCount)
      .slice(0, limit)
      .map(item => item.label);
      
  } catch (error) {
    return [];
  }
};

/**
 * Clear the popular search cache (useful for testing or forced refresh)
 */
export const clearPopularSearchCache = (): void => {
  popularSearchCache = null;
};

/**
 * Get cache status for debugging
 */
export const getPopularSearchCacheStatus = (): { cached: boolean; age?: number; jobCount?: number } => {
  if (!popularSearchCache) {
    return { cached: false };
  }
  
  const age = Date.now() - popularSearchCache.timestamp;
  const isValid = age < CACHE_DURATION;
  
  return {
    cached: isValid,
    age: Math.floor(age / 1000), // Age in seconds
    jobCount: popularSearchCache.jobCount
  };
};

export default {
  getPopularSearchKeywords,
  trackSearchQuery,
  getSearchSuggestions,
  clearPopularSearchCache,
  getPopularSearchCacheStatus
};
