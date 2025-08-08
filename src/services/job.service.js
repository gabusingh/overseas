import axios from 'axios';

// Define your API base URL
const BASE_URL = 'https://backend.overseas.ai/api/';
// const BASE_URL = "https://test.overseas.ai/api/"; // test api

// Function to get job list
export const getJobList = async (payload) => {
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
// Function to get job list
export const getJobListForSearch = async (payload) => {
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
// Function to get job list
export const getThisWeekJob = async (payload) => {
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
// Function to get job occupation list
export const getOccupations = async data => {
  try {
    const response = await axios.get(BASE_URL + 'get-occupations');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Function to get job occupation list
export const getSkill = async data => {
  try {
    const response = await axios.post(BASE_URL + 'get-skills');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Function to get job by department list
export const getJobByDepartment = async id => {
  try {
    const response = await axios.get(BASE_URL + 'occupation-wise-jobs/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Function to get job by country
export const getJobByCountry = async id => {
  try {
    const response = await axios.get(BASE_URL + 'country-wise-jobs/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Function to get job by country
export const getJobById = async id => {
  try {
    const response = await axios.get(BASE_URL + 'getJobs/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
// get search result
export const getSearchResult = async (occuId, countryId) => {
  try {
    const response = await axios.post(BASE_URL + `jobs-by-department-by-country`, {occuId, countryId});
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// apply job
export const applyJobApi = async (formData, access_token) => {
  try {
    const response = await axios.post(BASE_URL + `apply-job-r`, formData, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// get applied job list 
export const appliedJobList = async (access_token) => {
  console.log(access_token)
  try {
    const response = await axios.get(BASE_URL + `user-applied-job-list`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// get applied job list 
export const appliedJobById = async (id, access_token) => {
  console.log(BASE_URL + `user-applied-job-list/`+id)
  try {
    const response = await axios.get(BASE_URL + `user-applied-job-list/`+id, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// get Interview By Id
export const getInterviewById = async (id, access_token) => {
  try {
    const response = await axios.get(BASE_URL + `interview-status-for-emp/`+id, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// get favourite job list
export const favouriteJobList = async (access_token) => {
  console.log("token", access_token)
  try {
    const response = await axios.post(BASE_URL + `user-favourite-job-list`,{}, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const saveJobById = async (jobId, access_token) => {
  console.log(jobId, access_token)
  try {
    const response = await axios.post(BASE_URL + `save-job-by-user`, {jobId: jobId}, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const  savedJobList = async (access_token) => {
  try {
    const response = await axios.get(BASE_URL + `user-saved-job-list`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const uploadSignedDocForCaution = async (formData, access_token) => {
  console.log(formData)
  try {
    const response = await axios.post(BASE_URL + `upload-signed-offer-letter`,formData, {
      headers: {
      'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const uploadMedicalForInterview = async (formData, access_token) => {
  console.log(formData)
  try {
    const response = await axios.post(BASE_URL + `upload-docs-by-user`,formData, {
      headers: {
      'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};