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
        // Dashboard API failed, using fallback data
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
        
        setUser(updatedUser);
        
        // Update localStorage with complete data for both keys
        localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      // Handle applied jobs count and data
      if (appliedJobsResponse.status === 'fulfilled') {
        // Check for the correct response structure: response?.data?.jobs
        const appliedJobsData = appliedJobsResponse.value?.data?.jobs || appliedJobsResponse.value?.data || [];
        const safeAppliedJobsData = Array.isArray(appliedJobsData) ? appliedJobsData : [];
        setAppliedJobs(safeAppliedJobsData);
        dashboardData.applied_jobs_count = safeAppliedJobsData.length || 0;
      } else if (appliedJobsResponse.status === 'rejected') {
        setAppliedJobs([]);
      } else {
        setAppliedJobs([]);
      }
      
      // Handle saved jobs count and data
      if (savedJobsResponse.status === 'fulfilled') {
        // Check for the correct response structure: response?.data?.jobs
        const savedJobsData = savedJobsResponse.value?.data?.jobs || savedJobsResponse.value?.data || [];
        const safeSavedJobsData = Array.isArray(savedJobsData) ? savedJobsData : [];
        setSavedJobs(safeSavedJobsData);
        dashboardData.saved_jobs_count = safeSavedJobsData.length || 0;
      } else if (savedJobsResponse.status === 'rejected') {
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
        setExperiences([]);
      }
      
      // Handle notifications with fallback
      if (notificationsResponse.status === 'fulfilled') {
        const notifs = notificationsResponse.value?.notifications || notificationsResponse.value?.data || [];
        setNotifications(notifs);
        dashboardData.notifications_count = notifs.length;
        setDashboardData({...dashboardData});
      } else {
        setNotifications([]);
      }
      
    } catch (error) {
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
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
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
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-900">Notifications</CardTitle>
                    <div className="flex items-center gap-2">
                      {notifications.filter(n => !n.is_read && !n.isRead && !n.read_at).length > 0 && (
                        <Badge variant="destructive" className="text-xs px-2 py-1">
                          {notifications.filter(n => !n.is_read && !n.isRead && !n.read_at).length} New
                        </Badge>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={async () => {
                          const token = localStorage.getItem('access_token');
                          if (token && notifications.some(n => !n.is_read && !n.isRead)) {
                            try {
                              // Mark all as read
                              setNotifications(prev => prev.map(n => ({ ...n, is_read: true, isRead: true })));
                              toast.success('All notifications marked as read');
                            } catch (error) {
                            }
                          }
                        }}
                      >
                        Mark All Read
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {notifications.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {notifications.map((notification) => {
                        // Extract notification details with proper field mapping
                        const notificationId = notification.id || notification.notification_id || Math.random();
                        const title = notification.title || notification.subject || notification.heading || 'Notification';
                        const message = notification.message || notification.body || notification.content || notification.description || '';
                        const createdAt = notification.created_at || notification.createdAt || notification.date || '';
                        const isRead = notification.is_read || notification.isRead || notification.read_at ? true : false;
                        const type = notification.type || notification.notification_type || 'system';
                        const priority = notification.priority || 'medium';
                        const actionUrl = notification.action_url || notification.actionUrl || notification.link || '';
                        
                        // Determine notification type and icon
                        const getNotificationIcon = (type: string) => {
                          switch(type?.toLowerCase()) {
                            case 'job':
                            case 'job_alert':
                            case 'new_job':
                              return '💼';
                            case 'application':
                            case 'application_status':
                            case 'applied':
                              return '📝';
                            case 'interview':
                            case 'interview_scheduled':
                              return '📅';
                            case 'document':
                            case 'document_verification':
                              return '📄';
                            case 'profile':
                            case 'profile_update':
                              return '👤';
                            case 'message':
                            case 'chat':
                              return '💬';
                            case 'alert':
                            case 'warning':
                              return '⚠️';
                            case 'success':
                            case 'approved':
                              return '✅';
                            case 'rejected':
                            case 'error':
                              return '❌';
                            default:
                              return '🔔';
                          }
                        };
                        
                        // Determine priority styling
                        const getPriorityColor = (priority: string) => {
                          switch(priority?.toLowerCase()) {
                            case 'high':
                            case 'urgent':
                              return 'border-l-4 border-l-red-500';
                            case 'medium':
                            case 'normal':
                              return 'border-l-4 border-l-yellow-500';
                            case 'low':
                              return 'border-l-4 border-l-gray-300';
                            default:
                              return 'border-l-4 border-l-blue-500';
                          }
                        };
                        
                        // Format date
                        const formatDate = (dateString: string) => {
                          if (!dateString) return '';
                          const date = new Date(dateString);
                          const now = new Date();
                          const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
                          
                          if (diffInHours < 1) {
                            return 'Just now';
                          } else if (diffInHours < 24) {
                            return `${Math.floor(diffInHours)} hours ago`;
                          } else if (diffInHours < 48) {
                            return 'Yesterday';
                          } else if (diffInHours < 168) {
                            return `${Math.floor(diffInHours / 24)} days ago`;
                          } else {
                            return date.toLocaleDateString();
                          }
                        };
                        
                        return (
                          <div 
                            key={notificationId}
                            className={`
                              p-4 rounded-lg transition-all duration-200 cursor-pointer
                              ${isRead ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'}
                              ${getPriorityColor(priority)}
                            `}
                            onClick={() => {
                              // Mark as read
                              if (!isRead) {
                                setNotifications(prev => 
                                  prev.map(n => 
                                    n.id === notificationId ? { ...n, is_read: true, isRead: true } : n
                                  )
                                );
                              }
                              // Navigate if there's an action URL
                              if (actionUrl) {
                                router.push(actionUrl);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div className="text-2xl flex-shrink-0">
                                {getNotificationIcon(type)}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4 className={`text-sm font-semibold ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                      {title}
                                    </h4>
                                    {message && (
                                      <p className={`text-sm mt-1 ${isRead ? 'text-gray-500' : 'text-gray-600'} line-clamp-2`}>
                                        {message}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-xs text-gray-400">
                                        {formatDate(createdAt)}
                                      </span>
                                      {!isRead && (
                                        <Badge variant="default" className="text-xs px-2 py-0">
                                          New
                                        </Badge>
                                      )}
                                      {type && type !== 'system' && (
                                        <Badge variant="outline" className="text-xs px-2 py-0 capitalize">
                                          {type.replace(/_/g, ' ')}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Actions */}
                                  <div className="flex-shrink-0">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Remove notification
                                        setNotifications(prev => 
                                          prev.filter(n => (n.id || n.notification_id) !== notificationId)
                                        );
                                        toast.success('Notification removed');
                                      }}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Load More or View All */}
                      {notifications.length > 10 && (
                        <div className="text-center pt-4">
                          <Button asChild variant="outline">
                            <Link href="/notifications">
                              View All {notifications.length} Notifications
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔔</div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Notifications</h3>
                      <p className="text-gray-500 mb-2">You're all caught up!</p>
                      <p className="text-sm text-gray-400">We'll notify you when something important happens.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Job Alerts</p>
                        <p className="text-xs text-gray-500">Get notified about new job opportunities</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Application Updates</p>
                        <p className="text-xs text-gray-500">Updates on your job applications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        Total: {appliedJobs.length}
                      </Badge>
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/jobs">Find More Jobs</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {appliedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {appliedJobs.map((job) => (
                        <div key={job.id} className="border rounded-lg hover:shadow-lg transition-all duration-200">
                          <div className="p-4">
                            {/* Job Header with Company Info */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                  {job.jobTitle || job.title || 'Job Position'}
                                </h4>
                                <p className="text-gray-700 font-medium">
                                  {job.companyName || job.company || 'Company Name'}
                                </p>
                              </div>
                              <Badge 
                                className={`text-xs px-3 py-1 ${
                                  job.applicationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                  job.applicationStatus === 'approved' || job.applicationStatus === 'accepted' ? 'bg-blue-100 text-green-800 border-green-300' :
                                  job.applicationStatus === 'shortlisted' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                  job.applicationStatus === 'interview' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                  job.applicationStatus === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                                  'bg-gray-100 text-gray-800 border-gray-300'
                                }`}
                                variant="outline"
                              >
                                {job.applicationStatus || 'Pending'}
                              </Badge>
                            </div>

                            {/* Job Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                              {/* Location */}
                              {job.jobLocationCountry && (
                                <div className="flex items-center text-gray-600">
                                  <span className="mr-2">📍</span>
                                  <span>{job.jobLocationCountry.name || job.location || 'Location not specified'}</span>
                                </div>
                              )}
                              
                              {/* Salary */}
                              {job.jobWages && (
                                <div className="flex items-center text-gray-600">
                                  <span className="mr-2">💰</span>
                                  <span>
                                    {job.jobWages} {job.jobWagesCurrencyType || 'USD'}
                                    {job.givenCurrencyValue && ` (≈ ${Math.round(job.jobWages * job.givenCurrencyValue)} INR)`}
                                  </span>
                                </div>
                              )}
                              
                              {/* Applied Date */}
                              <div className="flex items-center text-gray-600">
                                <span className="mr-2">📅</span>
                                <span>Applied: {job.appliedOn || job.appliedDate || new Date(job.created_at || Date.now()).toLocaleDateString()}</span>
                              </div>
                              
                              {/* Deadline */}
                              {job.jobDeadline && (
                                <div className="flex items-center text-gray-600">
                                  <span className="mr-2">⏰</span>
                                  <span>Deadline: {job.jobDeadline}</span>
                                </div>
                              )}
                            </div>

                            {/* Additional Info */}
                            {(job.occupation || job.contractPeriod) && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {job.occupation && (
                                  <Badge variant="secondary" className="text-xs">
                                    {job.occupation}
                                  </Badge>
                                )}
                                {job.contractPeriod && (
                                  <Badge variant="outline" className="text-xs">
                                    Contract: {job.contractPeriod} months
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Status Message */}
                            {job.applicationStatus && (
                              <div className="text-sm text-gray-500 italic mb-3">
                                {job.applicationStatus === 'pending' && '⏳ Your application is being reviewed'}
                                {job.applicationStatus === 'shortlisted' && '🎉 Congratulations! You have been shortlisted'}
                                {job.applicationStatus === 'interview' && '📞 Interview scheduled - check your email for details'}
                                {(job.applicationStatus === 'approved' || job.applicationStatus === 'accepted') && '✅ Great news! Your application has been approved'}
                                {job.applicationStatus === 'rejected' && '❌ Unfortunately, your application was not successful this time'}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-3 border-t">
                              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Link href={`/job-description/${job.id}`}>
                                  <span className="mr-1">👁️</span>
                                  View Job Details
                                </Link>
                              </Button>
                              
                              {job.applicationStatus === 'interview' && (
                                <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                                  <span className="mr-1">📋</span>
                                  Interview Info
                                </Button>
                              )}
                              
                              {(job.applicationStatus === 'approved' || job.applicationStatus === 'accepted') && (
                                <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-blue-50">
                                  <span className="mr-1">📄</span>
                                  View Offer
                                </Button>
                              )}
                              
                              <Button size="sm" variant="ghost" className="text-gray-600">
                                <span className="mr-1">📊</span>
                                Track Status
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                      <p className="text-gray-500 mb-6">You haven't applied to any jobs yet. Start exploring opportunities!</p>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/jobs">Browse Available Jobs</Link>
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        Total: {savedJobs.length}
                      </Badge>
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/jobs">Find More Jobs</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {savedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {savedJobs.map((job) => {
                        // Extract job details with proper field mapping
                        const jobTitle = job.jobTitle || job.job_title || job.title || 'Job Position';
                        const companyName = job.companyName || job.company_name || job.cmpName || job.company || 'Company';
                        const location = job.location || job.jobLocation || '';
                        const country = job.country || job.jobLocationCountry?.name || '';
                        const fullLocation = location && country ? `${location}, ${country}` : (location || country || 'Location not specified');
                        const salary = job.jobWages || job.salary || '';
                        const currency = job.jobWagesCurrencyType || job.currency || '';
                        const savedDate = job.saved_date || job.savedDate || job.created_at || '';
                        const jobType = job.jobType || job.job_type || job.employmentType || '';
                        const deadline = job.jobDeadline || job.deadline || '';
                        const occupation = job.occupation || job.jobOccupation || '';
                        
                        return (
                          <div key={job.id} className="border rounded-lg hover:shadow-lg transition-all duration-200">
                            <div className="p-4">
                              {/* Job Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                    {jobTitle}
                                  </h4>
                                  <p className="text-gray-700 font-medium">
                                    {companyName}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-xs px-3 py-1">
                                  <span className="mr-1">💾</span>
                                  Saved
                                </Badge>
                              </div>

                              {/* Job Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                                {/* Location */}
                                <div className="flex items-center text-gray-600">
                                  <span className="mr-2">📍</span>
                                  <span>{fullLocation}</span>
                                </div>
                                
                                {/* Salary if available */}
                                {salary && (
                                  <div className="flex items-center text-gray-600">
                                    <span className="mr-2">💰</span>
                                    <span>{salary} {currency}</span>
                                  </div>
                                )}
                                
                                {/* Saved Date */}
                                {savedDate && (
                                  <div className="flex items-center text-gray-600">
                                    <span className="mr-2">📅</span>
                                    <span>Saved: {new Date(savedDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                
                                {/* Deadline if available */}
                                {deadline && (
                                  <div className="flex items-center text-gray-600">
                                    <span className="mr-2">⏰</span>
                                    <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>

                              {/* Additional Info */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {jobType && (
                                  <Badge variant="secondary" className="text-xs">
                                    {jobType}
                                  </Badge>
                                )}
                                {occupation && (
                                  <Badge variant="outline" className="text-xs">
                                    {occupation}
                                  </Badge>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2 pt-3 border-t">
                                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                                  <Link href={`/job-description/${job.id}`}>
                                    <span className="mr-1">👁️</span>
                                    View Details
                                  </Link>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-green-300 text-green-700 hover:bg-blue-50"
                                  onClick={() => {
                                    // Navigate to job description page to apply
                                    router.push(`/job-description/${job.id}`);
                                  }}
                                >
                                  <span className="mr-1">📝</span>
                                  Apply Now
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={async () => {
                                    // Handle unsave functionality
                                    const token = localStorage.getItem('access_token');
                                    if (token) {
                                      try {
                                        // You can add unsave API call here if needed
                                        toast.info('Please go to the job details page to unsave this job');
                                      } catch (error) {
                                      }
                                    }
                                  }}
                                >
                                  <span className="mr-1">❤️</span>
                                  Unsave
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* View All Button - only show if more than 5 jobs */}
                      {savedJobs.length > 5 && (
                        <div className="text-center pt-4">
                          <Button asChild variant="outline">
                            <Link href="/saved-jobs">View All {savedJobs.length} Saved Jobs</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💔</div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Saved Jobs</h3>
                      <p className="text-gray-500 mb-2">You haven't saved any jobs yet.</p>
                      <p className="text-sm text-gray-400 mb-6">Click the heart icon on job listings to save them for later.</p>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/jobs">Explore Jobs</Link>
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
