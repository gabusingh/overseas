import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

export const getAllCourses = async () => {
  try {
    const response = await axios.get(BASE_URL + 'courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId: number) => {
  try {
    const response = await axios.get(BASE_URL + `courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const createCourse = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'create-course', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (courseId: number, formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + `edit-course/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const getInstitutesCourses = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'institute-courses', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching institute courses:', error);
    throw error;
  }
};

export const getCourseEnrollments = async (courseId: number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `course-enrollments/${courseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    throw error;
  }
};

export const enrollInCourse = async (courseId: number, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + `enroll-course/${courseId}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};
