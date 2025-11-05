/**
 * @deprecated This service file is deprecated. Use React Query hooks from @/hooks/api/ instead.
 * 
 * Migration guide:
 * - Replace getAllCourses() with useAllCourses() from @/hooks/api/useCourses
 * - Replace getCourseById() with useCourseDetails() from @/hooks/api/useCourses
 * - Replace applyCourse() with useApplyCourse() from @/hooks/api/useCourses
 * 
 * Example migration:
 * Before: const data = await getAllCourses();
 * After:  const { data } = useAllCourses();
 */

import { 
  makeGetRequest, 
  makeFormDataRequest, 
  makeJsonRequest,
  endpoints 
} from '../lib/api/helpers';

export const getAllCourses = async () => {
  try {
    return await makeGetRequest(endpoints.course.getAllCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId: number) => {
  try {
    return await makeGetRequest(endpoints.course.getCourseById(courseId));
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw error;
  }
};

export const applyCourse = async (courseId: number, accessToken: string) => {
  try {
    return await makeGetRequest(`apply-course-by-user/${courseId}`);
  } catch (error) {
    console.error('Error applying for course:', error);
    throw error;
  }
};

export const getAppliedCourses = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.course.getAppliedCourses);
  } catch (error) {
    console.error('Error fetching applied courses:', error);
    throw error;
  }
};

export const getCoursesByInstitute = async (instituteId: number) => {
  try {
    return await makeGetRequest(endpoints.course.getCoursesByInstitute(instituteId), {
      params: { instituteId }
    });
  } catch (error) {
    console.error('Error fetching courses by institute:', error);
    throw error;
  }
};

export const filterCourses = async (filters: any) => {
  try {
    return await makeJsonRequest('filter-courses', filters);
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
    return await makeJsonRequest('rate-and-review-institute', formData);
  } catch (error) {
    console.error('Error submitting rating and review:', error);
    throw error;
  }
};

export const getInstituteReviews = async (instituteId: number) => {
  try {
    return await makeGetRequest('get-rate-review-institute', {
      params: { instituteId }
    });
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
    return await makeJsonRequest('edit-rate-and-review-institute', formData);
  } catch (error) {
    console.error('Error editing rating and review:', error);
    throw error;
  }
};
