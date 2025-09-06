import axios from 'axios';
import { withCache, cacheService } from './cache.service';

const BASE_URL = 'https://backend.overseas.ai/api/';

export const getAllCourses = async () => {
  return withCache(
    'all_courses',
    async () => {
      try {
        const response = await axios.get(BASE_URL + 'list-all-course');
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    15 * 60 * 1000 // 15 minutes cache
  );
};

export const getCourseById = async (courseId: number) => {
  return withCache(
    `course_${courseId}`,
    async () => {
      try {
        const response = await axios.get(BASE_URL + `get-course-details-by-id/${courseId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    30 * 60 * 1000 // 30 minutes cache for individual courses
  );
};

export const applyCourse = async (courseId: number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `apply-course-by-user/${courseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppliedCourses = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'list-applied-courses', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCoursesByInstitute = async (instituteId: number) => {
  return withCache(
    `institute_courses_${instituteId}`,
    async () => {
      try {
        const response = await axios.get(BASE_URL + `get-courses-by-institute?instituteId=${instituteId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    15 * 60 * 1000 // 15 minutes cache
  );
};

export const filterCourses = async (filters: any) => {
  try {
    const response = await axios.post(BASE_URL + 'filter-courses', filters);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rateAndReviewInstitute = async (formData: {
  instituteId: number;
  rating: number;
  review: string;
}, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'rate-and-review-institute', formData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
    // Clear cache after rating
    cacheService.clear(`institute_reviews_${formData.instituteId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInstituteReviews = async (instituteId: number) => {
  return withCache(
    `institute_reviews_${instituteId}`,
    async () => {
      try {
        const response = await axios.get(BASE_URL + `get-rate-review-institute?instituteId=${instituteId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    15 * 60 * 1000 // 15 minutes cache
  );
};

export const editRateAndReviewInstitute = async (formData: {
  ratingId: number;
  rating: number;
  review: string;
}, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'edit-rate-and-review-institute', formData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Clear cache when data is modified
export const clearCacheOnDataChange = (instituteId?: string, courseId?: string) => {
  // Clear all courses cache when data changes
  cacheService.clear('all_courses');
  
  if (instituteId) {
    cacheService.clear(`institute_${instituteId}`);
    cacheService.clear(`institute_courses_${instituteId}`);
    cacheService.clear(`institute_reviews_${instituteId}`);
  }
  
  if (courseId) {
    cacheService.clear(`course_${courseId}`);
  }
};
