import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

export const getHraDashboardData = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'hra-dashboard', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching HRA dashboard data:', error);
    throw error;
  }
};

export const createJob = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'create-job', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const getHraJobs = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'hra-jobs', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching HRA jobs:', error);
    throw error;
  }
};

export const editJob = async (jobId: number, formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + `edit-job/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error editing job:', error);
    throw error;
  }
};

export const getJobApplications = async (jobId: number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `job-applications/${jobId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

export const getRecommendedCandidates = async (jobId?: number, accessToken?: string) => {
  try {
    const url = jobId ? `recommended-candidates/${jobId}` : 'recommended-candidates';
    const response = await axios.get(BASE_URL + url, {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {}
    });
    return response;
  } catch (error) {
    console.error('Error fetching recommended candidates:', error);
    throw error;
  }
};

export const getHraNotifications = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'hra-notifications', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching HRA notifications:', error);
    throw error;
  }
};

export const createBulkHire = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'bulk-hire', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating bulk hire:', error);
    throw error;
  }
};
