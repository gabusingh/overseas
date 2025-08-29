import { apiRequest } from '@/utils/axiosConfig';

// OTP and Authentication APIs - Use existing working endpoints
export const getResumeOtp = async (loginForm: { name: string; contact: string }) => {
  try {
    // Use the existing get-otp endpoint that works for user registration
    const formData = new FormData();
    formData.append('empName', loginForm.name);
    formData.append('empPhone', loginForm.contact);
    
    console.log('Sending OTP request with payload:', { empName: loginForm.name, empPhone: loginForm.contact });
    
    const response = await apiRequest.post('get-otp', formData);
    return response;
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOtpForResumeUser = async (loginForm: { name: string; contact: string; otp: string }) => {
  try {
    // Use the existing register-person-step1 endpoint for OTP verification
    const formData = new FormData();
    formData.append('empName', loginForm.name);
    formData.append('empPhone', loginForm.contact);
    formData.append('otp', loginForm.otp);
    formData.append('empPassword', 'temp123'); // Temporary password for resume users
    formData.append('empType', 'person');
    
    console.log('Verifying OTP with payload:', { empName: loginForm.name, empPhone: loginForm.contact, otp: loginForm.otp });
    
    const response = await apiRequest.post('register-person-step1', formData);
    return response;
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Resume Update APIs - Use existing user profile completion endpoints
export const updateResumeApi = async (formData: FormData, accessToken?: string) => {
  try {
    const token = accessToken || (typeof window !== 'undefined' ? sessionStorage.getItem('resumeAccessToken') : null);
    if (!token) {
      throw new Error('No access token found. Please verify OTP first.');
    }
    
    console.log('Updating resume with access token');
    // Use user-complete-profile-edit endpoint for updating user profile
    const response = await apiRequest.post('user-complete-profile-edit', formData, token);
    return response?.data;
  } catch (error) {
    console.error('Error updating resume:', error);
    // If the edit endpoint fails, try the profile completion endpoint
    try {
      const token = accessToken || (typeof window !== 'undefined' ? sessionStorage.getItem('resumeAccessToken') : null);
      const fallbackResponse = await apiRequest.post('user-profile-complete-step2', formData, token);
      return fallbackResponse?.data;
    } catch (fallbackError) {
      console.error('Fallback profile update also failed:', fallbackError);
      throw error; // Throw the original error
    }
  }
};

export const updateResumeExperience = async (formData: FormData, accessToken?: string) => {
  try {
    const token = accessToken || (typeof window !== 'undefined' ? sessionStorage.getItem('resumeAccessToken') : null);
    if (!token) {
      throw new Error('No access token found. Please verify OTP first.');
    }
    
    console.log('Updating experience with access token');
    // Use add-experience endpoint for adding work experience
    const response = await apiRequest.post('add-experience', formData, token);
    return response?.data;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

export const updateResumeLicence = async (formData: FormData, accessToken?: string) => {
  try {
    const token = accessToken || (typeof window !== 'undefined' ? sessionStorage.getItem('resumeAccessToken') : null);
    if (!token) {
      throw new Error('No access token found. Please verify OTP first.');
    }
    
    console.log('Updating license with access token');
    // Use upload-dl-by-user endpoint for driving license upload
    const response = await apiRequest.post('upload-dl-by-user', formData, token);
    return response?.data;
  } catch (error) {
    console.error('Error updating licence:', error);
    throw error;
  }
};

export const updatePassport = async (formData: FormData, accessToken?: string) => {
  try {
    const token = accessToken || (typeof window !== 'undefined' ? sessionStorage.getItem('resumeAccessToken') : null);
    if (!token) {
      throw new Error('No access token found. Please verify OTP first.');
    }
    
    console.log('Updating passport with access token');
    // Use upload-passport or passport-upload endpoint for passport details
    let response;
    try {
      response = await apiRequest.post('upload-passport', formData, token);
    } catch (uploadError) {
      console.log('upload-passport failed, trying passport-upload:', uploadError);
      response = await apiRequest.post('passport-upload', formData, token);
    }
    return response?.data;
  } catch (error) {
    console.error('Error updating passport:', error);
    throw error;
  }
};
