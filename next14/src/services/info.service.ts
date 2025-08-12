import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

interface StateResponse {
  data: Array<{ id: number; name: string }>;
}

interface DistrictResponse {
  data: Array<{ id: number; name: string; state_id: number }>;
}

interface CountryResponse {
  data: Array<{ id: number; name: string }>;
}

interface OccupationResponse {
  data: Array<{ id: number; title: string; name: string }>;
}

interface HomeDataResponse {
  videos?: unknown[];
  countries?: Array<{ id: number; name: string }>;
  occupations?: Array<{ id: number; title: string; name: string }>;
  topProfile?: unknown[];
}

export const getState = async (): Promise<StateResponse> => {
  try {
    const response = await axios.get(BASE_URL + 'state-list');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getDistrict = async (stateId: number): Promise<DistrictResponse> => {
  try {
    const response = await axios.get(BASE_URL + 'district-list', {
      params: { state_id: stateId },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getOccupations = async (): Promise<OccupationResponse> => {
  try {
    const response = await axios.get(BASE_URL + 'get-occupations');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getSkillsByOccuId = async (occuId: number) => {
  try {
    const response = await axios.get(BASE_URL + 'get-occupations/' + occuId);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getCountries = async (): Promise<CountryResponse> => {
  try {
    const response = await axios.get(BASE_URL + 'country-list');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getCountriesForJobs = async (): Promise<CountryResponse> => {
  try {
    const response = await axios.get(BASE_URL + 'country-list-for-jobs');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getHomeData = async (): Promise<HomeDataResponse> => {
  try {
    const response = await axios.get(BASE_URL + 'home-page-data');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getSuccessNotification = async () => {
  try {
    const response = await axios.get(BASE_URL + 'show-success-notification');
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getPs = async (districtId: number) => {
  try {
    const response = await axios.get(BASE_URL + 'ps-list', {
      params: { district_id: districtId }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getPanchayat = async (psId: number) => {
  try {
    const response = await axios.get(BASE_URL + 'panchayat-list', {
      params: { ps_id: psId }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getVillage = async (psId: number) => {
  try {
    const response = await axios.get(BASE_URL + 'village-list', {
      params: { ps_id: psId }
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getCountryCode = async () => {
  try {
    const response = await axios.get(BASE_URL + 'country-code-list');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getVersionCode = async () => {
  try {
    const response = await axios.get(BASE_URL + 'check-version');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getNewsFeedData = async () => {
  try {
    const response = await axios.get(BASE_URL + 'get-news-feed');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
