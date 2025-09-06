"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";
import { addExperience } from "../../../services/user.service";

interface ExperienceData {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  currently_working: boolean;
  description: string;
  location: string;
  employment_type: string;
}

export default function AddExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExperienceData>({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    currently_working: false,
    description: "",
    location: "",
    employment_type: "full-time"
  });

  const [errors, setErrors] = useState<Partial<ExperienceData>>({});

  const validateForm = () => {
    const newErrors: Partial<ExperienceData> = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.currently_working && !formData.end_date) {
      newErrors.end_date = "End date is required when not currently working";
    }

    if (formData.start_date && formData.end_date && !formData.currently_working) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate < startDate) {
        newErrors.end_date = "End date cannot be earlier than start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ExperienceData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // If currently working is checked, clear end date
    if (field === "currently_working" && value === true) {
      setFormData(prev => ({
        ...prev,
        end_date: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication required");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const experienceFormData = new FormData();
      
      // Convert the data to FormData
      experienceFormData.append('company', formData.company);
      experienceFormData.append('position', formData.position);
      experienceFormData.append('start_date', formData.start_date);
      experienceFormData.append('employment_type', formData.employment_type);
      experienceFormData.append('location', formData.location);
      experienceFormData.append('description', formData.description);
      experienceFormData.append('currently_working', formData.currently_working.toString());
      
      if (!formData.currently_working && formData.end_date) {
        experienceFormData.append('end_date', formData.end_date);
      }

      const response = await addExperience(experienceFormData, token);
      
      if (response) {
        toast.success("Experience added successfully!");
        router.push("/my-profile?tab=experience");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold textBlue mb-2">Add Work Experience</h1>
        <p className="text-gray-600">Add your professional experience to strengthen your profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Experience Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Enter company name"
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
            </div>

            {/* Position/Job Title */}
            <div>
              <Label htmlFor="position">Position/Job Title *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Enter your job title"
                className={errors.position ? "border-red-500" : ""}
              />
              {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
            </div>

            {/* Employment Type */}
            <div>
              <Label htmlFor="employment_type">Employment Type</Label>
              <select
                id="employment_type"
                value={formData.employment_type}
                onChange={(e) => handleInputChange("employment_type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, State, Country"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="month"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange("start_date", e.target.value)}
                  className={errors.start_date ? "border-red-500" : ""}
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="month"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange("end_date", e.target.value)}
                  disabled={formData.currently_working}
                  className={errors.end_date ? "border-red-500" : ""}
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
              </div>
            </div>

            {/* Currently Working Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="currently_working"
                checked={formData.currently_working}
                onChange={(e) => handleInputChange("currently_working", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="currently_working" className="cursor-pointer">
                I currently work here
              </Label>
            </div>

            {/* Job Description */}
            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-1">
                Highlight your key responsibilities, achievements, and skills used in this role
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
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
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Experience"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
