import axios from 'axios';

// Define your API base URL
const BASE_URL = 'https://backend.overseas.ai/api/';
// const BASE_URL = "https://test.overseas.ai/api/"; // test api
export const languageTrainingData = async (id,access_token) => {
  try {
    const response = await axios.get(BASE_URL + 'get-language-training-data/'+id,  {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};





