/**
 * @deprecated This service file is deprecated. Use React Query hooks from @/hooks/api/ instead.
 * 
 * Migration guide:
 * - Replace languageTrainingData() with useCourseDetails() from @/hooks/api/useCourses
 * 
 * Example migration:
 * Before: const data = await languageTrainingData(id, token);
 * After:  const { data } = useCourseDetails(id);
 */

import { makeGetRequest } from '../lib/api/helpers';

export const languageTrainingData = async (id: string | number, accessToken: string) => {
  try {
    return await makeGetRequest(`get-language-training-data/${id}`);
  } catch (error) {
    console.error('Error fetching language training data:', error);
    throw error;
  }
};
