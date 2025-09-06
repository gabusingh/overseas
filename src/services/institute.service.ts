import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

// Cache to prevent duplicate in-flight requests
let institutesCache: any = null;
let isFetching = false;

export const getInstitutes = async () => {
  // Return cached data if available
  if (institutesCache) {
    return institutesCache;
  }

  // Prevent multiple simultaneous requests
  if (isFetching) {
    // Wait for the ongoing request to finish
    while (isFetching) {
      // Small delay to avoid tight loop
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return institutesCache;
  }

  isFetching = true;

  try {
    const response = await axios.get(BASE_URL + 'list-training-institute');
    institutesCache = response.data;
    return institutesCache;
  } catch (error) {
    // No mock/fallback data — surface the actual error
    console.error('Failed to fetch institutes from API:', error);
    throw error;
  } finally {
    isFetching = false;
  }
};

// Function to clear cache if needed
export const clearInstitutesCache = () => {
  institutesCache = null;
  isFetching = false;
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

export const applyCourse = async (courseId: number, userId: number) => {
  try {
    const response = await axios.post(BASE_URL + 'apply-course', {
      courseId,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Error applying for course:', error);
    throw error;
  }
};
