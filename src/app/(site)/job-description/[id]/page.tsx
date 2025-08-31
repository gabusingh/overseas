"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Separator } from '../../../../components/ui/separator';
import { getJobById, applyJobApi, saveJobById } from '../../../../services/job.service';
import { useGlobalState } from '../../../../contexts/GlobalProvider';
import { getStoredToken } from '../../../../lib/auth';
import { toast } from 'sonner';
import Link from 'next/link';
import Head from 'next/head';
import ProfileCompletionModal from '../../../../components/ProfileCompletionModal';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Building, 
  FileText, 
  Heart,
  Share2,
  User,
  Briefcase,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

// Complete job data interface matching legacy structure
interface JobData {
  id: number;
  jobID: string;
  jobTitle: string;
  jobDescription: string;
  jobWages: number;
  jobWagesCurrencyType: string;
  jobLocationCountry: {
    id: number;
    name: string;
    countryFlag: string;
  };
  occupation: {
    id: number;
    title: string;
    name: string;
  };
  cmpName: string;
  companyName: string;
  jobVacancyNo: number;
  jobAgeLimit: string;
  passport_type: string;
  passportType: string;
  contract_period: string;
  jobExpDuration: string;
  jobExpTypeReq: string;
  jobMode: string;
  jobWorkingDay: string;
  jobWorkingHour: string;
  jobOvertime: string;
  salary_negotiable: boolean;
  jobDeadline: string;
  jobPhoto: string;
  totalAppliedCandidates: number;
  appliedStatus: boolean;
  required_documents?: string[];
  jobBenefits?: Array<{
    id: number;
    name: string;
    icon?: string;
  }>;
  jobPerks?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  company?: {
    id: number;
    name: string;
    logo?: string;
    description?: string;
  };
  isWishListed?: boolean;
  jobPublishedDate?: string;
  jobLocation?: string;
  jobType?: string;
  jobCategory?: string;
  skills?: Array<{
    id: number;
    skill: string;
  }>;
  jobAccommodation?: string;
  jobFood?: string;
}

export default function JobDescriptionPage() {
  const params = useParams();
  const router = useRouter();
  const { globalState } = useGlobalState();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isWishListed, setIsWishListed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchJobDetails();
    }
  }, [params.id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await getJobById(params.id as string);
      
      // Extract job data from different possible response structures
      let jobResponse = null;
      if (response?.data?.jobs) {
        jobResponse = response.data.jobs;
      } else if (response?.jobs) {
        jobResponse = response.jobs;
      } else if (response?.data) {
        jobResponse = response.data;
      }
      
      if (jobResponse) {
        // Map the API response to our JobData interface
        const mappedJobData: JobData = {
          id: jobResponse.id,
          jobID: jobResponse.jobID,
          jobTitle: jobResponse.jobTitle,
          jobDescription: jobResponse.jobDescription || '',
          jobWages: jobResponse.jobWages || 0,
          jobWagesCurrencyType: jobResponse.jobWagesCurrencyType || '',
          jobLocationCountry: jobResponse.jobLocationCountry || { id: 0, name: '', countryFlag: '' },
          occupation: {
            id: parseInt(jobResponse.jobOccupation_id) || 0,
            title: jobResponse.jobOccupation || '',
            name: jobResponse.jobOccupation || ''
          },
          cmpName: jobResponse.cmpName || jobResponse.companyName || '',
          companyName: jobResponse.companyName || jobResponse.cmpName || '',
          jobVacancyNo: parseInt(jobResponse.jobVacancyNo) || 0,
          jobAgeLimit: jobResponse.jobAgeLimit || '',
          passport_type: jobResponse.passportType || '',
          passportType: jobResponse.passportType || '',
          contract_period: jobResponse.contract_period || '',
          jobExpDuration: jobResponse.jobExpDuration || '',
          jobExpTypeReq: jobResponse.jobExpTypeReq || '',
          jobMode: jobResponse.jobMode || '',
          jobWorkingDay: jobResponse.jobWorkingDay || '',
          jobWorkingHour: jobResponse.jobWorkingHour || '',
          jobOvertime: jobResponse.jobOvertime || '',
          salary_negotiable: jobResponse.salary_negotiable || false,
          jobDeadline: jobResponse.jobDeadline || '',
          jobPhoto: jobResponse.jobPhoto || '',
          totalAppliedCandidates: jobResponse.totalAppliedCandidates || 0,
          appliedStatus: jobResponse.appliedStatus || false,
          required_documents: jobResponse.required_documents || [],
          jobBenefits: jobResponse.jobBenefits || [],
          jobPerks: jobResponse.jobPerks || [],
          company: jobResponse.company || null,
          isWishListed: jobResponse.isWishListed || false,
          jobPublishedDate: jobResponse.jobPublishedDate || jobResponse.created_at || '',
          jobLocation: jobResponse.jobLocation || '',
          jobType: jobResponse.jobType || '',
          jobCategory: jobResponse.jobCategory || '',
          skills: jobResponse.skills || [],
          jobAccommodation: jobResponse.jobAccommodation || '',
          jobFood: jobResponse.jobFood || ''
        };
        
        setJobData(mappedJobData);
        setIsWishListed(mappedJobData.isWishListed || false);
      } else {
        throw new Error('Job not found');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details. Please try again.');
      router.push('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async () => {
    // Check authentication exactly like the old code using globalState
    if (!globalState?.user) {
      toast.warning("Please login to apply");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    if (!jobData) return;

    let payload = {
      id: jobData.id,
      "apply-job": "",
    };
    
    setApplying(true);
    
    try {
      let response = await applyJobApi(
        payload,
        globalState?.user?.access_token
      );
      if (response?.data?.msg == "Job Applied Successfully") {
        toast.success(response?.data?.msg);
        // Update applied status
        setJobData(prev => prev ? {...prev, appliedStatus: true} : prev);
      } else if (response?.data?.error === "You did not fill mandatory fields.") {
        // Show profile completion modal instead of redirecting
        setShowProfileModal(true);
      } else {
        toast.error(response?.data?.error || "Something went wrong");
      }
    } catch (error: any) {
      console.error('Apply job error:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Internal Server Error";
      if (errorMessage === "You did not fill mandatory fields.") {
        // Show profile completion modal instead of redirecting
        setShowProfileModal(true);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    const accessToken = getStoredToken();
    if (!accessToken) {
      toast.warning('Please login to save jobs');
      router.push('/login');
      return;
    }

    if (!jobData) return;

    try {
      setSaving(true);
      const response = await saveJobById(jobData.id, accessToken);
      
      if (response?.data?.success) {
        setIsWishListed(!isWishListed);
        toast.success(isWishListed ? 'Job removed from saved jobs' : 'Job saved successfully!');
      } else {
        toast.error('Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleShareJob = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: jobData?.jobTitle,
          text: `Check out this job opportunity: ${jobData?.jobTitle}`,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Job link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing job:', error);
      toast.error('Failed to share job');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
          <div className="h-64 bg-gray-300 rounded mb-6"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <Link href="/jobs">
          <Button>Browse All Jobs</Button>
        </Link>
      </div>
    );
  }

  // Format occupation title/name
  const occupationTitle = typeof jobData.occupation === 'object' 
    ? (jobData.occupation?.title || jobData.occupation?.name || 'Not specified')
    : (jobData.occupation || 'Not specified');

  return (
    <>
      <Head>
        <title>{jobData.jobTitle} - {jobData.jobLocationCountry?.name} | Overseas.ai</title>
        <meta name="description" content={`${jobData.jobTitle} job opportunity in ${jobData.jobLocationCountry?.name}. Salary: ${jobData.jobWages} ${jobData.jobWagesCurrencyType}. Apply now!`} />
        <meta name="keywords" content={`${jobData.jobTitle}, overseas jobs, ${jobData.jobLocationCountry?.name} jobs, ${occupationTitle}, international jobs`} />
        <meta property="og:title" content={`${jobData.jobTitle} - ${jobData.jobLocationCountry?.name}`} />
        <meta property="og:description" content={`${jobData.jobTitle} job opportunity. Apply now at Overseas.ai!`} />
        <meta property="og:image" content={jobData.jobPhoto} />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium truncate max-w-xs">{jobData.jobTitle}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header Card */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Job ID: {jobData.jobID || jobData.id}
                        </Badge>
                        {jobData.jobPublishedDate && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(jobData.jobPublishedDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                      
                      <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                        {jobData.jobTitle}
                      </CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://backend.overseas.ai/storage/uploads/countryFlag/${jobData.jobLocationCountry?.countryFlag}`}
                            alt={`${jobData.jobLocationCountry?.name} flag`}
                            className="w-5 h-4 rounded-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{jobData.jobLocationCountry?.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-green-500" />
                          <span>{jobData.companyName || jobData.cmpName || 'Company Name Not Available'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-purple-500" />
                          <Badge variant="outline">{occupationTitle}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <Button 
                          onClick={handleShareJob}
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                    
                    {jobData.jobPhoto && (
                      <div className="relative">
                        <img
                          src={jobData.jobPhoto}
                          alt={`${jobData.jobTitle} job`}
                          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/default-job.png';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* Job Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-600">Salary</span>
                      </div>
                      <p className="text-lg font-bold text-green-700">
                        {jobData.jobWages} {jobData.jobWagesCurrencyType}
                      </p>
                      {jobData.salary_negotiable && (
                        <p className="text-xs text-gray-500 mt-1">Negotiable</p>
                      )}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">Age Limit</span>
                      </div>
                      <p className="text-lg font-bold text-blue-700">{jobData.jobAgeLimit || 'Not specified'}</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-600">Passport Type</span>
                      </div>
                      <p className="text-lg font-bold text-purple-700">
                        {jobData.passportType || jobData.passport_type || 'Any'}
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-gray-600">Experience</span>
                      </div>
                      <p className="text-lg font-bold text-orange-700">
                        {jobData.jobExpTypeReq || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Skills Section */}
                  {jobData.skills && jobData.skills.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {jobData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {skill.skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Benefits Section */}
                  {(jobData.jobAccommodation === 'Yes' || jobData.jobFood === 'Yes') && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-green-600" />
                        Additional Benefits
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {jobData.jobAccommodation === 'Yes' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Building className="w-3 h-3 mr-1" />
                            Accommodation Provided
                          </Badge>
                        )}
                        {jobData.jobFood === 'Yes' && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            🍽️ Food Provided
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Additional Job Information */}
                  {(jobData.jobVacancyNo || jobData.contract_period || jobData.jobMode || jobData.jobWorkingDay || jobData.jobWorkingHour || jobData.jobOvertime) && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Additional Job Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {jobData.jobVacancyNo && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Vacancy Number:</span>
                            <span className="font-semibold">{jobData.jobVacancyNo}</span>
                          </div>
                        )}
                        {jobData.contract_period && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Contract Period:</span>
                            <span className="font-semibold">{jobData.contract_period}</span>
                          </div>
                        )}
                        {jobData.jobMode && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Job Mode:</span>
                            <span className="font-semibold">{jobData.jobMode}</span>
                          </div>
                        )}
                        {jobData.jobWorkingDay && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Working Days:</span>
                            <span className="font-semibold">{jobData.jobWorkingDay}</span>
                          </div>
                        )}
                        {jobData.jobWorkingHour && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Working Hours:</span>
                            <span className="font-semibold">{jobData.jobWorkingHour}</span>
                          </div>
                        )}
                        {jobData.jobOvertime && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Overtime:</span>
                            <span className="font-semibold">{jobData.jobOvertime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Required Documents */}
                  {jobData.required_documents && jobData.required_documents.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-600" />
                        Required Documents
                      </h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <ul className="list-disc list-inside space-y-2">
                          {jobData.required_documents.map((doc, index) => (
                            <li key={index} className="text-sm text-red-800">
                              <CheckCircle className="w-4 h-4 inline mr-2 text-red-600" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-8" />
                  
                  {/* Job Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-blue-600" />
                      Job Description
                    </h3>
                    <div 
                      className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: jobData.jobDescription || '<p class="text-gray-500 italic">No detailed description available for this job.</p>' 
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Job Summary Card */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Job Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Company</p>
                      <p className="font-semibold text-gray-900">{jobData.companyName || jobData.cmpName || 'Not specified'}</p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-red-500" />
                        Application Deadline
                      </p>
                      <p className="font-semibold text-red-600">
                        {jobData.jobDeadline ? new Date(jobData.jobDeadline).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        Total Applications
                      </p>
                      <p className="font-semibold text-blue-600">{jobData.totalAppliedCandidates || 0} candidates</p>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {jobData.appliedStatus ? (
                        <Button className="w-full" disabled variant="outline">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Already Applied
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                          onClick={handleApplyJob}
                          disabled={applying}
                        >
                          {applying ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Applying...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Apply Now
                            </div>
                          )}
                        </Button>
                      )}

                      <Button 
                        variant="outline" 
                        className="w-full border-2 hover:bg-red-50 hover:border-red-300" 
                        onClick={handleSaveJob}
                        disabled={saving}
                      >
                        {saving ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Heart className={`w-4 h-4 ${isWishListed ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                            {isWishListed ? 'Saved' : 'Save Job'}
                          </div>
                        )}
                      </Button>
                    </div>

                    {!globalState?.user && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Login Required</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              Please <Link href="/login" className="underline font-medium">login</Link> to apply for jobs or save them.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Completion Modal */}
      {showProfileModal && jobData && (
        <ProfileCompletionModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          jobId={jobData.id}
          onSuccess={() => {
            setShowProfileModal(false);
            // Update applied status
            setJobData(prev => prev ? {...prev, appliedStatus: true} : prev);
            toast.success('Profile updated and job application submitted successfully!');
          }}
        />
      )}
    </>
  );
}
