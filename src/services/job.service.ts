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
}

interface JobDetailResponse {
  jobs: JobDetail;
}


export const getJobList = async (payload: FormData): Promise<JobListResponse> => {
  try {
    const response = await axios.post(BASE_URL + "filter-all-jobs", payload, {
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
export const searchJobsByKey = async (searchKey: string): Promise<JobListResponse> => {
  try {
    const response = await axios.post(BASE_URL + "search-all-jobs", {
      searchKey: searchKey.replace(/-/g, ' ')
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
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
