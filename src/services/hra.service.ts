import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

// Interface for company data
interface Company {
  id: number;
  cmpName: string;
  cmpLogoS3?: string;
  cmpDescription?: string;
  jobCount?: number;
}

interface CompanyListResponse {
  cmpData: Company[];
  message?: string;
  success?: boolean;
};

// Interface for HR Details
export interface HrDetails {
  id: number;
  empId: string;
  empName: string;
  empPhoto?: string;
  empEmail: string;
  empMobile: string;
  empDob?: string;
  empGender?: string;
  empMaritalStatus?: string;
  empAddress?: string;
  empState?: string;
  empDistrict?: string;
  empPincode?: string;
  empExperience?: string;
  empOccupation?: string;
  empSkills?: string;
  empEducation?: string;
  empLanguages?: string;
  empStatus?: string;
  created_at: string;
  updated_at: string;
  cmpData?: {
    id: number;
    cmpName: string;
    cmpLogoS3?: string;
    cmpDescription?: string;
    cmpEmail?: string;
    cmpPhone?: string;
    cmpAddress?: string;
    cmpWebsite?: string;
    cmpIndustry?: string;
    cmpSize?: string;
    cmpFoundedYear?: string;
    cmpGstNumber?: string;
    cmpPanNumber?: string;
    cmpRegistrationNumber?: string;
    activeState?: string;
    created_at?: string;
    updated_at?: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    type: string;
    phone?: string;
    created_at: string;
    updated_at: string;
  };
}

// Interface for HRA Dashboard Data
export interface HraDashboardData {
  totalPostedJobs: number;
  totalAppliedCandidates: number;
  totalPostedBulkHiring: number;
  latestPostedJobs?: Array<{
    id: number;
    jobID: string;
    jobTitle: string;
    jobVacancyNo: string;
    jobDeadline: string;
    jobWages: string;
    country_location: string;
    occupation: string;
    jobAgeLimit: string;
    passportType: string;
    jobExpTypeReq: string;
    totalAppliedCandidates: number;
    created_at: string;
    jobPhoto: string;
    jobLocationCountry: {
      id: number;
      name: string;
      currencyName: string;
      currencySymbol: string;
      countryFlag: string;
    };
  }>;
  latestAppliedCandidates?: Array<{
    id: number;
    empName: string;
    empPhoto: string;
    empDob: string;
    age: number;
    appliedOn: string;
    empState: string;
    empDistrict: string;
  }>;
  // Legacy support for existing components
  recentApplications?: Array<{
    candidateName: string;
    jobTitle: string;
    appliedOn: string;
    status: string;
  }>;
  recentJobs?: Array<{
    jobTitle: string;
    location: string;
    applicationsCount: number;
  }>;
}

// Interface for HRA Registration
export interface HraRegistrationData {
  cmpOtp: string;
  countryCode: string;
  cmpOfficialMob: string;
  cmpName: string;
  source: string;
  cmpEmail: string;
  cmpContPerson: string;
  RaLicenseNumber: string;
  cmpOfficialAddress: string;
  cmpDescription: string;
  cmpPin: string;
  cmpLogo?: File;
  password: string;
  password_confirmation: string;
}

export const getAllCompanies = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}get-all-companies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all companies:", error);
    throw error;
  }
};

// Function to get HRA/Company list for public companies page
export const getHraList = async () => {
  try {

    const response = await axios.get(`${BASE_URL}get-all-companies`);

    return response.data;
  } catch (error) {
    console.error("Error fetching HRA list:", error);
    throw error;
  }
};

export const getCompanyDetails = async (companyId: string, token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}company/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};

export const getJobsPostedByHra = async (hraId: string, token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}jobs-posted-by-hra/${hraId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs posted by HRA:", error);
    throw error;
  }
};

export const getHrDetails = async (token: string): Promise<HrDetails> => {
  try {
    const response = await axios.get(`${BASE_URL}get-hr-details`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching HR details:", error);
    throw error;
  }
};

// Enhanced HR details function with data processing
export const getEnhancedHrDetails = async (token: string): Promise<any | null> => {
  try {

    const response = await getHrDetails(token);


    // Handle the actual API response structure
    let hrData;
    if (response.data && Array.isArray(response.data)) {
      // API returns an array of HR records, take the first one
      hrData = response.data[0];

    } else if (response.data) {
      // If response has a data property but it's not an array
      hrData = response.data;
    } else {
      // Otherwise, use the response directly
      hrData = response;
    }

    if (!hrData) {

      return null;
    }



    // Map the actual field names from the API response
    const mappedData = {
      // Original data
      data: hrData,
      // Mapped fields based on actual API response structure
      name: hrData.hrName || hrData.name || hrData.empName || hrData.full_name,
      email: hrData.hrEmail || hrData.email || hrData.empEmail || hrData.email_address,
      phone: hrData.hrContact || hrData.phone || hrData.empMobile || hrData.phone_number || hrData.mobile,
      company_name: hrData.company_name || hrData.cmpName || hrData.company,
      // Include all original fields
      ...hrData
    };


    return mappedData;

  } catch (error) {
    console.error('❌ Error fetching enhanced HR details:', error);
    throw error; // Re-throw to let the calling code handle it
  }
};

export const getHraDashboardAnalytics = async (token: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}get-hra-dashboard-analytics`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching HRA dashboard analytics:", error);
    throw error;
  }
};

export const createJob = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'create-job', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Alias for compatibility with legacy code
export const createJobByHr = createJob;

// Wrapper function to use the dashboard analytics API for HRA dashboard data
export const getHraDashboardData = async (token: string): Promise<HraDashboardData> => {
  try {
    const response = await getHraDashboardAnalytics(token);
    const data = response.data || response;

    // Transform the API response to include backward compatibility
    const transformedData: HraDashboardData = {
      totalPostedJobs: data.totalPostedJobs || 0,
      totalAppliedCandidates: data.totalAppliedCandidates || 0,
      totalPostedBulkHiring: data.totalPostedBulkHiring || 0,
      latestPostedJobs: data.latestPostedJobs || [],
      latestAppliedCandidates: data.latestAppliedCandidates || [],

      // Transform new API format to legacy format for backward compatibility
      recentApplications: (data.latestAppliedCandidates || []).map((candidate: any) => {
        // Try to get job title from different possible fields
        const jobTitle = candidate.jobTitle ||
          candidate.job_title ||
          candidate.position ||
          candidate.jobOccupation ||
          'Applied for Position';

        // Try to get status from different possible fields
        const status = candidate.status ||
          candidate.applicationStatus ||
          candidate.empStatus ||
          'Applied';

        // Format the applied date properly
        const appliedDate = candidate.appliedOn ||
          candidate.applied_on ||
          candidate.created_at ||
          new Date().toISOString().split('T')[0];

        return {
          candidateName: candidate.empName || candidate.candidateName || 'Unknown Candidate',
          jobTitle,
          appliedOn: appliedDate,
          status
        };
      }),
      recentJobs: (data.latestPostedJobs || []).map((job: any) => ({
        jobTitle: job.jobTitle || 'Untitled Job',
        location: job.country_location || job.jobLocationCountry?.name || 'Unknown Location',
        applicationsCount: job.totalAppliedCandidates || 0
      }))
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching HRA dashboard data:', error);
    throw error;
  }
};

export const getHraJobs = async (hraId: string, accessToken: string) => {
  try {
    const response = await getJobsPostedByHra(hraId, accessToken);
    return response;
  } catch (error) {
    console.error('Error fetching HRA jobs:', error);
    throw error;
  }
};

export const editJob = async (jobId: number, formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + `edit-job/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error editing job:', error);
    throw error;
  }
};

export const getJobApplications = async (jobId: number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `job-applications/${jobId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

export const getRecommendedCandidates = async (jobId?: number, accessToken?: string) => {
  try {
    // Using the correct API endpoint with typo "recommandations" as per backend
    const url = jobId ? `get-job-wise-recommandations/${jobId}` : 'recommended-candidates';
    const response = await axios.get(BASE_URL + url, {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {}
    });
    return response;
  } catch (error) {
    console.error('Error fetching recommended candidates:', error);
    throw error;
  }
};

// Alternative function name matching the API typo
export const getJobWiseRecommandations = async (jobId: number, accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + `get-job-wise-recommandations/${jobId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    throw error;
  }
};

export const getHraNotifications = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'hra-notifications', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching HRA notifications:', error);
    throw error;
  }
};

export const createBulkHire = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'bulk-hire', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating bulk hire:', error);
    throw error;
  }
};

// Get all created jobs (used for view jobs section)
export const getAllCreatedJobs = async (token: string) => {
  try {
    const formData = new FormData();
    const response = await axios.post(`${BASE_URL}all-created-jobs`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all created jobs:', error);
    throw error;
  }
};

// Get applied candidates list with pagination
export const getAppliedCandidatesList = async (token: string, pageNo: number = 1) => {
  try {
    const formData = new FormData();
    formData.append('pageNo', pageNo.toString());

    const response = await axios.post(`${BASE_URL}applied-candidates-list`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching applied candidates list:', error);
    throw error;
  }
};

// Get notifications for HRA
export const getNotifications = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}get-notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// HRA Registration function
export const registerHra = async (registrationData: HraRegistrationData) => {
  try {
    const formData = new FormData();
    
    // Append all the registration data to FormData
    Object.entries(registrationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'cmpLogo' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await axios.post(`${BASE_URL}register-hra`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error registering HRA:', error);
    throw error;
  }
};
