/**
 * @deprecated This service file is deprecated. Use React Query hooks from @/hooks/api/ instead.
 * 
 * Migration guide:
 * - Replace listTrainingInstitute() with useInstitutes() from @/hooks/api/useInstitute
 * - Replace getInstituteById() with useInstituteDetails() from @/hooks/api/useInstitute
 * 
 * Example migration:
 * Before: const data = await listTrainingInstitute();
 * After:  const { data } = useInstitutes();
 */

import { 
  makeGetRequest, 
  makeFormDataRequest, 
  endpoints 
} from '../lib/api/helpers';

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
    const response = await makeGetRequest(endpoints.institute.listTrainingInstitutes);
    institutesCache = response;
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
    return await makeGetRequest(endpoints.institute.getInstituteById(id));
  } catch (error) {
    console.error('Error fetching institute:', error);
    throw error;
  }
};

export const getCourses = async () => {
  try {
    return await makeGetRequest(endpoints.course.getAllCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (id: number) => {
  try {
    return await makeGetRequest(endpoints.course.getCourseById(id));
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const applyCourse = async (courseId: number, userId: number) => {
  try {
    const formData = new FormData();
    formData.append('courseId', String(courseId));
    formData.append('userId', String(userId));
    return await makeFormDataRequest(endpoints.course.applyCourse, formData);
  } catch (error) {
    console.error('Error applying for course:', error);
    throw error;
  }
};
