"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { getUserDashboard, getProfileStrength, experienceList, passportView, getUserDetails, getEmpDataForEdit } from "../../../services/user.service";
import { getAppliedJobs, getSavedJobs } from "../../../services/job.service";
import { getNotifications } from "../../../services/notification.service";

interface User {
  id: number;
  type: string;
  email: string;
  phone: string;
  name?: string;
  profile_image?: string;
  location?: string;
  occupation?: string;
  experience_years?: number;
  gender?: string;
  dob?: string;
  education?: string;
  technical_education?: string;
  skills?: string;
  occupation_id?: string;
  daily_wage?: string;
  expected_income?: string;
  state?: string;
  district?: string;
  pin_code?: string;
  passport_status?: string;
  migration_experience?: string;
  relocation_interest?: string;
  reference_name?: string;
  reference_phone?: string;
}

interface DashboardData {
  profile_strength?: number;
  applied_jobs_count?: number;
  saved_jobs_count?: number;
  notifications_count?: number;
  recent_applications?: any[];
  profile_views?: number;
}

export default function MyProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [experiences, setExperiences] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setGlobalState } = require("@/contexts/GlobalProvider").useGlobalState();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    // Try both possible localStorage keys for user data (loggedUser and user)
    let userData = localStorage.getItem("loggedUser") || localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/login");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadUserData(token);
      
      // Handle tab query parameter
      const tabParam = searchParams.get('tab');
      if (tabParam && ['overview', 'personal', 'experience', 'applied', 'saved', 'notifications', 'documents'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router, searchParams]);

  const loadUserData = async (token: string) => {
    try {
      const [
        dashboardResponse, 
        empDataResponse, 
        experiencesResponse, 
        notificationsResponse,
        appliedJobsResponse,
        savedJobsResponse,
        profileStrengthResponse
      ] = await Promise.allSettled([
        getUserDashboard(token),
        getEmpDataForEdit(token), // Get complete user profile data
        experienceList(token),
        getNotifications(token),
        getAppliedJobs(token),
        getSavedJobs(token),
        getProfileStrength(token)
      ]);

      // Handle dashboard data with fallback
      let dashboardData: DashboardData = {
        profile_strength: 65,
        applied_jobs_count: 0,
        saved_jobs_count: 0,
        notifications_count: 0,
        recent_applications: [],
        profile_views: 0
      };

      if (dashboardResponse.status === 'fulfilled') {
        dashboardData = { ...dashboardData, ...dashboardResponse.value };
      } else {
        console.warn('Dashboard API failed, using fallback data:', dashboardResponse.reason);
      }
      
      // Update user data with complete profile information from backend
      if (empDataResponse.status === 'fulfilled' && empDataResponse.value) {
        const empData = empDataResponse.value;
        // Merge localStorage user data with backend profile data
        const currentUser = JSON.parse(localStorage.getItem("loggedUser") || localStorage.getItem("user") || '{}');
        const updatedUser = {
          ...currentUser,
          // Basic information
          name: empData.empName || currentUser.name,
          email: empData.empEmail || currentUser.email,
          phone: empData.empWhatsapp || currentUser.phone,
          
          // Personal details
          gender: empData.empGender || currentUser.gender,
          dob: empData.empDob || currentUser.dob,
          date_of_birth: empData.empDob || currentUser.date_of_birth || currentUser.dob,
          nationality: empData.empNationality || currentUser.nationality,
          
          // Professional information
          education: empData.empEdu || currentUser.education,
          technical_education: empData.empTechEdu || currentUser.technical_education,
          skills: empData.empSkill || currentUser.skills,
          occupation: empData.empOccuId || currentUser.occupation,
          occupation_id: empData.empOccuId || currentUser.occupation_id,
          experience_years: currentUser.experience_years || 0,
          
          // Contact and location information
          state: empData.empState || currentUser.state,
          district: empData.empDistrict || currentUser.district,
          city: empData.empDistrict || currentUser.city || currentUser.district,
          pin_code: empData.empPin || currentUser.pin_code,
          postal_code: empData.empPin || currentUser.postal_code || currentUser.pin_code,
          address: currentUser.address || "",
          location: empData.empState && empData.empDistrict ? `${empData.empDistrict}, ${empData.empState}` : currentUser.location,
          
          // Employment details
          daily_wage: empData.empDailyWage || currentUser.daily_wage,
          expected_income: empData.empExpectedMonthlyIncome || currentUser.expected_income,
          
          // Migration and relocation
          passport_status: empData.empPassportQ || currentUser.passport_status,
          migration_experience: empData.empInternationMigrationExp || currentUser.migration_experience,
          relocation_interest: empData.empRelocationIntQ || currentUser.relocation_interest,
          
          // Emergency contacts
          reference_name: empData.empRefName || currentUser.reference_name,
          reference_phone: empData.empRefPhone || currentUser.reference_phone,
          emergency_contact_name: empData.empRefName || currentUser.emergency_contact_name || currentUser.reference_name,
          emergency_contact_phone: empData.empRefPhone || currentUser.emergency_contact_phone || currentUser.reference_phone,
          
          // Additional fields that might exist
          about: currentUser.about || "",
          profile_image: currentUser.profile_image || empData.empProfileImage || ""
        };
        
        console.log('MyProfile: Updated user data with backend info:', updatedUser);
        setUser(updatedUser);
        
        // Update localStorage with complete data for both keys
        localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        console.log('MyProfile: Saved complete user data to localStorage');
      }
      
      // Handle applied jobs count and data
      if (appliedJobsResponse.status === 'fulfilled' && appliedJobsResponse.value?.data) {
        const appliedJobsData = Array.isArray(appliedJobsResponse.value.data) ? appliedJobsResponse.value.data : [];
        setAppliedJobs(appliedJobsData);
        dashboardData.applied_jobs_count = appliedJobsData.length || 0;
      } else if (appliedJobsResponse.status === 'rejected') {
        console.warn('Applied jobs API failed:', appliedJobsResponse.reason);
        setAppliedJobs([]);
      } else {
        setAppliedJobs([]);
      }
      
      // Handle saved jobs count and data
      if (savedJobsResponse.status === 'fulfilled' && savedJobsResponse.value?.data) {
        const savedJobsData = Array.isArray(savedJobsResponse.value.data) ? savedJobsResponse.value.data : [];
        setSavedJobs(savedJobsData);
        dashboardData.saved_jobs_count = savedJobsData.length || 0;
      } else if (savedJobsResponse.status === 'rejected') {
        console.warn('Saved jobs API failed:', savedJobsResponse.reason);
        setSavedJobs([]);
      } else {
        setSavedJobs([]);
      }
      
      // Handle profile strength from dedicated endpoint
      if (
        profileStrengthResponse.status === 'fulfilled' &&
        profileStrengthResponse.value?.data?.profileStrength
      ) {
        dashboardData.profile_strength = profileStrengthResponse.value.data.profileStrength;
      }
      
      setDashboardData(dashboardData);
      
      // Handle experiences with fallback
      if (experiencesResponse.status === 'fulfilled') {
        setExperiences(experiencesResponse.value?.experiences || experiencesResponse.value?.data || []);
      } else {
        console.warn('Experience API failed, using empty array:', experiencesResponse.reason);
        setExperiences([]);
      }
      
      // Handle notifications with fallback
      if (notificationsResponse.status === 'fulfilled') {
        const notifs = notificationsResponse.value?.notifications || notificationsResponse.value?.data || [];
        setNotifications(notifs);
        dashboardData.notifications_count = notifs.length;
        setDashboardData({...dashboardData});
      } else {
        console.warn('Notifications API failed, using empty array:', notificationsResponse.reason);
        setNotifications([]);
      }
      
    } catch (error) {
      console.error("Error loading user data:", error);
      // Set fallback data for all sections
      setDashboardData({
        profile_strength: 65,
        applied_jobs_count: 0,
        saved_jobs_count: 0,
        notifications_count: 0,
        recent_applications: [],
        profile_views: 0
      });
      setExperiences([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("loggedUser");
  setGlobalState((prev: any) => ({ ...prev, user: null }));
  toast.success("Logged out successfully");
  router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const TabButton = ({ tabKey, label, active }: { tabKey: string; label: string; active: boolean }) => (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        active
          ? 'border-blue-500 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
      onClick={() => setActiveTab(tabKey)}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  {user.name && user.name.length > 0
                    ? user.name[0].toUpperCase()
                    : user.email && user.email.length > 0
                      ? user.email[0].toUpperCase()
                      : "?"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 heading" style={{ color: '#17487f' }}>
                {user.name || 'My Profile'}
              </h1>
              <p className="text-gray-600">{user.occupation || user.type}</p>
              {user.location && <p className="text-sm text-gray-500">{user.location}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => router.push('/edit-profile')} className="bg-blue-600 hover:bg-blue-700">
              Edit Profile
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Strength</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData?.profile_strength || 0}%
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applied Jobs</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData?.applied_jobs_count || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">📝</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboardData?.saved_jobs_count || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm">💾</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardData?.notifications_count || notifications.length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">🔔</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 p-1">
            <TabButton tabKey="overview" label="Overview" active={activeTab === 'overview'} />
            <TabButton tabKey="personal" label="Personal Info" active={activeTab === 'personal'} />
            <TabButton tabKey="experience" label="Experience" active={activeTab === 'experience'} />
            <TabButton tabKey="applied" label="Applied Jobs" active={activeTab === 'applied'} />
            <TabButton tabKey="saved" label="Saved Jobs" active={activeTab === 'saved'} />
            <TabButton tabKey="notifications" label="Notifications" active={activeTab === 'notifications'} />
            <TabButton tabKey="documents" label="Documents" active={activeTab === 'documents'} />
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                      <Link href="/job-applied">📝 View Applied Jobs</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/saved-jobs">💾 Saved Jobs</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/my-documents">📄 My Documents</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/job-search">🔍 Search Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Profile Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Profile Completion</span>
                          <span>{dashboardData?.profile_strength || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${dashboardData?.profile_strength || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Profile Views: {dashboardData?.profile_views || 0}</p>
                        <p>Experience: {user.experience_years || 0} years</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-800 mb-3">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">User Type</p>
                        <Badge variant={user.type === "person" ? "default" : "secondary"}>
                          {user.type}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="text-gray-900">{user.name || "Not provided"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                      
                      {(user as any).date_of_birth && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                          <p className="text-gray-900">{(user as any).date_of_birth}</p>
                        </div>
                      )}
                      
                      {user.gender && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Gender</p>
                          <p className="text-gray-900 capitalize">{user.gender}</p>
                        </div>
                      )}
                      
                      {(user as any).nationality && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nationality</p>
                          <p className="text-gray-900">{(user as any).nationality}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="pt-4 border-t">
                    <h4 className="text-base font-semibold text-gray-800 mb-3">Professional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.occupation && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Current Occupation</p>
                          <p className="text-gray-900">{user.occupation}</p>
                        </div>
                      )}
                      
                      {user.experience_years && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Years of Experience</p>
                          <p className="text-gray-900">{user.experience_years} years</p>
                        </div>
                      )}
                      
                      {user.skills && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-500">Skills</p>
                          <p className="text-gray-900">{user.skills}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-4 border-t">
                    <h4 className="text-base font-semibold text-gray-800 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.location && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p className="text-gray-900">{user.location}</p>
                        </div>
                      )}
                      
                      {user.state && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">State</p>
                          <p className="text-gray-900">{user.state}</p>
                        </div>
                      )}
                      
                      {(user.district || (user as any).city) && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">City</p>
                          <p className="text-gray-900">{user.district || (user as any).city}</p>
                        </div>
                      )}
                      
                      {(user.pin_code || (user as any).postal_code) && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Postal Code</p>
                          <p className="text-gray-900">{user.pin_code || (user as any).postal_code}</p>
                        </div>
                      )}
                      
                      {(user as any).address && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-500">Address</p>
                          <p className="text-gray-900">{(user as any).address}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  {(user.reference_name || (user as any).emergency_contact_name) && (
                    <div className="pt-4 border-t">
                      <h4 className="text-base font-semibold text-gray-800 mb-3">Emergency Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Contact Name</p>
                          <p className="text-gray-900">{user.reference_name || (user as any).emergency_contact_name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Contact Phone</p>
                          <p className="text-gray-900">{user.reference_phone || (user as any).emergency_contact_phone}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* About Me */}
                  {(user as any).about && (
                    <div className="pt-4 border-t">
                      <h4 className="text-base font-semibold text-gray-800 mb-3">About Me</h4>
                      <p className="text-gray-900">{(user as any).about}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <Button onClick={() => router.push('/edit-profile')} className="bg-blue-600 hover:bg-blue-700">
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-900">Work Experience</CardTitle>
                    <Button onClick={() => router.push('/add-experience')} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {experiences.length > 0 ? (
                    <div className="space-y-4">
                      {experiences.map((exp, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <h4 className="font-semibold text-gray-900">{exp.position || exp.title}</h4>
                          <p className="text-blue-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">
                            {exp.start_date} - {exp.end_date || 'Present'}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No work experience added yet</p>
                      <Button onClick={() => router.push('/add-experience')} className="bg-blue-600 hover:bg-blue-700">
                        Add Your First Experience
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.slice(0, 10).map((notification, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.created_at}</p>
                          </div>
                        </div>
                      ))}
                      <div className="text-center pt-4">
                        <Button asChild variant="outline">
                          <Link href="/notifications">View All Notifications</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No notifications yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'applied' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-900">Applied Jobs</CardTitle>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/jobs">Find More Jobs</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {appliedJobs.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600 mb-4">
                        <p>Total Applications: {appliedJobs.length}</p>
                      </div>
                      {appliedJobs.slice(0, 5).map((job, index) => (
                        <div key={job.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{job.jobTitle || job.title}</h4>
                            <Badge className={`text-xs ${
                              job.applicationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              job.applicationStatus === 'shortlisted' ? 'bg-green-100 text-green-800' :
                              job.applicationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {job.applicationStatus || 'Pending'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{job.companyName || job.company}</p>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Applied: {new Date(job.appliedOn || job.applied_date).toLocaleDateString()}</span>
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/applied-jobs`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="text-center pt-4">
                        <Button asChild variant="outline">
                          <Link href="/applied-jobs">View All Applications</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-4">📝</div>
                      <p className="text-gray-500 mb-4">No job applications yet</p>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/jobs">Start Applying</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-900">Saved Jobs</CardTitle>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/jobs">Find More Jobs</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {savedJobs.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600 mb-4">
                        <p>Total Saved: {savedJobs.length}</p>
                      </div>
                      {savedJobs.slice(0, 5).map((job, index) => (
                        <div key={job.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{job.job_title || job.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              💾 Saved
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{job.company_name || job.company}</p>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>📍 {job.location}{job.country && `, ${job.country}`}</span>
                            <div className="space-x-2">
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/job-description/${job.id}`}>View Job</Link>
                              </Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Apply Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="text-center pt-4">
                        <Button asChild variant="outline">
                          <Link href="/saved-jobs">View All Saved Jobs</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-4">💾</div>
                      <p className="text-gray-500 mb-4">No saved jobs yet</p>
                      <p className="text-sm text-gray-400 mb-4">Save jobs you're interested in by clicking the heart icon</p>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/jobs">Browse Jobs</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-900">My Documents</CardTitle>
                    <Button onClick={() => router.push('/upload-documents')} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="text-gray-400 mb-2">📄</div>
                      <p className="text-sm font-medium text-gray-900">Resume/CV</p>
                      <p className="text-xs text-gray-500">Upload your latest resume</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Upload Resume
                      </Button>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="text-gray-400 mb-2">🎓</div>
                      <p className="text-sm font-medium text-gray-900">Certificates</p>
                      <p className="text-xs text-gray-500">Upload certificates</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Upload Certificate
                      </Button>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="text-gray-400 mb-2">📋</div>
                      <p className="text-sm font-medium text-gray-900">Cover Letters</p>
                      <p className="text-xs text-gray-500">Manage cover letters</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Upload Cover Letter
                      </Button>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="text-gray-400 mb-2">🆔</div>
                      <p className="text-sm font-medium text-gray-900">ID Documents</p>
                      <p className="text-xs text-gray-500">Passport, ID, etc.</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Upload ID
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center pt-6 border-t">
                    <Button asChild variant="outline">
                      <Link href="/my-documents">View All Documents</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
