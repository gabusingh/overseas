import axios from 'axios';

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
  } catch (error) {
    console.error("Error posting data:", error);
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
                   userData?.empId;
      
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
    console.error('Error extracting HR user ID:', error);
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
    console.error('Error extracting user type:', error);
    return null;
  }
};

// Import the HR service functions
import { getJobsPostedByHra, getEnhancedHrDetails, HrDetails } from './hra.service';

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
    console.log('User type detected for job listing:', userType);
    
    // If user is HR/company, show only their posted jobs with enhanced details
    if (userType === 'company') {
      const token = localStorage.getItem("access_token");
      const hrUserId = getHrUserIdFromStorage();
      
      if (token && hrUserId) {
        console.log('Fetching jobs for HR user:', hrUserId);
        
        // Get HR details for better data enrichment
        let hrDetails: HrDetails | null = null;
        try {
          hrDetails = await getEnhancedHrDetails(token);
          console.log('HR details fetched:', hrDetails?.cmpData?.cmpName || 'Unknown Company');
        } catch (detailsError) {
          console.warn('Could not fetch HR details:', detailsError);
        }
        
        // Fetch jobs posted by HR
        const hrJobsResponse = await getJobsPostedByHra(hrUserId, token);
        
        // Transform the response to match JobListResponse format
        const jobs = Array.isArray(hrJobsResponse?.data) ? hrJobsResponse.data : 
                    Array.isArray(hrJobsResponse) ? hrJobsResponse : [];
        
        // Enhance jobs with HR/Company information
        const enhancedJobs = jobs.map((job: any) => ({
          ...job,
          // Add company information if not already present
          company: job.company || hrDetails?.cmpData?.cmpName || 'Your Company',
          cmpName: job.cmpName || hrDetails?.cmpData?.cmpName || 'Your Company',
          companyLogo: job.companyLogo || hrDetails?.cmpData?.cmpLogoS3,
          // Add HR context flags
          isOwnJob: true,
          hrId: hrUserId,
          companyId: hrDetails?.cmpData?.id
        }));
        
        // Apply basic filtering if search/filter parameters are provided
        let filteredJobs = enhancedJobs;
        const searchKey = payload.get('searchKey');
        if (searchKey) {
          const searchTerm = searchKey.toString().toLowerCase();
          filteredJobs = enhancedJobs.filter((job: any) => 
            job.jobTitle?.toLowerCase().includes(searchTerm) ||
            job.occupation?.toLowerCase().includes(searchTerm) ||
            job.country_location?.toLowerCase().includes(searchTerm)
          );
        }
                    
        return {
          jobs: filteredJobs,
          data: filteredJobs,
          totalJobs: filteredJobs.length,
          currentPage: 1,
          lastPage: 1,
          perPage: filteredJobs.length,
          hrDetails: hrDetails,
          companyInfo: hrDetails?.cmpData ? {
            name: hrDetails.cmpData.cmpName,
            logo: hrDetails.cmpData.cmpLogoS3,
            id: hrDetails.cmpData.id
          } : undefined
        };
      } else {
        console.warn('HR user detected but no token or user ID found, falling back to regular job list');
      }
    }
    
    // For candidates or when HR user info is not available, show all jobs
    console.log('Fetching all jobs for candidate or fallback');
    const regularResponse = await getJobList(payload);
    
    return {
      ...regularResponse,
      hrDetails: null,
      companyInfo: undefined
    };
    
  } catch (error) {
    console.error('Error in getUserAwareJobList:', error);
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
    console.error("Error posting data:", error);
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
    console.error("Error searching jobs:", error);
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
    console.error('Error fetching search result:', error);
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
    console.error("Error posting data:", error);
    throw error;
  }
};

export const getOccupations = async () => {
  try {
    const response = await axios.get(BASE_URL + 'get-occupations');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getSkill = async () => {
  try {
    const response = await axios.post(BASE_URL + 'get-skills');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getJobByDepartment = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + 'occupation-wise-jobs/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getJobByCountry = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + 'country-wise-jobs/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getJobById = async (id: string | number): Promise<any> => {
  try {
    const response = await axios.get(BASE_URL + 'getJobs/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
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
    console.error('Error applying for job:', error);
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
    console.error('Error fetching data:', error);
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
    console.error('Error fetching data:', error);
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
    console.error('Error fetching data:', error);
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
    console.error('Error fetching data:', error);
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
    console.error('Error fetching data:', error);
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
    console.error('Error fetching saved jobs:', error);
    throw error;
  }
};

export const getLatestJobs = async () => {
  try {
    const response = await axios.get(BASE_URL + 'get-latest-jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest jobs:', error);
    throw error;
  }
};

export const getRelatedJobs = async (jobId: number) => {
  try {
    const response = await axios.get(BASE_URL + 'get-related-jobs', {
      params: { jobId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching related jobs:', error);
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
    console.error('Error submitting job query:', error);
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
    console.error('Error fetching jobs by country and department:', error);
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
    console.error('Error fetching applied jobs:', error);
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
    console.error('Error fetching saved jobs:', error);
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
    console.error('Error removing saved job:', error);
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
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getCompanyById = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + 'company/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};

export const searchJobs = async (searchParams: any) => {
  try {
    const response = await axios.post(BASE_URL + 'search-jobs', searchParams);
    return response;
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

export const getJobStatistics = async () => {
  try {
    const response = await axios.get(BASE_URL + 'job-statistics');
    return response;
  } catch (error) {
    console.error('Error fetching job statistics:', error);
    throw error;
  }
};
