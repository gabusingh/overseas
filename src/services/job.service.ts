import axios from 'axios';
import { getJobsPostedByHra, getEnhancedHrDetails, HrDetails } from './hra.service';

const BASE_URL = 'https://backend.overseas.ai/api/';

interface Job {
  id: number;
  title?: string;
  job_title?: string;
  location?: string;
  country?: string;
  description?: string;
  department?: string;
  company?: string;
}

export interface JobDetail {
  id: number;
  jobOccupation_id: string;
  jobID: string;
  jobCreatedBy: string;
  jobTitle: string;
  cmpNameACT?: string;
  jobVacancyNo: string;
  jobOccupation: string;
  jobOccupation_hi: string;
  jobOccupation_bn: string;
  jobMode: string;
  jobInterviewDate?: string;
  jobInterviewPlace?: string;
  jobWorkingDay: string;
  jobWages?: number;
  jobWagesCurrencyType?: string;
  jobLocationCountry?: {
    name: string;
    countryFlag: string;
  };
  jobPhoto?: string;
  jobDeadline?: string;
  jobExpTypeReq?: string;
  jobAgeLimit?: string;
  passportType?: string;
  jobDescription?: string;
  jobAccommodation?: string;
  jobFood?: string;
  jobOvertime?: string;
  jobWorkingHour?: string;
  companyName?: string;
  cmpName?: string;
  skills?: Array<{
    id: number;
    skill: string;
  }>;
  created_at?: string;
  appliedStatus?: boolean;
  isWishListed?: boolean;
  totalAppliedCandidates?: number;
  contract_period?: string;
  required_documents?: string[];
  jobPublishedDate?: string;
  salary_negotiable?: boolean;
}

interface JobListResponse {
  jobs?: Job[];
  data?: Job[];
  totalJobs?: number;
  currentPage?: number;
  lastPage?: number;
  perPage?: number;
}

interface JobDetailResponse {
  jobs: JobDetail;
}


export const getJobList = async (payload: FormData): Promise<JobListResponse> => {
  try {
    // Let axios set the proper multipart boundary automatically
    const response = await axios.post(BASE_URL + "filter-all-jobs", payload);
    return response.data;
  } catch (error: any) {
    
    // Handle 500 errors gracefully
    if (error?.response?.status === 500) {
      // Return empty but valid response structure
      return {
        jobs: [],
        totalJobs: 0,
        currentPage: 1,
        lastPage: 1,
        perPage: 10
      };
    }
    
    throw error;
  }
};

// Helper function to get HR user ID from localStorage
const getHrUserIdFromStorage = (): string | null => {
  try {
    const loggedUser = localStorage.getItem("loggedUser");
    const userSimple = localStorage.getItem("user");
    
    if (loggedUser) {
      const userData = JSON.parse(loggedUser);
      
      // Try different possible ID fields for HR users
      const hrId = userData?.user?.id || 
                   userData?.cmpData?.id || 
                   userData?.id || 
                   userData?.hrId || 
                   userData?.empId ||
                   userData?.user?.empId ||
                   userData?.cmpData?.empId;
      
      if (hrId) {
        return hrId.toString();
      }
    }
    
    if (userSimple) {
      const userSimpleData = JSON.parse(userSimple);
      const hrId = userSimpleData?.id;
      
      if (hrId) {
        return hrId.toString();
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Helper function to get user type from localStorage
const getUserTypeFromStorage = (): string | null => {
  try {
    const loggedUser = localStorage.getItem("loggedUser");
    const userSimple = localStorage.getItem("user");
    
    if (loggedUser) {
      const userData = JSON.parse(loggedUser);
      return userData?.user?.type || userData?.type;
    }
    
    if (userSimple) {
      const userSimpleData = JSON.parse(userSimple);
      return userSimpleData?.type;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Enhanced interface for user-aware job list response
interface EnhancedJobListResponse extends JobListResponse {
  hrDetails?: HrDetails | null;
  companyInfo?: {
    name: string;
    logo?: string;
    id: number;
  };
}

// User-aware job listing function with HR details enhancement
export const getUserAwareJobList = async (payload: FormData): Promise<EnhancedJobListResponse> => {
  try {
    const userType = getUserTypeFromStorage();
    
    // Always show all jobs regardless of user type
    // Previously this function filtered jobs for HR users to show only their posted jobs
    // Now HR users will see all available jobs just like candidates
    
    const regularResponse = await getJobList(payload);
    
    // Optionally enhance with HR details if user is HR (for UI purposes only)
    let hrDetails: HrDetails | null = null;
    if (userType === 'company') {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          hrDetails = await getEnhancedHrDetails(token);
        } catch (detailsError) {
          // Silently handle error
        }
      }
    }
    
    return {
      ...regularResponse,
      hrDetails: hrDetails,
      companyInfo: hrDetails?.cmpData ? {
        name: hrDetails.cmpData.cmpName,
        logo: hrDetails.cmpData.cmpLogoS3,
        id: hrDetails.cmpData.id
      } : undefined
    };
    
  } catch (error) {
    // Fallback to regular job list on error
    const fallbackResponse = await getJobList(payload);
    return {
      ...fallbackResponse,
      hrDetails: null,
      companyInfo: undefined
    };
  }
};

export const getJobListForSearch = async (payload: object = {}): Promise<JobListResponse> => {
  try {
    const response = await axios.post(BASE_URL + "search-all-jobs", payload, {
      headers: {
        'Content-Type': `multipart/form-data`,
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to search jobs by search key (from legacy)
export const searchJobsByKey = async (searchKey: string | FormData): Promise<JobListResponse> => {
  try {
    let payload: any;
    let headers: any = {};
    
    if (typeof searchKey === 'string') {
      payload = {
        searchKey: searchKey.replace(/-/g, ' ')
      };
      headers = {
        'Content-Type': 'application/json',
      };
    } else {
      payload = searchKey;
      headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    
    const response = await axios.post(BASE_URL + "search-all-jobs", payload, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get jobs by search result (from legacy)
export const getSearchResult = async (occuId: number, countryId: number) => {
  try {
    const response = await axios.post(BASE_URL + `jobs-by-department-by-country`, {
      occuId, 
      countryId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getThisWeekJob = async (payload: FormData): Promise<JobListResponse> => {
  try {
    const response = await axios.post(BASE_URL + "last-week-jobs", payload, {
      headers: {
        'Content-Type': `multipart/form-data`,
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOccupations = async () => {
  try {
    const response = await axios.get(BASE_URL + 'get-occupations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSkill = async () => {
  try {
    const response = await axios.post(BASE_URL + 'get-skills');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobByDepartment = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + 'occupation-wise-jobs/' + id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getJobByCountry = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + 'country-wise-jobs/' + id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getJobById = async (id: string | number): Promise<any> => {
  try {
    const response = await axios.get(BASE_URL + 'getJobs/' + id);
    return response;
  } catch (error) {
    throw error;
  }
};



export const applyJobApi = async (payload: any, accessToken: string) => {
  try {
    // Convert payload to FormData if it's not already
    let formData: FormData;
    if (payload instanceof FormData) {
      formData = payload;
    } else {
      formData = new FormData();
      formData.append('id', payload.id);
      formData.append('apply-job', payload['apply-job'] || '');
    }
    
    const response = await axios.post(BASE_URL + `apply-job-r`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const appliedJobList = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `user-applied-job-list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const appliedJobById = async (id: number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `user-applied-job-list/` + id, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInterviewById = async (id: number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `interview-status-for-emp/` + id, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const favouriteJobList = async (accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + `user-favourite-job-list`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const saveJobById = async (jobId: number, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + `save-job-by-user`, { jobId }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const userSavedJobsList = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `user-saved-job-list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Deprecated: Use getLatestJobsSafe instead for better error handling
export const getLatestJobs = async () => {
  return getLatestJobsSafe();
};

// Safe version that doesn't throw on authentication errors
// Use this for unauthenticated users (like home page visitors)
export const getLatestJobsSafe = async () => {
  try {
    const response = await axios.get(BASE_URL + 'get-latest-jobs');
    return response.data;
  } catch (error: any) {
    // Handle authentication errors gracefully
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return null; // Return null instead of throwing for auth errors
    }
    
    // Handle server errors gracefully
    if (error?.response?.status >= 500) {
      return null;
    }
    
    // Return null for any other errors
    return null;
  }
};
export const getRelatedJobs = async (jobId: number) => {
  try {
    const response = await axios.get(BASE_URL + 'get-related-jobs', {
      params: { jobId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const jobQuery = async (formData: FormData) => {
  try {
    const response = await axios.post(BASE_URL + 'job-query', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobsByCountryByDepartment = async (countryId: number, departmentId: number) => {
  try {
    const response = await axios.post(BASE_URL + 'get-jobs-by-country-by-department', {
      countryId,
      departmentId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Additional missing APIs from legacy code
export const getAppliedJobs = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'user-applied-job-list', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSavedJobs = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'user-saved-job-list', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const removeSavedJob = async (jobId: number, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'remove-saved-job', { jobId }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCompanies = async (page: number = 1) => {
  try {
    const response = await axios.get(BASE_URL + 'get-companies', {
      params: { page }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCompanyById = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + 'company/' + id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const searchJobs = async (searchParams: any) => {
  try {
    const response = await axios.post(BASE_URL + 'search-jobs', searchParams);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getJobStatistics = async () => {
  try {
    const response = await axios.get(BASE_URL + 'job-statistics');
    return response;
  } catch (error) {
    throw error;
  }
};
