import axios from 'axios';
import { apiRequest } from '../utils/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

const BASE_URL = 'https://backend.overseas.ai/api/';

interface LoginResponse {
  data: {
    user: {
      id: number;
      type: string;
      email: string;
      phone: string;
    };
    access_token: string;
  };
}


export const loginUsingPassword = async (params: { empPhone: string; password: string } | FormData): Promise<LoginResponse> => {
  try {
    const response = await axios.post(BASE_URL + "passsword-login", params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSummarizedVideo = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "get-summarized-video", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginUsingOtp = async (params: { empPhone: string } | FormData) => {
  try {
    const response = await axios.post(BASE_URL + "otp-request", params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyOtpForLogin = async (params: { empPhone: string; otp: string } | FormData): Promise<LoginResponse> => {
  try {
    const response = await axios.post(BASE_URL + "otp-login", params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (formData: FormData) => {
  try {
    const response = await axios.post(BASE_URL + "get-otp", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyOtpForSignUp = async (formData: FormData) => {
  try {
    const response = await axios.post(BASE_URL + "register-person-step1", formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const registerUserStep1 = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "user-profile-complete-step2", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUserStep2 = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "user-profile-complete-step3", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addExperienceStep2 = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "add-experience-step2", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const editExperienceStepApi = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "edit-experience", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllExperience = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "experience-list", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadWorkVideo = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "store-work-video", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const submitContactQuery = async (formData: FormData) => {
  try {
    const response = await axios.post(BASE_URL + "contact-us", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const editProfile = async (formData: FormData, accessToken: string) => {
  try {
    const response = await apiRequest.post(
      "user-complete-profile-edit", 
      formData, 
      accessToken, 
      'multipart/form-data',
      2 // Allow 2 retries for network issues
    );
    return response;
  } catch (error: any) {
    // Provide more specific error messages
    if (error.message?.includes('Network Error') || !navigator.onLine) {
      const networkError = new Error('Network connection failed. Please check your internet connection and try again.');
      (networkError as any).isNetworkError = true;
      throw networkError;
    }
    
    if (error.status === 413) {
      throw new Error('File size too large. Please reduce image size and try again.');
    }
    
    if (error.status === 422) {
      throw new Error(error.data?.message || 'Invalid data provided. Please check your inputs.');
    }
    
    throw error;
  }
};

export const getProfileStrength = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "user-improve-profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserDashboard = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "user-dashboard-applied-datas", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEmpData = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "get-emp-data", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEmpDataForEdit = async (accessToken: string) => {
  try {
    // Use local Next.js API route which handles external API fallback
    const response = await fetch('/api/get-emp-data-for-edit', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    // Employee data not found for editing (this is normal for new users)
    // Return empty data structure to allow form functionality on any error
    return {
      empName: '',
      empDob: '',
      empGender: '',
      empWhatsapp: '',
      empMS: '',
      empEmail: '',
      empEdu: '',
      empTechEdu: '',
      empPassportQ: '',
      empSkill: '',
      empOccuId: '',
      empInternationMigrationExp: '',
      empDailyWage: '',
      empExpectedMonthlyIncome: '',
      empRelocationIntQ: '',
      empState: '',
      empDistrict: '',
      empPin: '',
      empRefName: '',
      empRefPhone: '',
      empRefDistance: ''
    };
  }
};

export const profileCompleteStep2 = async (formData: FormData, accessToken: string) => {
  try {
    const response = await apiRequest.post(
      "user-profile-complete-step2", 
      formData, 
      accessToken, 
      'multipart/form-data'
    );
    return response?.data || {};
  } catch (error) {
    // Re-throw the enhanced error from our interceptors
    throw error;
  }
};

export const profileCompleteStep3 = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "user-profile-complete-step3", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const passportUpload = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "passport-upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const passportView = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "passport-view", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const passportEdit = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "passport-edit", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const experienceList = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "experience-list", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const viewExperience = async (id: number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `view-experience/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addExperience = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "add-experience", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const pastExperienceList = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "past-experience-list", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePastOccupation = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "update-past-occupation", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const storeLocation = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "store-location", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const storeAppUseTime = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "store-app-use-time", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Additional missing API functions from legacy code
export const getNotification = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "user-all-notification", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addPassportApi = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "upload-passport", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addCvApi = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "upload-cv-by-user", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addCovidCertificateApi = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "upload-covid-by-user", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const editPassportApi = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "passport-edit", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPassportDetails = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "view-passport", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addDrivingLicense = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "upload-dl-by-user", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addHighestEduCertificate = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "upload-edu-certificate-by-user", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addOtherDoc = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "upload-other-docs-by-user", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const submitLoanForm = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "need-migration-loan", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllDocApi = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "get-all-docs-by-user", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const editDrivingLicense = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "edit-dl-by-user", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const logOut = async (accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "logout-app", {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const submitReference = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "add-registration-source", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkServiceCode = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "check-service-status", {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOtpOnEmail = async (formData: FormData) => {
  try {
    const response = await axios.post(BASE_URL + "get-email-otp", formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const storeUserLocation = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "store-user-location", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserDetails = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + "user-dashboard-applied-datas", {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Legacy compatibility aliases
// These maintain compatibility with old codebase function names
export { profileCompleteStep2 as registerUserStep1Legacy };
export { profileCompleteStep3 as registerUserStep2Legacy };
