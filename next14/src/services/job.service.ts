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

interface JobListResponse {
  jobs?: Job[];
  data?: Job[];
}

interface JobDetailResponse {
  data: Job;
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

export const getJobById = async (id: string | number): Promise<JobDetailResponse> => {
  try {
    const response = await axios.get(BASE_URL + 'getJobs/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getSearchResult = async (occuId: number, countryId: number) => {
  try {
    const response = await axios.post(BASE_URL + `jobs-by-department-by-country`, { occuId, countryId });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const applyJobApi = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + `apply-job-r`, formData, {
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
