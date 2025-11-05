/**
 * @deprecated This service file is deprecated. Use React Query hooks from @/hooks/api/ instead.
 * 
 * Migration guide:
 * - Replace getWorkVideo() with useUserDocuments() from @/hooks/api/useUser
 * - Replace uploadWorkVideo() with useUploadDocument() from @/hooks/api/useUser
 * 
 * Example migration:
 * Before: const data = await getWorkVideo(token);
 * After:  const { data } = useUserDocuments();
 */

import { 
  makeGetRequest, 
  makeFormDataRequest, 
  makeDeleteRequest 
} from '../lib/api/helpers';

export const getWorkVideo = async (accessToken: string) => {
  try {
    return await makeGetRequest('list-work-video');
  } catch (error) {
    console.error('Error fetching work videos:', error);
    throw error;
  }
};

export const getIntroVideo = async (accessToken: string) => {
  try {
    return await makeGetRequest('list-introduction-video');
  } catch (error) {
    console.error('Error fetching intro videos:', error);
    throw error;
  }
};

export const deleteWorkVideo = async (videoId: string | number, accessToken: string) => {
  try {
    return await makeDeleteRequest(`delete-work-video/${videoId}`);
  } catch (error) {
    console.error('Error deleting work video:', error);
    throw error;
  }
};

export const deleteIntroVideo = async (videoId: string | number, accessToken: string) => {
  try {
    return await makeDeleteRequest(`delete-introduction-video/${videoId}`);
  } catch (error) {
    console.error('Error deleting intro video:', error);
    throw error;
  }
};

export const uploadIntroVideo = async (formData: FormData, accessToken: string) => {
  try {
    return await makeFormDataRequest('store-introduction-video', formData);
  } catch (error) {
    console.error('Error uploading intro video:', error);
    throw error;
  }
};
