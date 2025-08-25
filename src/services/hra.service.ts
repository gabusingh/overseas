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
export const getEnhancedHrDetails = async (token: string): Promise<HrDetails | null> => {
  try {
    const response = await getHrDetails(token);
    const hrData = response.data || response;
    
    // Process and validate the HR data
    const processedHrData: HrDetails = {
      id: hrData.id || 0,
      empId: hrData.empId || '',
      empName: hrData.empName || hrData.name || 'Unknown HR',
      empPhoto: hrData.empPhoto && hrData.empPhoto !== 'null' ? hrData.empPhoto : undefined,
      empEmail: hrData.empEmail || hrData.email || '',
      empMobile: hrData.empMobile || hrData.phone || '',
      empDob: hrData.empDob,
      empGender: hrData.empGender,
      empMaritalStatus: hrData.empMaritalStatus,
      empAddress: hrData.empAddress,
      empState: hrData.empState,
      empDistrict: hrData.empDistrict,
      empPincode: hrData.empPincode,
      empExperience: hrData.empExperience,
      empOccupation: hrData.empOccupation,
      empSkills: hrData.empSkills,
      empEducation: hrData.empEducation,
      empLanguages: hrData.empLanguages,
      empStatus: hrData.empStatus || 'active',
      created_at: hrData.created_at || new Date().toISOString(),
      updated_at: hrData.updated_at || new Date().toISOString(),
      cmpData: hrData.cmpData ? {
        id: hrData.cmpData.id || 0,
        cmpName: hrData.cmpData.cmpName || 'Unknown Company',
        cmpLogoS3: hrData.cmpData.cmpLogoS3 && hrData.cmpData.cmpLogoS3 !== 'null' ? hrData.cmpData.cmpLogoS3 : undefined,
        cmpDescription: hrData.cmpData.cmpDescription,
        cmpEmail: hrData.cmpData.cmpEmail,
        cmpPhone: hrData.cmpData.cmpPhone,
        cmpAddress: hrData.cmpData.cmpAddress,
        cmpWebsite: hrData.cmpData.cmpWebsite,
        cmpIndustry: hrData.cmpData.cmpIndustry,
        cmpSize: hrData.cmpData.cmpSize,
        cmpFoundedYear: hrData.cmpData.cmpFoundedYear,
        cmpGstNumber: hrData.cmpData.cmpGstNumber,
        cmpPanNumber: hrData.cmpData.cmpPanNumber,
        cmpRegistrationNumber: hrData.cmpData.cmpRegistrationNumber,
        activeState: hrData.cmpData.activeState || 'active',
        created_at: hrData.cmpData.created_at,
        updated_at: hrData.cmpData.updated_at
      } : undefined,
      user: hrData.user ? {
        id: hrData.user.id || 0,
        name: hrData.user.name || hrData.empName || 'Unknown User',
        email: hrData.user.email || hrData.empEmail || '',
        email_verified_at: hrData.user.email_verified_at,
        type: hrData.user.type || 'company',
        phone: hrData.user.phone || hrData.empMobile,
        created_at: hrData.user.created_at || new Date().toISOString(),
        updated_at: hrData.user.updated_at || new Date().toISOString()
      } : undefined
    };
    
    return processedHrData;
  } catch (error) {
    console.error('Error fetching enhanced HR details:', error);
    return null;
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
    const url = jobId ? `recommended-candidates/${jobId}` : 'recommended-candidates';
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
