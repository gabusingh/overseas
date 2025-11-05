/**
 * @deprecated This service file is deprecated. Use React Query hooks from @/hooks/api/ instead.
 * 
 * Migration guide:
 * - Replace getUserDashboard() with useUserDashboard() from @/hooks/api/useUser
 * - Replace getProfileStrength() with useProfileStrength() from @/hooks/api/useUser
 * - Replace experienceList() with useExperiences() from @/hooks/api/useUser
 * - Replace getUserDetails() with useUserProfile() from @/hooks/api/useUser
 * 
 * Example migration:
 * Before: const data = await getUserDashboard(token);
 * After:  const { data } = useUserDashboard();
 */

import { 
  makeGetRequest, 
  makeFormDataRequest, 
  makeJsonRequest,
  endpoints 
} from '../lib/api/helpers';

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
    const formData = params instanceof FormData ? params : new FormData();
    if (!(params instanceof FormData)) {
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    const response = await makeFormDataRequest(endpoints.auth.passwordLogin, formData);
    return response as any;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getSummarizedVideo = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.getSummarizedVideo);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const loginUsingOtp = async (params: { empPhone: string } | FormData) => {
  try {
    const formData = params instanceof FormData ? params : new FormData();
    if (!(params instanceof FormData)) {
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    return await makeFormDataRequest(endpoints.auth.otpRequest, formData);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const verifyOtpForLogin = async (params: { empPhone: string; otp: string } | FormData): Promise<LoginResponse> => {
  try {
    const formData = params instanceof FormData ? params : new FormData();
    if (!(params instanceof FormData)) {
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    const response = await makeFormDataRequest(endpoints.auth.otpLogin, formData);
    return response as any;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const signUp = async (formData: FormData) => {
  try {
    return await makeFormDataRequest(endpoints.auth.getOtp, formData);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const verifyOtpForSignUp = async (formData: FormData) => {
  try {
    return await makeFormDataRequest(endpoints.auth.registerPersonStep1, formData);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const registerUserStep1 = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.completeProfileStep2, formData);
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const registerUserStep2 = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.completeProfileStep3, formData);
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const addExperienceStep2 = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.addExperienceStep2, formData);
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const editExperienceStepApi = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.editExperience, formData);
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getAllExperience = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.experienceList);
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const uploadWorkVideo = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.storeWorkVideo, formData);
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const submitContactQuery = async (formData: FormData) => {
  try {
    return await makeFormDataRequest(endpoints.contact.contactUs, formData);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const editProfile = async (formData: FormData, accessToken: string) => {
  try {
    console.log('Attempting to update profile with enhanced API client...');
    const response = await makeFormDataRequest(endpoints.user.editProfile, formData);
    console.log('Profile update successful');
    return response;
  } catch (error: any) {
    console.error('Error updating profile:', {
      message: error.message,
      status: error.status,
      data: error.data,
      originalError: error.originalError
    });
    
    // Provide more specific error messages
    if (error.message?.includes('Network Error') || (typeof navigator !== 'undefined' && !navigator.onLine)) {
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
    return await makeGetRequest(endpoints.user.getProfileStrength);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getUserDashboard = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.getUserDashboard);
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    throw error;
  }
};

export const getEmpData = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.getEmpData);
  } catch (error) {
    console.error('Error fetching employee data:', error);
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
    console.warn('Employee data not found for editing (this is normal for new users):', error.message);
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
    return await makeFormDataRequest(endpoints.user.completeProfileStep2, formData);
  } catch (error) {
    console.error('Error completing profile step 2:', error);
    throw error;
  }
};

export const profileCompleteStep3 = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.completeProfileStep3, formData);
  } catch (error) {
    console.error('Error completing profile step 3:', error);
    throw error;
  }
};

// Consolidated passport functions - use passport-upload endpoint (standardized)
export const passportUpload = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.passportUpload, formData);
  } catch (error) {
    console.error('Error uploading passport:', error);
    throw error;
  }
};

// Alias for compatibility - use same endpoint
export const addPassportApi = passportUpload;

export const passportView = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.passportView);
  } catch (error) {
    console.error('Error fetching passport:', error);
    throw error;
  }
};

// Alias using view-passport endpoint (both work, standardize to passport-view)
export const getPassportDetails = async (accessToken: string) => {
  try {
    // Try passport-view first, fallback to view-passport if needed
    try {
      return await makeGetRequest(endpoints.user.passportView);
    } catch {
      return await makeGetRequest(endpoints.user.viewPassport);
    }
  } catch (error) {
    console.error('Error fetching passport details:', error);
    throw error;
  }
};

export const passportEdit = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.passportEdit, formData);
  } catch (error) {
    console.error('Error editing passport:', error);
    throw error;
  }
};

// Alias for compatibility
export const editPassportApi = passportEdit;

export const experienceList = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.experienceList);
  } catch (error) {
    console.error('Error fetching experience list:', error);
    throw error;
  }
};

export const viewExperience = async (id: number, accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.viewExperience(id));
  } catch (error) {
    console.error('Error fetching experience:', error);
    throw error;
  }
};

export const addExperience = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.addExperience, formData);
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
};

export const pastExperienceList = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.pastExperienceList);
  } catch (error) {
    console.error('Error fetching past experience list:', error);
    throw error;
  }
};

export const updatePastOccupation = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.updatePastOccupation, formData);
  } catch (error) {
    console.error('Error updating past occupation:', error);
    throw error;
  }
};

export const storeLocation = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.storeLocation, formData);
  } catch (error) {
    console.error('Error storing location:', error);
    throw error;
  }
};

export const storeAppUseTime = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.storeAppUseTime, formData);
  } catch (error) {
    console.error('Error storing app use time:', error);
    throw error;
  }
};

// Consolidated notification function - standardize to return data
export const getNotification = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.getAllNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const addCvApi = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.uploadCv, formData);
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
};

export const addCovidCertificateApi = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.uploadCovid, formData);
  } catch (error) {
    console.error('Error uploading COVID certificate:', error);
    throw error;
  }
};

export const addDrivingLicense = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.uploadDrivingLicense, formData);
  } catch (error) {
    console.error('Error uploading driving license:', error);
    throw error;
  }
};

export const addHighestEduCertificate = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.uploadEduCertificate, formData);
  } catch (error) {
    console.error('Error uploading education certificate:', error);
    throw error;
  }
};

export const addOtherDoc = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.uploadOtherDocs, formData);
  } catch (error) {
    console.error('Error uploading other documents:', error);
    throw error;
  }
};

export const submitLoanForm = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.submitLoan, formData);
  } catch (error) {
    console.error('Error submitting loan form:', error);
    throw error;
  }
};

export const getAllDocApi = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.getAllDocs);
  } catch (error) {
    console.error('Error fetching all documents:', error);
    throw error;
  }
};

export const editDrivingLicense = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.editDrivingLicense, formData);
  } catch (error) {
    console.error('Error editing driving license:', error);
    throw error;
  }
};

export const logOut = async (accessToken: string) => {
  try {
    return await makeJsonRequest(endpoints.auth.logout, {});
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const submitReference = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.addRegistrationSource, formData);
  } catch (error) {
    console.error('Error submitting reference:', error);
    throw error;
  }
};

export const checkServiceCode = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.checkServiceStatus);
  } catch (error) {
    console.error('Error checking service code:', error);
    throw error;
  }
};

export const getOtpOnEmail = async (formData: FormData) => {
  try {
    return await makeFormDataRequest(endpoints.auth.getEmailOtp, formData);
  } catch (error) {
    console.error('Error getting OTP on email:', error);
    throw error;
  }
};

export const storeUserLocation = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest(endpoints.user.storeUserLocation, formData);
  } catch (error) {
    console.error('Error storing user location:', error);
    throw error;
  }
};

export const getUserDetails = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.getUserDashboard);
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Legacy compatibility aliases
// These maintain compatibility with old codebase function names
export { profileCompleteStep2 as registerUserStep1Legacy };
export { profileCompleteStep3 as registerUserStep2Legacy };
