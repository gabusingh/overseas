"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";
import { getUserDashboard, editProfile } from "../../../services/user.service";

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
    
    loadProfileData(token);
  }, [router]);

  const loadProfileData = async (token: string) => {
    try {
  const response = await getUserDashboard(token);
      if (response) {
        setProfileData(response);
        if (response.profile_image) {
          setImagePreview(response.profile_image);
        }
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
      
      // Add all form fields
      Object.keys(profileData).forEach(key => {
        const value = profileData[key as keyof ProfileData];
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value.toString());
        }
      });
      
      // Add profile image if selected
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const response = await editProfile(formData, token);
      
      if (response) {
        toast.success("Profile updated successfully!");
        
        // Update local storage user data
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = { ...user, ...profileData };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        
        router.push("/my-profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
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
