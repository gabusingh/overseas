/**
 * @deprecated This service file is deprecated. Use React Query hooks from @/hooks/api/ instead.
 * 
 * Migration guide:
 * - Replace getResumeOtp() with useOtpRequest() from @/hooks/api/useAuth
 * - Replace verifyResumeOtp() with useOtpLogin() from @/hooks/api/useAuth
 * - Replace uploadResume() with useUploadDocument() from @/hooks/api/useUser
 * 
 * Example migration:
 * Before: const data = await getResumeOtp(formData);
 * After:  const { mutate } = useOtpRequest();
 */

import { 
  makeFormDataRequest, 
  endpoints 
} from '../lib/api/helpers';

// OTP and Authentication APIs - Use existing working endpoints
export const getResumeOtp = async (loginForm: { name: string; contact: string }) => {
  try {
    // Use the existing get-otp endpoint that works for user registration
    const formData = new FormData();
    formData.append('empName', loginForm.name);
    formData.append('empPhone', loginForm.contact);
    
    console.log('Sending OTP request with payload:', { empName: loginForm.name, empPhone: loginForm.contact });
    
    const response = await makeFormDataRequest(endpoints.auth.getOtp, formData);
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
    
    const response = await makeFormDataRequest(endpoints.auth.registerPersonStep1, formData);
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
    const response = await makeFormDataRequest(endpoints.user.editProfile, formData);
    return response;
  } catch (error) {
    console.error('Error updating resume:', error);
    // If the edit endpoint fails, try the profile completion endpoint
    try {
      const token = accessToken || (typeof window !== 'undefined' ? sessionStorage.getItem('resumeAccessToken') : null);
      const fallbackResponse = await makeFormDataRequest(endpoints.user.completeProfileStep2, formData);
      return fallbackResponse;
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
    const response = await makeFormDataRequest(endpoints.user.addExperience, formData);
    return response;
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
    const response = await makeFormDataRequest(endpoints.user.uploadDrivingLicense, formData);
    return response;
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
    // Use passport-upload endpoint (standardized) for passport details
    try {
      return await makeFormDataRequest(endpoints.user.passportUpload, formData);
    } catch (uploadError) {
      console.log('passport-upload failed, trying upload-passport:', uploadError);
      // Fallback to upload-passport if needed
      return await makeFormDataRequest(endpoints.user.uploadPassport, formData);
    }
  } catch (error) {
    console.error('Error updating passport:', error);
    throw error;
  }
};
