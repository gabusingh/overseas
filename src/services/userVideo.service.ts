import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

export const getWorkVideo = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'list-work-video', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching work videos:', error);
    throw error;
  }
};

export const getIntroVideo = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'list-introduction-video', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching intro videos:', error);
    throw error;
  }
};

export const deleteWorkVideo = async (videoId: string | number, accessToken: string) => {
  try {
    const response = await axios.delete(BASE_URL + 'delete-work-video/' + videoId, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error deleting work video:', error);
    throw error;
  }
};

export const deleteIntroVideo = async (videoId: string | number, accessToken: string) => {
  try {
    const response = await axios.delete(BASE_URL + 'delete-introduction-video/' + videoId, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error deleting intro video:', error);
    throw error;
  }
};

export const uploadIntroVideo = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + "store-introduction-video", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error uploading intro video:', error);
    throw error;
  }
};
