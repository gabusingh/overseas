import axios from 'axios';

// Define your API base URL
const BASE_URL = 'https://backend.overseas.ai/api/';
// const BASE_URL = "https://test.overseas.ai/api/"; // test api
export const getWorkVideo = async (access_token) => {
  try {
    const response = await axios.get(BASE_URL + 'list-work-video',  {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const getIntroVideo = async (access_token) => {
  try {
    const response = await axios.get(BASE_URL + 'list-introduction-video',  {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const deleteWorkVideo = async (videoId, access_token) => {
  try {
    const response = await axios.delete(BASE_URL + 'delete-work-video/'+videoId,  {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const deleteIntroVideo = async (videoId, access_token) => {
  try {
    const response = await axios.delete(BASE_URL + 'delete-introduction-video/'+videoId,  {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export const uploadIntroVideo = async (formData, access_token) => {
  try {
    const response = await axios.post(BASE_URL+"store-introduction-video", formData,{
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: `Bearer ${access_token}`
      }
    });
    console.log(response?.data)
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};