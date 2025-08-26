import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

// Fallback data for institutes when API fails
const FALLBACK_INSTITUTES = [
  {
    id: 1,
    name: "Global Training Institute",
    image: "/images/institute.png",
    description: "Leading provider of international training programs"
  },
  {
    id: 2,
    name: "Overseas Skills Academy",
    image: "/images/institute.png", 
    description: "Specialized in overseas job preparation"
  },
  {
    id: 3,
    name: "International Career Center",
    image: "/images/institute.png",
    description: "Your gateway to global opportunities"
  }
];

// Cache to prevent infinite loops
let institutesCache: any = null;
let isFetching = false;

export const getInstitutes = async () => {
  // Return cached data if available
  if (institutesCache) {
    return institutesCache;
  }

  // Prevent multiple simultaneous requests
  if (isFetching) {
    // Wait for the ongoing request
    while (isFetching) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return institutesCache;
  }

  isFetching = true;

  try {
    // Try the correct endpoint first
    const response = await axios.get(BASE_URL + 'list-training-institute');
    institutesCache = response.data;
    return institutesCache;
  } catch (error) {
    console.warn('Failed to fetch institutes from API, using fallback data:', error);
    
    // Cache the fallback data
    institutesCache = {
      data: FALLBACK_INSTITUTES,
      success: true,
      message: "Using fallback data"
    };
    
    return institutesCache;
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
