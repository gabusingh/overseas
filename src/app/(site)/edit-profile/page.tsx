"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";
import { getUserDashboard, editProfile, getEmpDataForEdit } from "../../../services/user.service";

interface ProfileData {
  name?: string;
  email: string;
  phone: string;
  location?: string;
  occupation?: string;
  experience_years?: number;
  about?: string;
  skills?: string;
  profile_image?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export default function EditProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      router.push("/login");
      return;
    }
    
    console.log('EditProfile: Loading profile data...');
    loadProfileData(token);
  }, [router]);

  // Utility function to normalize profile data
  const normalizeProfileData = (data: any): ProfileData => {
    return {
      name: data.name || data.empName || "",
      email: data.email || data.empEmail || "",
      phone: data.phone || data.empWhatsapp || "",
      date_of_birth: data.date_of_birth || data.dob || data.empDob || "",
      gender: data.gender || data.empGender || "",
      occupation: data.occupation || data.empOccuId || "",
      skills: data.skills || data.empSkill || "",
      state: data.state || data.empState || "",
      city: data.city || data.district || data.empDistrict || "",
      postal_code: data.postal_code || data.pin_code || data.empPin || "",
      emergency_contact_name: data.emergency_contact_name || data.reference_name || data.empRefName || "",
      emergency_contact_phone: data.emergency_contact_phone || data.reference_phone || data.empRefPhone || "",
      location: data.location || "",
      experience_years: data.experience_years || 0,
      about: data.about || "",
      profile_image: data.profile_image || "",
      nationality: data.nationality || "",
      address: data.address || ""
    };
  };

  const loadProfileData = async (token: string) => {
    try {
      // Initialize with empty data first
      let initialProfileData: ProfileData = {
        email: "",
        phone: "",
        name: "",
        location: "",
        occupation: "",
        experience_years: 0,
        about: "",
        skills: "",
        profile_image: "",
        date_of_birth: "",
        gender: "",
        nationality: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        emergency_contact_name: "",
        emergency_contact_phone: ""
      };
      
      // Load user data from localStorage first
      const localUser = localStorage.getItem("loggedUser") || localStorage.getItem("user");
      if (localUser) {
        const userData = JSON.parse(localUser);
        initialProfileData = {
          ...initialProfileData,
          email: userData.email || "",
          phone: userData.phone || "",
          name: userData.name || "",
          location: userData.location || "",
          occupation: userData.occupation || "",
          experience_years: userData.experience_years || 0,
          about: userData.about || "",
          skills: userData.skills || "",
          profile_image: userData.profile_image || "",
          date_of_birth: userData.date_of_birth || userData.dob || "",
          gender: userData.gender || "",
          nationality: userData.nationality || "",
          address: userData.address || "",
          city: userData.city || userData.district || "",
          state: userData.state || "",
          postal_code: userData.postal_code || userData.pin_code || "",
          emergency_contact_name: userData.emergency_contact_name || userData.reference_name || "",
          emergency_contact_phone: userData.emergency_contact_phone || userData.reference_phone || ""
        };
        if (userData.profile_image) {
          setImagePreview(userData.profile_image);
        }
      }
      
      // Try to get complete profile data from backend
      try {
        const empData = await getEmpDataForEdit(token);
        if (empData) {
          // Create complete profile data with backend data taking precedence over localStorage
          const completeProfileData: ProfileData = {
            name: empData.empName || initialProfileData.name,
            email: empData.empEmail || initialProfileData.email,
            phone: empData.empWhatsapp || initialProfileData.phone,
            date_of_birth: empData.empDob || initialProfileData.date_of_birth,
            gender: empData.empGender || initialProfileData.gender,
            occupation: empData.empOccuId || initialProfileData.occupation,
            skills: empData.empSkill || initialProfileData.skills,
            state: empData.empState || initialProfileData.state,
            city: empData.empDistrict || initialProfileData.city,
            postal_code: empData.empPin || initialProfileData.postal_code,
            location: empData.empState && empData.empDistrict ? `${empData.empDistrict}, ${empData.empState}` : initialProfileData.location,
            emergency_contact_name: empData.empRefName || initialProfileData.emergency_contact_name,
            emergency_contact_phone: empData.empRefPhone || initialProfileData.emergency_contact_phone,
            // Keep existing fields that might not be in backend
            about: initialProfileData.about,
            experience_years: initialProfileData.experience_years,
            profile_image: initialProfileData.profile_image,
            nationality: initialProfileData.nationality,
            address: initialProfileData.address
          };
          setProfileData(completeProfileData);
          
          // Update localStorage with the most complete data
          if (localUser) {
            const userData = JSON.parse(localUser);
            const updatedUser = { ...userData, ...completeProfileData };
            localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        } else {
          // No backend data, use localStorage data
          setProfileData(initialProfileData);
        }
      } catch (empDataError) {
        console.warn("Could not load complete profile data, using localStorage data:", empDataError);
        setProfileData(initialProfileData);
      }
      
    } catch (error) {
      console.error("Error loading profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should not exceed 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG images are allowed");
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication required");
      router.push("/login");
      return;
    }

    setSaving(true);
    
    try {
      const formData = new FormData();
      
      // Add all form fields with proper mapping for backend
      Object.keys(profileData).forEach(key => {
        const value = profileData[key as keyof ProfileData];
        if (value !== undefined && value !== null && value !== "") {
          // Map frontend field names to backend expected names
          let backendKey = key;
          switch (key) {
            case 'name':
              backendKey = 'empName';
              break;
            case 'email':
              backendKey = 'empEmail';
              break;
            case 'phone':
              backendKey = 'empWhatsapp';
              break;
            case 'date_of_birth':
              backendKey = 'empDob';
              break;
            case 'gender':
              backendKey = 'empGender';
              break;
            case 'occupation':
              backendKey = 'empOccuId';
              break;
            case 'skills':
              backendKey = 'empSkill';
              break;
            case 'state':
              backendKey = 'empState';
              break;
            case 'city':
              backendKey = 'empDistrict';
              break;
            case 'postal_code':
              backendKey = 'empPin';
              break;
            case 'emergency_contact_name':
              backendKey = 'empRefName';
              break;
            case 'emergency_contact_phone':
              backendKey = 'empRefPhone';
              break;
            default:
              backendKey = key;
          }
          formData.append(backendKey, value.toString());
        }
      });
      
      // Add profile image if selected
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      console.log('Saving profile data:', Object.fromEntries(formData));
      const response = await editProfile(formData, token);
      
      if (response) {
        toast.success("Profile updated successfully!");
        
        // Create updated user object with all current form data
        const currentUserData = localStorage.getItem("loggedUser") || localStorage.getItem("user");
        let updatedUser = profileData;
        
        if (currentUserData) {
          const existingUser = JSON.parse(currentUserData);
          updatedUser = { 
            ...existingUser, 
            ...profileData,
            // Ensure important fields are properly mapped
            dob: profileData.date_of_birth,
            district: profileData.city,
            pin_code: profileData.postal_code,
            reference_name: profileData.emergency_contact_name,
            reference_phone: profileData.emergency_contact_phone
          };
        }
        
        // Update localStorage with complete updated data
        localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        console.log('Profile data saved to localStorage:', updatedUser);
        
        // Add a small delay to ensure localStorage is updated before navigation
        setTimeout(() => {
          router.push("/my-profile");
        }, 100);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold textBlue mb-2">Edit Profile</h1>
        <p className="text-gray-600">Update your personal information and preferences</p>
      </div>

      <form className="space-y-6">
        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-gray-400">
                    {profileData.name ? profileData.name[0].toUpperCase() : "?"}
                  </span>
                )}
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-2"
                />
                <p className="text-sm text-gray-500">
                  Upload a new profile picture. Max size 5MB. Formats: JPG, PNG
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profileData.date_of_birth || ""}
                  onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={profileData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={profileData.nationality || ""}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  placeholder="Enter your nationality"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="about">About Me</Label>
              <Textarea
                id="about"
                value={profileData.about || ""}
                onChange={(e) => handleInputChange("about", e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Current Occupation</Label>
                <Input
                  id="occupation"
                  value={profileData.occupation || ""}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="Enter your current job title"
                />
              </div>
              
              <div>
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  value={profileData.experience_years || ""}
                  onChange={(e) => handleInputChange("experience_years", parseInt(e.target.value) || 0)}
                  placeholder="Enter years of experience"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={profileData.skills || ""}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                placeholder="Enter your skills (separated by commas)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profileData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your full address"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profileData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter your city"
                />
              </div>
              
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={profileData.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter your state"
                />
              </div>
              
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={profileData.postal_code || ""}
                  onChange={(e) => handleInputChange("postal_code", e.target.value)}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_contact_name">Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={profileData.emergency_contact_name || ""}
                  onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)}
                  placeholder="Enter emergency contact name"
                />
              </div>
              
              <div>
                <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  value={profileData.emergency_contact_phone || ""}
                  onChange={(e) => handleInputChange("emergency_contact_phone", e.target.value)}
                  placeholder="Enter emergency contact phone"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          
          <div className="space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/my-profile")}
            >
              View Profile
            </Button>
            
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
