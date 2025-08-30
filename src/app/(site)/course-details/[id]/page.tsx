"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Users, 
  Calendar,
  ExternalLink,
  Award,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Clock,
  Play,
  Download,
  GraduationCap
} from "lucide-react";
import Link from "next/link";

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  format: "Online" | "In-person" | "Hybrid";
  price: number;
  currency: string;
  originalPrice?: number;
  instructor: {
    name: string;
    title: string;
    bio: string;
    image: string;
    rating: number;
    experience: string;
  };
  institute: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    location: string;
    accreditation: string[];
  };
  schedule: {
    startDate: string;
    endDate: string;
    timing: string;
    days: string[];
  };
  curriculum: {
    modules: Array<{
      title: string;
      duration: string;
      lessons: string[];
    }>;
  };
  requirements: string[];
  whatYouLearn: string[];
  certificationType: string;
  language: string[];
  maxStudents: number;
  enrolledStudents: number;
  rating: number;
  totalReviews: number;
  reviews: Array<{
    id: string;
    studentName: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }>;
  features: string[];
  materials: string[];
  prerequisites: string[];
  careerPath: string[];
  images: string[];
  videoUrl?: string;
  tags: string[];
  isEnrolled: boolean;
  enrollmentDeadline: string;
  refundPolicy: string;
  supportLevel: string;
}

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      // Mock course data - replace with actual API call
      const mockCourse: CourseDetail = {
        id: courseId,
        title: "Advanced React Development with TypeScript",
        description: `Master the art of building scalable, maintainable React applications with TypeScript. This comprehensive course covers advanced React patterns, state management, testing strategies, and deployment techniques that are essential for professional web development.

You'll learn from industry experts who have built production applications serving millions of users. Through hands-on projects and real-world scenarios, you'll gain the skills needed to excel as a React developer in today's competitive market.

This course is perfect for developers who want to take their React skills to the next level and build enterprise-grade applications with confidence.`,
        shortDescription: "Master advanced React development with TypeScript, including hooks, context, testing, and deployment strategies.",
        category: "Web Development",
        level: "Advanced",
        duration: "8 weeks",
        format: "Hybrid",
        price: 899,
        currency: "USD",
        originalPrice: 1299,
        instructor: {
          name: "Sarah Johnson",
          title: "Senior React Developer at Meta",
          bio: "Sarah is a Senior React Developer at Meta with over 8 years of experience building large-scale React applications. She has contributed to React core and is a popular speaker at tech conferences.",
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=150&h=150&fit=crop&crop=face",
          rating: 4.9,
          experience: "8+ years"
        },
        institute: {
          id: "inst-1",
          name: "TechPro Institute",
          logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
          rating: 4.8,
          location: "Dubai, UAE",
          accreditation: ["ISO 9001:2015", "Dubai Knowledge Village", "KHDA Approved"]
        },
        schedule: {
          startDate: "2025-01-15",
          endDate: "2025-03-10",
          timing: "6:00 PM - 9:00 PM",
          days: ["Monday", "Wednesday", "Friday"]
        },
        curriculum: {
          modules: [
            {
              title: "Advanced React Fundamentals",
              duration: "1 week",
              lessons: [
                "React 18 Features and Concurrent Rendering",
                "Advanced Hooks Patterns",
                "Context API Deep Dive",
                "Error Boundaries and Suspense"
              ]
            },
            {
              title: "TypeScript Integration",
              duration: "2 weeks",
              lessons: [
                "TypeScript Setup and Configuration",
                "Advanced Type Definitions",
                "Generic Components and Hooks",
                "Type-Safe API Integration"
              ]
            },
            {
              title: "State Management",
              duration: "2 weeks",
              lessons: [
                "Redux Toolkit Modern Patterns",
                "Zustand for Simple State",
                "React Query for Server State",
                "State Architecture Best Practices"
              ]
            },
            {
              title: "Testing Strategies",
              duration: "1.5 weeks",
              lessons: [
                "Jest and React Testing Library",
                "Component Testing Strategies",
                "Integration Testing",
                "E2E Testing with Playwright"
              ]
            },
            {
              title: "Performance Optimization",
              duration: "1 week",
              lessons: [
                "React Performance Profiling",
                "Code Splitting and Lazy Loading",
                "Memory Management",
                "Bundle Optimization"
              ]
            },
            {
              title: "Deployment and CI/CD",
              duration: "0.5 weeks",
              lessons: [
                "Production Build Optimization",
                "Docker Containerization",
                "AWS/Vercel Deployment",
                "Automated Testing Pipeline"
              ]
            }
          ]
        },
        requirements: [
          "2+ years of React development experience",
          "Good understanding of JavaScript ES6+",
          "Basic knowledge of Node.js and npm",
          "Familiarity with Git version control"
        ],
        whatYouLearn: [
          "Build scalable React applications with TypeScript",
          "Implement advanced React patterns and best practices",
          "Master modern state management solutions",
          "Write comprehensive tests for React components",
          "Optimize React app performance",
          "Deploy React applications to production",
          "Implement CI/CD pipelines",
          "Debug and profile React applications"
        ],
        certificationType: "Professional Certificate",
        language: ["English"],
        maxStudents: 25,
        enrolledStudents: 18,
        rating: 4.7,
        totalReviews: 156,
        reviews: [
          {
            id: "1",
            studentName: "Ahmed Hassan",
            rating: 5,
            comment: "Excellent course! Sarah's teaching style is amazing and the projects are very practical. I landed a senior React developer role after completing this course.",
            date: "2024-11-15",
            verified: true
          },
          {
            id: "2", 
            studentName: "Maria Rodriguez",
            rating: 5,
            comment: "The best React course I've taken. The TypeScript integration section was particularly valuable. Highly recommend!",
            date: "2024-11-10",
            verified: true
          },
          {
            id: "3",
            studentName: "John Smith",
            rating: 4,
            comment: "Great content and well-structured curriculum. The testing section could be a bit longer, but overall very satisfied.",
            date: "2024-11-05",
            verified: false
          }
        ],
        features: [
          "24/7 Support",
          "Lifetime Access",
          "Mobile App Access",
          "Downloadable Resources",
          "Live Q&A Sessions",
          "Code Reviews",
          "Career Guidance",
          "Industry Projects"
        ],
        materials: [
          "Video Lectures (50+ hours)",
          "Coding Exercises (100+)",
          "Project Source Code",
          "Cheat Sheets and References",
          "Quiz Assignments",
          "Final Project Template"
        ],
        prerequisites: [
          "JavaScript fundamentals",
          "HTML/CSS proficiency",
          "Basic React knowledge",
          "Development environment setup"
        ],
        careerPath: [
          "Senior React Developer",
          "Frontend Team Lead",
          "Full-Stack Developer",
          "Technical Architect",
          "Freelance Developer"
        ],
        images: [
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop"
        ],
        videoUrl: "https://www.youtube.com/watch?v=sample-video",
        tags: ["React", "TypeScript", "JavaScript", "Frontend", "Web Development"],
        isEnrolled: false,
        enrollmentDeadline: "2025-01-10",
        refundPolicy: "14-day money-back guarantee",
        supportLevel: "Premium Support"
      };

      setCourse(mockCourse);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async () => {
    setEnrolling(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Mock enrollment API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Successfully enrolled in the course!");
      setCourse(prev => prev ? { ...prev, isEnrolled: true, enrolledStudents: prev.enrolledStudents + 1 } : null);
      setShowEnrollModal(false);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in course");
    } finally {
      setEnrolling(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Button onClick={() => router.push('/training-institutes')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Training Institutes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/training-institutes" className="hover:text-blue-600 transition-colors">Training Institutes</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{course.title}</li>
          </ol>
        </nav>

        {/* Course Header - More Compact Design */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {course.category} • {course.level}
                    </Badge>
                  </div>
                  <h1 className="text-xl font-bold mb-1">{course.title}</h1>
                  <div className="flex items-center space-x-2 text-white/90 text-xs">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{course.enrolledStudents}/{course.maxStudents}</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-3 h-3 mr-1" />
                      <span>{course.format}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowEnrollModal(true)}
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-8 text-xs"
                disabled={course.isEnrolled || course.enrolledStudents >= course.maxStudents}
              >
                {course.isEnrolled ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enrolled
                  </>
                ) : course.enrolledStudents >= course.maxStudents ? (
                  <>
                    <Users className="w-3 h-3 mr-1" />
                    Full
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Enroll
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Compact 3-Card Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Course Information Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Price:</span>
                  <span className="text-purple-600 font-bold">${course.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Duration:</span>
                  <span className="text-gray-600">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Format:</span>
                  <span className="text-gray-600">{course.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Rating:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(course.rating)}
                    <span className="text-gray-600">({course.rating})</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full h-9 bg-purple-600 hover:bg-purple-700" 
                  onClick={() => setSelectedTab('curriculum')}
                >
                  <Award className="w-4 h-4 mr-2" />
                  View Curriculum
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructor Information Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Instructor
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 text-sm mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{course.instructor.name}</p>
                    <p className="text-xs text-gray-600">{course.instructor.title}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Experience:</span>
                  <span className="text-gray-600">{course.instructor.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Rating:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(course.instructor.rating)}
                    <span className="text-gray-600">({course.instructor.rating})</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full h-9 bg-purple-600 hover:bg-purple-700" 
                  onClick={() => setSelectedTab('instructor')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment & Institute Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                Enrollment & Institute
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={course.institute.logo}
                    alt={course.institute.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{course.institute.name}</p>
                    <p className="text-xs text-gray-600">{course.institute.location}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">Students:</span>
                  <span className="text-purple-600">{course.enrolledStudents}/{course.maxStudents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">Reviews:</span>
                  <span className="text-gray-600">{course.totalReviews}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 pt-2">
                  <div className="flex items-center p-1 bg-purple-50 rounded text-xs">
                    <CheckCircle className="w-3 h-3 text-purple-600 mr-1" />
                    <span>Certified</span>
                  </div>
                  <div className="flex items-center p-1 bg-green-50 rounded text-xs">
                    <Award className="w-3 h-3 text-green-600 mr-1" />
                    <span>Support</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full h-9 border-purple-600 text-purple-600 hover:bg-purple-50" 
                  onClick={() => router.push(`/institute-details/${course.institute.id}`)}
                >
                  <Building className="w-4 h-4 mr-2" />
                  View Institute
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="border-b">
            <nav className="flex px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'curriculum', label: 'Curriculum', icon: Award },
                { id: 'instructor', label: 'Instructor', icon: Users },
                { id: 'reviews', label: 'Reviews', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    selectedTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {selectedTab === 'overview' && (
              <div className="space-y-8">
                {/* Course Description */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Course Description</h3>
                  <div className="text-gray-600 whitespace-pre-line">{course.description}</div>
                </div>

                {/* What You'll Learn */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <i className="fa fa-check text-green-500 mr-3 mt-1"></i>
                        <span className="text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fa fa-circle text-gray-400 text-xs mr-3 mt-2"></i>
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Career Path */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Career Opportunities</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.careerPath.map((career, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'curriculum' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold textBlue mb-4">Course Curriculum</h3>
                {course.curriculum.modules.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold textBlue">
                          Module {index + 1}: {module.title}
                        </h4>
                        <span className="text-sm text-gray-600">{module.duration}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-center">
                            <i className="fa fa-play-circle text-blue-600 mr-3"></i>
                            <span className="text-gray-600">{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'instructor' && (
              <div className="max-w-4xl">
                <div className="flex items-start space-x-6 mb-6">
                  <img
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold textBlue mb-2">{course.instructor.name}</h3>
                    <p className="text-gray-600 mb-2">{course.instructor.title}</p>
                    <div className="flex items-center mb-4">
                      {renderStars(course.instructor.rating)}
                      <span className="ml-4 text-gray-600">({course.instructor.experience} experience)</span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-600 leading-relaxed">
                  {course.instructor.bio}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold textBlue">Student Reviews</h3>
                  <div className="flex items-center">
                    {renderStars(course.rating)}
                    <span className="ml-2 text-gray-600">({course.totalReviews} total reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium mr-3">
                            {review.studentName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium textBlue mr-2">{review.studentName}</p>
                              {review.verified && (
                                <i className="fa fa-check-circle text-green-500 text-sm" title="Verified Student"></i>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{formatDate(review.date)}</p>
                          </div>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Institute Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              About the Institute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <img
                  src={course.institute.logo}
                  alt={course.institute.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{course.institute.name}</h4>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {course.institute.location}
                  </p>
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">{renderStars(course.institute.rating)}</div>
                    <span className="text-sm text-gray-600">({course.institute.rating})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.institute.accreditation.map((acc, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {acc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => router.push(`/institute-details/${course.institute.id}`)}
                variant="outline"
                className="flex items-center"
              >
                View Institute
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Modal */}
        {showEnrollModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Confirm Enrollment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  You are about to enroll in "{course.title}" for ${course.price}.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>Course Fee:</span>
                    <span className="font-bold">${course.price}</span>
                  </div>
                  {course.originalPrice && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Original Price:</span>
                      <span className="line-through">${course.originalPrice}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="flex justify-end space-x-3 p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => setShowEnrollModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEnrollment}
                  disabled={enrolling}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {enrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Enroll & Pay
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
