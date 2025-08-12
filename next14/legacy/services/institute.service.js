import axios from 'axios';

// Define your API base URL
const BASE_URL = 'https://backend.overseas.ai/api/';
// const BASE_URL = "https://test.overseas.ai/api/"; // test api
// Function to get job occupation list

export const getInstituteRegistrationOtp = async (formData) => { 
  try {
    const response = await axios.post(BASE_URL + 'get-institute-register-otp', formData);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const registerInstitute = async (formData) => { 
  try {
    const response = await axios.post(BASE_URL + 'register-institute', formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
       
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getInstituteList = async access_token => { 
  try {
    const response = await axios.get(BASE_URL + 'list-training-institute', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getTradeList = async access_token => { 
  try {
    const response = await axios.get(BASE_URL + 'list-trade-center', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getCourseByInstitute = async params => {
  try {
    const response = await axios.post(
      BASE_URL + 'courses-by-institute',
       params,
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getTestByInstitute = async params => {
  try {
    const response = await axios.post(
      BASE_URL + 'tests-by-institute',
       params,
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getCourseList = async access_token => {
  try {
    const response = await axios.get(
      BASE_URL + 'list-all-course',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getTradeTestList = async access_token => {
  try {
    const response = await axios.get(
      BASE_URL + 'list-all-trade-test',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getTestList = async access_token => {
  try {
    const response = await axios.get(
      BASE_URL + 'list-all-trade-test',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const searchForCourse = async (params) => {
  try {
    const response = await axios.post(
      BASE_URL + 'filter-courses', {instId:params.id},
      {
        headers: {
          Authorization: `Bearer ${params?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const searchForTest = async (params) => {
  try {
    const response = await axios.post(
      BASE_URL + 'filter-courses', {instId:params.id},
      {
        headers: {
          Authorization: `Bearer ${params?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const applyCourse = async (params) => {
  try {
    const response = await axios.post(
      BASE_URL + 'apply-course/'+ params.id, {},
      {
        headers: {
          Authorization: `Bearer ${params?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getListOfAppliedCourse = async (access_token) => {
  try {
    const response = await axios.get(
      BASE_URL + 'applied-course',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getReviewOFInstitute = async (instituteId, access_token) => {
  try {
    const response = await axios.post(
      BASE_URL + 'get-rate-review-institute',
      {instituteId},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const addReviewForInstitute = async (formData, access_token) => {
  try {
    const response = await axios.post(BASE_URL + 'rate-review-institute', formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error.response.data.msg);
    throw error;
  }
};
export const editReviewForInstitute = async (formData, access_token) => {
  try {
    const response = await axios.post(BASE_URL + 'edit-rate-review-institute', formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error.response.data.msg);
    throw error;
  }
};

export const getCourseById = async (id, access_token) => {
  try {
    const response = await axios.get(BASE_URL + 'course/'+id, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error.response.data.msg);
    throw error;
  }
};