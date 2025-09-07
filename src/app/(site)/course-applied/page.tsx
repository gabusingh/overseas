"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppliedCourseCard from "@/components/AppliedCourseCard";
import { Search, Filter, Clock, BookOpen, Award, Calendar } from "lucide-react";
import { getAppliedCourses } from "@/services/course.service";

interface AppliedCourse {
  id: number;
  course_name: string;
  institute_name: string;
  course_duration: string;
  assessment_type: string;
  course_type: string;
  course_image: string;
  appliedOn: string;
  applicationStatus: "pending" | "approved" | "enrolled" | "completed" | "rejected";
  submission_date: string;
  course_fee?: number;
  certification?: string;
  description?: string;
  location?: string;
  skill_level?: string;
  institute_id?: number;
}

export default function CourseAppliedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appliedCourses, setAppliedCourses] = useState<AppliedCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<AppliedCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    fetchAppliedCourses();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [appliedCourses, searchTerm, statusFilter, typeFilter, sortBy]);

  const fetchAppliedCourses = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Please login to view your applied courses");
        router.push("/login");
        return;
      }

      // Mock data for demonstration - replace with actual API call
      const mockAppliedCourses: AppliedCourse[] = [
        {
          id: 1,
          course_name: "Advanced Welding Techniques",
          institute_name: "Dubai Technical Institute",
          course_duration: "6 months",
          assessment_type: "Practical + Theory",
          course_type: "Technical Skills",
          course_image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
          appliedOn: "2024-11-20",
          applicationStatus: "approved",
          submission_date: "2024-12-15",
          course_fee: 2500,
          certification: "AWS Certified Welder",
          description: "Comprehensive welding course covering advanced techniques and safety protocols.",
          location: "Dubai, UAE",
          skill_level: "Advanced"
        },
        {
          id: 2,
          course_name: "Electrical Installation & Maintenance",
          institute_name: "Emirates Technical College",
          course_duration: "4 months",
          assessment_type: "Practical",
          course_type: "Trade Certification",
          course_image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
          appliedOn: "2024-11-15",
          applicationStatus: "enrolled",
          submission_date: "2024-12-10",
          course_fee: 1800,
          certification: "City & Guilds Level 3",
          description: "Professional electrical installation and maintenance training program.",
          location: "Abu Dhabi, UAE",
          skill_level: "Intermediate"
        },
        {
          id: 3,
          course_name: "Heavy Equipment Operation",
          institute_name: "Gulf Training Academy",
          course_duration: "3 months",
          assessment_type: "Practical + Theory",
          course_type: "Equipment Training",
          course_image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
          appliedOn: "2024-11-10",
          applicationStatus: "pending",
          submission_date: "2024-12-05",
          course_fee: 3200,
          certification: "OSHA Certified Operator",
          description: "Training for operating heavy construction equipment safely and efficiently.",
          location: "Dubai, UAE",
          skill_level: "Beginner"
        },
        {
          id: 4,
          course_name: "Hospitality Management",
          institute_name: "International Hospitality Institute",
          course_duration: "8 months",
          assessment_type: "Theory + Internship",
          course_type: "Diploma Course",
          course_image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop",
          appliedOn: "2024-10-25",
          applicationStatus: "completed",
          submission_date: "2024-11-30",
          course_fee: 4500,
          certification: "Diploma in Hospitality Management",
          description: "Comprehensive hospitality management program with industry internship.",
          location: "Dubai, UAE",
          skill_level: "Professional"
        },
        {
          id: 5,
          course_name: "Plumbing & Pipe Fitting",
          institute_name: "Construction Skills Institute",
          course_duration: "2 months",
          assessment_type: "Practical",
          course_type: "Trade Skills",
          course_image: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=400&h=300&fit=crop",
          appliedOn: "2024-10-20",
          applicationStatus: "rejected",
          submission_date: "2024-11-15",
          course_fee: 1200,
          certification: "Trade Certification",
          description: "Basic to advanced plumbing and pipe fitting techniques.",
          location: "Sharjah, UAE",
          skill_level: "Beginner"
        }
      ];

      setAppliedCourses(mockAppliedCourses);
    } catch (error) {
      toast.error("Failed to load applied courses");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCourses = () => {
    let filtered = [...appliedCourses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.institute_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(course => course.applicationStatus === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(course => course.course_type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime();
        case "oldest":
          return new Date(a.appliedOn).getTime() - new Date(b.appliedOn).getTime();
        case "name":
          return a.course_name.localeCompare(b.course_name);
        case "status":
          return a.applicationStatus.localeCompare(b.applicationStatus);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  };

  const getStatusCounts = () => {
    const counts = {
      all: appliedCourses.length,
      pending: appliedCourses.filter(c => c.applicationStatus === "pending").length,
      approved: appliedCourses.filter(c => c.applicationStatus === "approved").length,
      enrolled: appliedCourses.filter(c => c.applicationStatus === "enrolled").length,
      completed: appliedCourses.filter(c => c.applicationStatus === "completed").length,
      rejected: appliedCourses.filter(c => c.applicationStatus === "rejected").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading your applied courses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Applied Courses - Overseas.ai</title>
        <meta name="description" content="Track your course applications and enrollment status" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Applied Courses</h1>
              <p className="text-gray-600 mt-2">Track your course applications and enrollment status</p>
            </div>
            <Button
              onClick={() => router.push("/training-institutes")}
              className="bg-[#17487f] hover:bg-blue-700"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse More Courses
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <Card className="border border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
                <div className="text-sm text-gray-600">Total Applied</div>
              </CardContent>
            </Card>
            <Card className="border border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </CardContent>
            </Card>
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{statusCounts.approved}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </CardContent>
            </Card>
            <Card className="border border-green-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{statusCounts.enrolled}</div>
                <div className="text-sm text-gray-600">Enrolled</div>
              </CardContent>
            </Card>
            <Card className="border border-purple-200 bg-purple-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{statusCounts.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card className="border border-red-200 bg-red-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search courses, institutes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="enrolled">Enrolled</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="Technical Skills">Technical Skills</option>
                <option value="Trade Certification">Trade Certification</option>
                <option value="Equipment Training">Equipment Training</option>
                <option value="Diploma Course">Diploma Course</option>
                <option value="Trade Skills">Trade Skills</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Course Name</option>
                <option value="status">Status</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">
                {appliedCourses.length === 0 
                  ? "You haven't applied to any courses yet. Start browsing and apply to courses that match your interests."
                  : "No courses match your current filters. Try adjusting your search criteria."
                }
              </p>
              <Button
                onClick={() => router.push("/training-institutes")}
                className="bg-[#17487f] hover:bg-blue-700"
              >
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                Showing {filteredCourses.length} of {appliedCourses.length} applied courses
              </p>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Filtered by: {statusFilter === "all" ? "All Status" : statusFilter}</span>
              </div>
            </div>

            {/* Course Cards */}
            <div className="space-y-6">
              {filteredCourses.map((course) => (
                <AppliedCourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}

        {/* Quick Actions */}
        {appliedCourses.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter("pending")}
                  className="flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  View Pending ({statusCounts.pending})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter("enrolled")}
                  className="flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Active Courses ({statusCounts.enrolled})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter("completed")}
                  className="flex items-center justify-center"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Completed ({statusCounts.completed})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8 border border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-blue-800 mb-4">
                  Having trouble with your course application or need more information about the enrollment process?
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/contact-us")}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Contact Support
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/training-institutes")}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Browse More Courses
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
