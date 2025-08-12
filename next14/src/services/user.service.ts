import axios from 'axios';

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


export const loginUsingPassword = async (formData: FormData): Promise<LoginResponse> => {
  try {
    const response = await axios.post(BASE_URL + "passsword-login", formData);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
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
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const loginUsingOtp = async (formData: FormData) => {
  try {
    const response = await axios.post(BASE_URL + "otp-request", formData);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const verifyOtpForLogin = async (formData: FormData): Promise<LoginResponse> => {
  try {
    const response = await axios.post(BASE_URL + "otp-login", formData);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const signUp = async (formData: FormData) => {
  try {
    const response = await axios.post(BASE_URL + "get-otp", formData);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const verifyOtpForSignUp = async (formData: FormData) => {
  try {
    const response = await axios.post(BASE_URL + "register-person-step1", formData);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
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
    console.error('Error posting data:', error);
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
    console.error('Error posting data:', error);
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
    console.error('Error posting data:', error);
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
    console.error('Error posting data:', error);
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
    console.error('Error posting data:', error);
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
    console.error('Error posting data:', error);
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
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const editProfile = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "user-complete-profile-edit", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
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
    console.error('Error fetching data:', error);
    throw error;
  }
};
