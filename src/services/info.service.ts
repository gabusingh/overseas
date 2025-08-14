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

export const getCompanies = async (page: number = 1) => {
  try {
    const response = await axios.get(BASE_URL + 'get-companies', {
      params: { page }
    });
    return response;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getCompanyById = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + 'get-company/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};

export const getTradeTestCenters = async () => {
  try {
    const response = await axios.get(BASE_URL + 'get-trade-test-centers');
    return response;
  } catch (error) {
    console.error('Error fetching trade test centers:', error);
    throw error;
  }
};

// New API for top countries hiring now - Updated to use correct endpoint
export const getTopCountriesHiring = async () => {
  try {
    // Use the correct working API endpoint
    const response = await axios.get(BASE_URL + 'country-list-for-jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching top countries hiring:', error);
    
    // Fallback 1: Try the general countries endpoint
    try {
      const fallbackResponse = await axios.get(BASE_URL + 'getCountriesForJobs');
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError);
      
      // Final fallback: Return empty data structure
      return { 
        countries: [],
        data: []
      };
    }
  }
};

// Utility function to normalize country hiring data - Updated for correct API response
export const normalizeCountryHiringData = (apiResponse: any) => {
  try {
    // Try different possible response structures
    let countries = [];
    
    if (apiResponse?.countries && Array.isArray(apiResponse.countries)) {
      countries = apiResponse.countries;
    } else if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      countries = apiResponse.data;
    } else if (apiResponse?.topCountries && Array.isArray(apiResponse.topCountries)) {
      countries = apiResponse.topCountries;
    } else if (apiResponse?.countriesWithJobs && Array.isArray(apiResponse.countriesWithJobs)) {
      countries = apiResponse.countriesWithJobs;
    }
    
    // Normalize the data structure for the correct API format
    return countries.map((country: any) => ({
      id: country.id || country.country_id || Math.random(),
      name: country.name || country.country_name || country.title || 'Unknown Country',
      countryFlag: country.countryFlag || country.flag || country.country_flag,
      jobCount: parseInt(country.totalJobs || country.jobCount || country.job_count || country.available_jobs || country.total_jobs || '0'),
      hiringTrend: country.totalJobs > 5 ? 'increasing' : country.totalJobs > 0 ? 'stable' : 'decreasing',
      averageSalary: country.currencyName ? `${country.currencyName} ${parseFloat(country.currencyValue || '0').toFixed(2)}` : undefined,
      popularSectors: country.popularSectors || country.sectors || country.industries || [],
      lastUpdated: country.lastUpdated || country.updated_at || country.last_updated || new Date().toISOString(),
      currencyName: country.currencyName,
      currencyValue: country.currencyValue,
      name_hi: country.name_hi,
      name_bn: country.name_bn,
      totalJobs: country.totalJobs
    }));
  } catch (error) {
    console.error('Error normalizing country hiring data:', error);
    return [];
  }
};
