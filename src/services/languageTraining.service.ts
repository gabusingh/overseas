import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

export const languageTrainingData = async (id: string | number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'get-language-training-data/' + id, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching language training data:', error);
    throw error;
  }
};
