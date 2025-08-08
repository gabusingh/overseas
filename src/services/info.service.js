import axios from 'axios';

// Define your API base URL
const BASE_URL = 'https://backend.overseas.ai/api/';
// const BASE_URL = "https://test.overseas.ai/api/"; // test api

// Function to get state list
export const getState = async formData => {
  try {
    const response = await axios.get(BASE_URL + 'state-list');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Function to get district list
export const getDistrict = async data => {
  try {
    const response = await axios.get(BASE_URL + 'district-list', {
      params: {state_id:data},
    });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Function to get job occupation list
export const getOccupations = async data => {
  try {
    const response = await axios.get(BASE_URL + 'get-occupations');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Function to get  occupation wise skill
export const getSkillsByOccuId = async (occuId) => {
  try {
    const response = await axios.get(BASE_URL + 'get-occupations/'+ occuId);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Function to get job occupation list
export const getCountries = async data => {
  try {
    const response = await axios.get(BASE_URL + 'country-list');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getCountriesForJobs = async data => {
  try {
    const response = await axios.get(BASE_URL + 'country-list-for-jobs');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
// Function to get video list/contries/occupation(job title)/skills/topprofile
export const getHomeData = async data => {
  try {
    const response = await axios.get(BASE_URL + 'home-page-data');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getSuccessNotification = async data => {
  try {
    const response = await axios.get(BASE_URL + 'show-success-notification');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Function to get ps list
export const getPs = async district_id => {
  try {
    const response = await axios.get(BASE_URL + 'ps-list', {
      params: { district_id: district_id }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
// Function to get panchayat list
export const getPanchayat = async ps_id => {
  try {
    const response = await axios.get(BASE_URL + 'panchayat-list',{
      params: { ps_id: ps_id }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Function to get village list
export const getVillage = async ps_id => {
  try {
    const response = await axios.get(BASE_URL + 'village-list', {
      params: { ps_id: ps_id }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


// Function to get country code list
export const getCountryCode = async ps_id => {
  try {
    const response = await axios.get(BASE_URL + 'country-code-list');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Function to get version code
export const getVersionCode = async () => {
  try {
    const response = await axios.get(BASE_URL + 'check-version');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Function to get news feed
export const getNewsFeedData = async () => {
  try {
    const response = await axios.get(BASE_URL + 'get-news-feed');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};