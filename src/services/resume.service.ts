import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

export const getResumeTemplates = async () => {
  try {
    const response = await axios.get(BASE_URL + 'resume-templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching resume templates:', error);
    throw error;
  }
};

export const generateResume = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'generate-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};

export const getUserResumes = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'user-resumes', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    throw error;
  }
};

export const downloadResume = async (resumeId: number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `download-resume/${resumeId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error('Error downloading resume:', error);
    throw error;
  }
};
