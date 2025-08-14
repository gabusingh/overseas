"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { getUserDashboard, getEmpData, getProfileStrength, experienceList, passportView } from "../../../services/user.service";
import { appliedJobList, userSavedJobsList } from "../../../services/job.service";
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/login");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadUserData(token);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  const loadUserData = async (token: string) => {
    try {
      const [dashboardResponse, empDataResponse, experiencesResponse, notificationsResponse] = await Promise.allSettled([
        getUserDashboard(token),
        getEmpData(token),
        experienceList(token),
        getNotifications(token)
      ]);

      if (dashboardResponse.status === 'fulfilled') {
        setDashboardData(dashboardResponse.value);
      }
      
      if (empDataResponse.status === 'fulfilled') {
        setUser(prev => ({ ...prev, ...empDataResponse.value }));
      }
      
      if (experiencesResponse.status === 'fulfilled') {
        setExperiences(experiencesResponse.value?.experiences || []);
      }
      
      if (notificationsResponse.status === 'fulfilled') {
        setNotifications(notificationsResponse.value?.notifications || []);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
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
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
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
                      <Link href="/applied-jobs">📝 View Applied Jobs</Link>
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">User Type</p>
                      <Badge variant={user.type === "person" ? "default" : "secondary"}>
                        {user.type}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                    
                    {user.name && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-gray-900">{user.name}</p>
                      </div>
                    )}

                    {user.location && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-gray-900">{user.location}</p>
                      </div>
                    )}

                    {user.occupation && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Occupation</p>
                        <p className="text-gray-900">{user.occupation}</p>
                      </div>
                    )}
                  </div>
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
