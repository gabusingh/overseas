"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";

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

  const getRatingStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "text-sm",
      md: "text-base", 
      lg: "text-lg"
    };
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fa fa-star ${sizeClasses[size]} ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          ></i>
        ))}
        <span className={`ml-2 ${sizeClasses[size]} text-gray-600`}>({rating.toFixed(1)})</span>
      </div>
    );
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for could not be found.</p>
          <button
            onClick={() => router.push("/courses")}
            className="bg-[#17487f] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{course.title} | Overseas.ai</title>
        <meta name="description" content={course.shortDescription} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3">
                  {course.category}
                </span>
                <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  {course.level}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold textBlue mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.shortDescription}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <i className="fa fa-clock text-gray-400 mr-2"></i>
                  <span className="text-gray-600">{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-users text-gray-400 mr-2"></i>
                  <span className="text-gray-600">{course.enrolledStudents}/{course.maxStudents} students</span>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-globe text-gray-400 mr-2"></i>
                  <span className="text-gray-600">{course.format}</span>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-language text-gray-400 mr-2"></i>
                  <span className="text-gray-600">{course.language.join(", ")}</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                {getRatingStars(course.rating, "lg")}
                <span className="ml-4 text-gray-600">({course.totalReviews} reviews)</span>
              </div>

              {/* Instructor Preview */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <img
                  src={course.instructor.image}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold textBlue">{course.instructor.name}</p>
                  <p className="text-sm text-gray-600">{course.instructor.title}</p>
                </div>
                <div className="ml-auto">
                  {getRatingStars(course.instructor.rating, "sm")}
                </div>
              </div>
            </div>

            {/* Course Image & Enrollment */}
            <div>
              <div className="sticky top-8">
                <div className="relative mb-4">
                  <img
                    src={course.images[activeImageIndex]}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {course.images.length > 1 && (
                    <div className="flex space-x-2 mt-2">
                      {course.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === activeImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold textBlue">${course.price}</span>
                    {course.originalPrice && (
                      <span className="text-lg text-gray-500 line-through ml-2">${course.originalPrice}</span>
                    )}
                  </div>

                  {course.isEnrolled ? (
                    <button
                      onClick={() => router.push(`/my-courses/${courseId}`)}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium mb-4 hover:bg-green-700 transition-colors"
                    >
                      <i className="fa fa-play mr-2"></i>
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowEnrollModal(true)}
                      disabled={course.enrolledStudents >= course.maxStudents}
                      className="w-full bg-[#17487f] text-white px-6 py-3 rounded-lg font-medium mb-4 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {course.enrolledStudents >= course.maxStudents ? (
                        <>
                          <i className="fa fa-users mr-2"></i>
                          Course Full
                        </>
                      ) : (
                        <>
                          <i className="fa fa-shopping-cart mr-2"></i>
                          Enroll Now
                        </>
                      )}
                    </button>
                  )}

                  <p className="text-center text-sm text-gray-600 mb-4">
                    Enrollment deadline: {formatDate(course.enrollmentDeadline)}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <i className="fa fa-calendar w-4 text-center mr-3"></i>
                      <span>Starts: {formatDate(course.schedule.startDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa fa-clock w-4 text-center mr-3"></i>
                      <span>{course.schedule.timing}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa fa-repeat w-4 text-center mr-3"></i>
                      <span>{course.schedule.days.join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What's Included:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {course.features.slice(0, 4).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: 'fa-info-circle' },
                { id: 'curriculum', label: 'Curriculum', icon: 'fa-list' },
                { id: 'instructor', label: 'Instructor', icon: 'fa-user' },
                { id: 'reviews', label: 'Reviews', icon: 'fa-star' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`fa ${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
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
                      {getRatingStars(course.instructor.rating)}
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
                    {getRatingStars(course.rating)}
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
                        {getRatingStars(review.rating, "sm")}
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
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold textBlue mb-6">About the Institute</h3>
          <div className="flex items-start space-x-6">
            <img
              src={course.institute.logo}
              alt={course.institute.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="text-lg font-semibold textBlue mb-2">{course.institute.name}</h4>
              <p className="text-gray-600 mb-2">
                <i className="fa fa-map-marker mr-2"></i>
                {course.institute.location}
              </p>
              <div className="flex items-center mb-3">
                {getRatingStars(course.institute.rating, "sm")}
              </div>
              <div className="flex flex-wrap gap-2">
                {course.institute.accreditation.map((acc, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {acc}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => router.push(`/institute-details/${course.institute.id}`)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Institute
              <i className="fa fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>

        {/* Enrollment Modal */}
        {showEnrollModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Enrollment</h3>
              <p className="text-gray-600 mb-6">
                You are about to enroll in "{course.title}" for ${course.price}.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnrollment}
                  disabled={enrolling}
                  className="bg-[#17487f] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {enrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-credit-card mr-2"></i>
                      Enroll & Pay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
