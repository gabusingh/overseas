import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';


export const getInstitutes = async () => {
  try {
    const response = await axios.get(BASE_URL + 'institutes');
    return response.data;
  } catch (error) {
    console.error('Error fetching institutes:', error);
    throw error;
  }
};

export const getInstituteById = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + 'institutes/' + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching institute:', error);
    throw error;
  }
};

export const getCourses = async () => {
  try {
    const response = await axios.get(BASE_URL + 'courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + 'courses/' + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};
