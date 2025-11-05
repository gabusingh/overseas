/**
 * @deprecated This service file is deprecated. Use React Query hooks from @/hooks/api/ instead.
 * 
 * Migration guide:
 * - Replace getUserAwareJobList() with useJobs() from @/hooks/api/useJobs
 * - Replace getJobById() with useJobById() from @/hooks/api/useJobs
 * - Replace applyJobApi() with useApplyJob() from @/hooks/api/useJobs
 * - Replace saveJobById() with useSaveJob() from @/hooks/api/useJobs
 * - Replace getAppliedJobs() with useAppliedJobs() from @/hooks/api/useJobs
 * - Replace getSavedJobs() with useSavedJobs() from @/hooks/api/useJobs
 * 
 * Example migration:
 * Before: const data = await getUserAwareJobList(formData);
 * After:  const { data } = useJobs(filters);
 */

import { 
  makeGetRequest, 
  makeFormDataRequest, 
  makeJsonRequest,
  endpoints 
} from '../lib/api/helpers';

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
    const response = await makeFormDataRequest<JobListResponse>(endpoints.jobs.filterAllJobs, payload);
    return response;
  } catch (error: any) {
    console.error("Error posting data:", error);
    
    // Handle 500 errors gracefully
    if (error?.status === 500) {
      console.error('Backend server error (500). Using empty response as fallback.');
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

// Helper function to get HR user ID from localStorage with enhanced debugging
const getHrUserIdFromStorage = (): string | null => {
  try {
    const loggedUser = localStorage.getItem("loggedUser");
    const userSimple = localStorage.getItem("user");
    
    console.log('🔍 DEBUG - localStorage data:');
    console.log('- loggedUser exists:', !!loggedUser);
    console.log('- userSimple exists:', !!userSimple);
    
    if (loggedUser) {
      const userData = JSON.parse(loggedUser);
      console.log('📋 DEBUG - loggedUser data structure:', {
        hasUser: !!userData?.user,
        hasCmpData: !!userData?.cmpData,
        hasId: !!userData?.id,
        hasHrId: !!userData?.hrId,
        hasEmpId: !!userData?.empId,
        userType: userData?.user?.type || userData?.type,
        userData: userData
      });
      
      // Try different possible ID fields for HR users
      const hrId = userData?.user?.id || 
                   userData?.cmpData?.id || 
                   userData?.id || 
                   userData?.hrId || 
                   userData?.empId ||
                   userData?.user?.empId ||
                   userData?.cmpData?.empId;
      
      console.log('🎯 DEBUG - Extracted HR ID:', hrId);
      
      if (hrId) {
        return hrId.toString();
      }
    }
    
    if (userSimple) {
      const userSimpleData = JSON.parse(userSimple);
      console.log('📋 DEBUG - userSimple data:', userSimpleData);
      const hrId = userSimpleData?.id;
      
      console.log('🎯 DEBUG - UserSimple HR ID:', hrId);
      
      if (hrId) {
        return hrId.toString();
      }
    }
    
    console.warn('⚠️ DEBUG - No HR ID found in localStorage');
    return null;
  } catch (error) {
    console.error('❌ Error extracting HR user ID:', error);
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
    
    // Always show all jobs regardless of user type
    // Previously this function filtered jobs for HR users to show only their posted jobs
    // Now HR users will see all available jobs just like candidates
    
    console.log('Fetching all jobs for all users');
    const regularResponse = await getJobList(payload);
    
    // Optionally enhance with HR details if user is HR (for UI purposes only)
    let hrDetails: HrDetails | null = null;
    if (userType === 'company') {
      const token = localStorage.getItem("access_token");
      try {
        hrDetails = await getEnhancedHrDetails(token);
        console.log('HR details fetched for UI enhancement:', hrDetails?.cmpData?.cmpName || 'Unknown Company');
      } catch (detailsError) {
        console.warn('Could not fetch HR details:', detailsError);
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
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return await makeFormDataRequest<JobListResponse>(endpoints.jobs.searchAllJobs, formData);
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

// Function to search jobs by search key (from legacy)
export const searchJobsByKey = async (searchKey: string | FormData): Promise<JobListResponse> => {
  try {
    if (typeof searchKey === 'string') {
      return await makeJsonRequest<JobListResponse>(endpoints.jobs.searchAllJobs, {
        searchKey: searchKey.replace(/-/g, ' ')
      });
    } else {
      return await makeFormDataRequest<JobListResponse>(endpoints.jobs.searchAllJobs, searchKey);
    }
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw error;
  }
};

// Function to get jobs by search result (from legacy)
export const getSearchResult = async (occuId: number, countryId: number) => {
  try {
    return await makeJsonRequest(endpoints.jobs.jobsByDepartmentByCountry, {
      occuId, 
      countryId
    });
  } catch (error) {
    console.error('Error fetching search result:', error);
    throw error;
  }
};

export const getThisWeekJob = async (payload: FormData): Promise<JobListResponse> => {
  try {
    return await makeFormDataRequest<JobListResponse>(endpoints.jobs.getLastWeekJobs, payload);
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const getOccupations = async () => {
  try {
    return await makeGetRequest(endpoints.jobs.getOccupations);
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getSkill = async () => {
  try {
    return await makeJsonRequest(endpoints.jobs.getSkills, {});
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getJobByDepartment = async (id: number) => {
  try {
    return await makeGetRequest(endpoints.jobs.getJobsByDepartment(id));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getJobByCountry = async (id: number) => {
  try {
    return await makeGetRequest(endpoints.jobs.getJobsByCountry(id));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getJobById = async (id: string | number): Promise<any> => {
  try {
    return await makeGetRequest(endpoints.jobs.getJobById(id));
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
      formData.append('id', String(payload.id));
      formData.append('apply-job', payload['apply-job'] || '');
    }
    
    return await makeFormDataRequest(endpoints.jobs.applyJob, formData);
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

// Consolidated applied jobs function - standardize to return data
export const appliedJobList = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.jobs.appliedJobList);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Alias for compatibility - same endpoint, consistent data handling
export const getAppliedJobs = appliedJobList;

export const appliedJobById = async (id: number, accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.jobs.appliedJobById(id));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getInterviewById = async (id: number, accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.jobs.interviewStatus(id));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const favouriteJobList = async (accessToken: string) => {
  try {
    return await makeJsonRequest(endpoints.jobs.favoriteJobList, {});
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const saveJobById = async (jobId: number, accessToken: string) => {
  try {
    return await makeJsonRequest(endpoints.jobs.saveJob, { jobId });
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Consolidated saved jobs function - standardize to return data
export const userSavedJobsList = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.jobs.savedJobList);
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    throw error;
  }
};

// Alias for compatibility - same endpoint, consistent data handling
export const getSavedJobs = userSavedJobsList;

export const getLatestJobs = async () => {
  try {
    return await makeGetRequest(endpoints.jobs.getLatestJobs);
  } catch (error) {
    console.error('Error fetching latest jobs:', error);
    throw error;
  }
};

export const getRelatedJobs = async (jobId: number) => {
  try {
    return await makeGetRequest(endpoints.jobs.getRelatedJobs, {
      params: { jobId }
    });
  } catch (error) {
    console.error('Error fetching related jobs:', error);
    throw error;
  }
};

export const jobQuery = async (formData: FormData) => {
  try {
    return await makeFormDataRequest(endpoints.jobs.jobQuery, formData);
  } catch (error) {
    console.error('Error submitting job query:', error);
    throw error;
  }
};

export const getJobsByCountryByDepartment = async (countryId: number, departmentId: number) => {
  try {
    return await makeJsonRequest(endpoints.jobs.getJobsByCountryByDepartment, {
      countryId,
      departmentId
    });
  } catch (error) {
    console.error('Error fetching jobs by country and department:', error);
    throw error;
  }
};

export const removeSavedJob = async (jobId: number, accessToken: string) => {
  try {
    return await makeJsonRequest(endpoints.jobs.removeSavedJob, { jobId });
  } catch (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
};

export const getCompanies = async (page: number = 1) => {
  try {
    return await makeGetRequest(endpoints.hr.getCompanies, {
      params: { page }
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getCompanyById = async (id: number) => {
  try {
    return await makeGetRequest(endpoints.hr.getCompanyById(id));
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};

export const searchJobs = async (searchParams: any) => {
  try {
    return await makeJsonRequest(endpoints.jobs.searchAllJobs, searchParams);
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

export const getJobStatistics = async () => {
  try {
    return await makeGetRequest(endpoints.jobs.jobStatistics);
  } catch (error) {
    console.error('Error fetching job statistics:', error);
    throw error;
  }
};
