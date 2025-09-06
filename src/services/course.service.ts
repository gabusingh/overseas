import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

export const getAllCourses = async () => {
  try {
    const response = await axios.get(BASE_URL + 'list-all-course');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId: number) => {
  try {
    const response = await axios.get(BASE_URL + `get-course-details-by-id/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw error;
  }
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
    console.error('Error applying for course:', error);
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
    console.error('Error fetching applied courses:', error);
    throw error;
  }
};

export const getCoursesByInstitute = async (instituteId: number) => {
  try {
    const response = await axios.get(BASE_URL + `get-courses-by-institute?instituteId=${instituteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses by institute:', error);
    throw error;
  }
};

export const filterCourses = async (filters: any) => {
  try {
    const response = await axios.post(BASE_URL + 'filter-courses', filters);
    return response.data;
  } catch (error) {
    console.error('Error filtering courses:', error);
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
    return response.data;
  } catch (error) {
    console.error('Error submitting rating and review:', error);
    throw error;
  }
};

export const getInstituteReviews = async (instituteId: number) => {
  try {
    const response = await axios.get(BASE_URL + `get-rate-review-institute?instituteId=${instituteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching institute reviews:', error);
    throw error;
  }
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
    console.error('Error editing rating and review:', error);
    throw error;
  }
};
