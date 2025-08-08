import axios from 'axios';

// Define your API base URL
const BASE_URL = 'https://backend.overseas.ai/api/';
// const BASE_URL = "https://test.overseas.ai/api/"; // test api

// Function to make a GET request
export const getResumeOtp = async (formData) => {
  try {
    const response = await axios.post(BASE_URL+"get-resume-otp" , formData);
    return (response);
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Function to make a GET request
export const verifyOtpForResumeUser = async (formData) => {
    try {
      const response = await axios.post(BASE_URL+"store-resume-user" , formData);
      return (response);
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error('Error fetching data:', error);
      throw error;
    }
  };


// Function to make a POST request
export const updateResumeApi = async (formData ) => {
  try {
    const response = await axios.post(BASE_URL+"update-resume-user", formData ,{
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

export const updateResumeExperience = async (formData ) => {
  try {
    const response = await axios.post(BASE_URL+"store-resume-experience", formData ,{
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

export const updateResumeLicence = async (formData ) => {
  try {
    const response = await axios.post(BASE_URL+"store-resume-licence", formData ,{
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

export const updatePassport = async (formData ) => {
  try {
    const response = await axios.post(BASE_URL+"store-resume-passport", formData ,{
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