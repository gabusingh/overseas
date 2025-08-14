"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";

interface InstituteDetail {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  logo: string;
  coverImage: string;
  images: string[];
  established: string;
  rating: number;
  totalReviews: number;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number; };
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
  accreditation: string[];
  certificationPartners: string[];
  facilities: string[];
  specializations: string[];
  stats: {
    totalStudents: number;
    totalCourses: number;
    successRate: number;
    employmentRate: number;
  };
  courses: Array<{
    id: string;
    title: string;
    category: string;
    level: string;
    duration: string;
    format: string;
    price: number;
    currency: string;
    rating: number;
    enrolledStudents: number;
    image: string;
    startDate: string;
  }>;
  instructors: Array<{
    id: string;
    name: string;
    title: string;
    specialization: string;
    experience: string;
    rating: number;
    image: string;
    bio: string;
  }>;
  reviews: Array<{
    id: string;
    studentName: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
    courseTaken: string;
  }>;
  achievements: string[];
  partnerships: string[];
  campuses: Array<{
    id: string;
    name: string;
    address: string;
    facilities: string[];
    capacity: number;
  }>;
  admissionProcess: string[];
  financialAid: boolean;
  scholarships: Array<{
    name: string;
    description: string;
    eligibility: string;
    amount: string;
  }>;
}

export default function InstituteDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const instituteId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [institute, setInstitute] = useState<InstituteDetail | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'courses' | 'instructors' | 'reviews' | 'admissions'>('overview');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchInstituteDetails();
  }, [instituteId]);

  const fetchInstituteDetails = async () => {
    setLoading(true);
    try {
      // Mock institute data - replace with actual API call
      const mockInstitute: InstituteDetail = {
        id: instituteId,
        name: "TechPro Institute",
        description: `TechPro Institute is a leading technology education provider in the Middle East, offering world-class training programs in software development, data science, cybersecurity, and digital marketing. Since our establishment in 2015, we have successfully trained over 10,000 students and helped them launch successful careers in the tech industry.

Our mission is to bridge the gap between academic education and industry requirements by providing practical, hands-on training that prepares our students for real-world challenges. We work closely with industry partners to ensure our curriculum stays current with the latest technological trends and market demands.

Located in the heart of Dubai's Knowledge Village, our state-of-the-art facilities provide an inspiring learning environment equipped with the latest technology and resources. Our expert instructors bring years of industry experience and are committed to helping every student achieve their career goals.

We pride ourselves on our high employment rate, with 95% of our graduates securing jobs within 6 months of course completion. Our strong industry connections and career support services ensure that our students have the best opportunities to launch and advance their careers in technology.`,
        shortDescription: "Leading technology education provider offering cutting-edge training programs in software development, data science, and emerging technologies.",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop"
        ],
        established: "2015",
        rating: 4.8,
        totalReviews: 847,
        location: {
          address: "Building 12, Dubai Knowledge Village",
          city: "Dubai",
          country: "UAE",
          coordinates: { lat: 25.2048, lng: 55.2708 }
        },
        contact: {
          phone: "+971-4-123-4567",
          email: "info@techproinstitute.ae",
          website: "https://www.techproinstitute.ae",
          socialMedia: {
            facebook: "https://facebook.com/techproinstitute",
            twitter: "https://twitter.com/techproinstitute",
            linkedin: "https://linkedin.com/company/techproinstitute",
            instagram: "https://instagram.com/techproinstitute"
          }
        },
        accreditation: [
          "ISO 9001:2015 Certified",
          "Dubai Knowledge Village Approved",
          "KHDA Licensed",
          "Microsoft Learning Partner",
          "AWS Training Partner",
          "Google Cloud Partner"
        ],
        certificationPartners: [
          "Microsoft", "Amazon Web Services", "Google Cloud", "CompTIA", 
          "Cisco", "Oracle", "Adobe", "Salesforce"
        ],
        facilities: [
          "Modern Computer Labs", "High-Speed Internet", "Smart Classrooms", 
          "Library & Study Areas", "Student Lounge", "Cafeteria", 
          "Parking Facility", "24/7 Security", "Accessibility Features"
        ],
        specializations: [
          "Software Development", "Data Science & AI", "Cybersecurity", 
          "Digital Marketing", "Cloud Computing", "Mobile Development",
          "Web Development", "DevOps", "UI/UX Design"
        ],
        stats: {
          totalStudents: 12500,
          totalCourses: 85,
          successRate: 94,
          employmentRate: 95
        },
        courses: [
          {
            id: "1",
            title: "Advanced React Development with TypeScript",
            category: "Web Development",
            level: "Advanced",
            duration: "8 weeks",
            format: "Hybrid",
            price: 899,
            currency: "USD",
            rating: 4.7,
            enrolledStudents: 18,
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
            startDate: "2025-01-15"
          },
          {
            id: "2",
            title: "Data Science Fundamentals with Python",
            category: "Data Science",
            level: "Beginner",
            duration: "12 weeks",
            format: "Online",
            price: 1299,
            currency: "USD",
            rating: 4.6,
            enrolledStudents: 25,
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
            startDate: "2025-01-20"
          },
          {
            id: "3",
            title: "Cybersecurity Essentials",
            category: "Cybersecurity",
            level: "Intermediate",
            duration: "10 weeks",
            format: "In-person",
            price: 1599,
            currency: "USD",
            rating: 4.8,
            enrolledStudents: 15,
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop",
            startDate: "2025-02-01"
          },
          {
            id: "4",
            title: "AWS Cloud Practitioner Certification",
            category: "Cloud Computing",
            level: "Beginner",
            duration: "6 weeks",
            format: "Hybrid",
            price: 799,
            currency: "USD",
            rating: 4.9,
            enrolledStudents: 22,
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop",
            startDate: "2025-01-25"
          }
        ],
        instructors: [
          {
            id: "1",
            name: "Sarah Johnson",
            title: "Senior React Developer",
            specialization: "Frontend Development",
            experience: "8+ years",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=150&h=150&fit=crop&crop=face",
            bio: "Former Senior Developer at Meta with expertise in React and modern JavaScript frameworks."
          },
          {
            id: "2",
            name: "Ahmed Hassan",
            title: "Data Science Lead",
            specialization: "Machine Learning",
            experience: "10+ years",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            bio: "PhD in Computer Science with extensive experience in AI and machine learning at Google."
          },
          {
            id: "3",
            name: "Maria Rodriguez",
            title: "Cybersecurity Expert",
            specialization: "Information Security",
            experience: "12+ years",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            bio: "Former security consultant for Fortune 500 companies with CISSP and CISM certifications."
          }
        ],
        reviews: [
          {
            id: "1",
            studentName: "Omar Al-Ahmad",
            rating: 5,
            comment: "Outstanding institute! The instructors are industry experts and the curriculum is very up-to-date. Landed a great job as a React developer right after graduation.",
            date: "2024-11-20",
            verified: true,
            courseTaken: "Advanced React Development"
          },
          {
            id: "2",
            studentName: "Fatima Al-Zahra",
            rating: 5,
            comment: "The Data Science program exceeded my expectations. Great hands-on projects and excellent career support. Highly recommend!",
            date: "2024-11-18",
            verified: true,
            courseTaken: "Data Science Fundamentals"
          },
          {
            id: "3",
            studentName: "John Michael",
            rating: 4,
            comment: "Professional environment with modern facilities. The cybersecurity course was comprehensive and practical.",
            date: "2024-11-15",
            verified: true,
            courseTaken: "Cybersecurity Essentials"
          }
        ],
        achievements: [
          "Best Training Institute Award 2023 - Dubai Education Council",
          "Top 10 Tech Education Providers in UAE",
          "Microsoft Gold Partner Status",
          "AWS Advanced Consulting Partner",
          "95% Graduate Employment Rate",
          "1000+ Successful Industry Placements"
        ],
        partnerships: [
          "Microsoft", "Amazon Web Services", "Google", "Meta", "Oracle",
          "Cisco", "CompTIA", "Salesforce", "Adobe", "IBM"
        ],
        campuses: [
          {
            id: "1",
            name: "Dubai Knowledge Village Campus",
            address: "Building 12, Dubai Knowledge Village, Dubai, UAE",
            facilities: ["Computer Labs", "Smart Classrooms", "Library", "Student Lounge"],
            capacity: 500
          },
          {
            id: "2",
            name: "Abu Dhabi Campus",
            address: "Masdar City, Abu Dhabi, UAE",
            facilities: ["Computer Labs", "Conference Rooms", "Study Areas"],
            capacity: 200
          }
        ],
        admissionProcess: [
          "Submit online application with required documents",
          "Complete aptitude assessment test",
          "Attend personal interview (online or in-person)",
          "Receive admission decision within 3-5 business days",
          "Complete enrollment and payment process",
          "Attend orientation session before course starts"
        ],
        financialAid: true,
        scholarships: [
          {
            name: "Excellence Scholarship",
            description: "Merit-based scholarship for top performers",
            eligibility: "Minimum 90% in aptitude test",
            amount: "Up to 50% tuition fee waiver"
          },
          {
            name: "Women in Tech Scholarship",
            description: "Supporting women entering technology careers",
            eligibility: "Female candidates in STEM programs",
            amount: "Up to 30% tuition fee waiver"
          },
          {
            name: "Early Bird Discount",
            description: "Discount for early enrollment",
            eligibility: "Enroll 30 days before course start",
            amount: "15% discount on tuition fees"
          }
        ]
      };

      setInstitute(mockInstitute);
    } catch (error) {
      console.error("Error fetching institute details:", error);
      toast.error("Failed to load institute details");
    } finally {
      setLoading(false);
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
          <p className="mt-4 text-gray-600">Loading institute details...</p>
        </div>
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Institute Not Found</h2>
          <p className="text-gray-600 mb-4">The institute you're looking for could not be found.</p>
          <button
            onClick={() => router.push("/institutes")}
            className="bg-[#17487f] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Institutes
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{institute.name} | Overseas.ai</title>
        <meta name="description" content={institute.shortDescription} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
            <img
              src={institute.coverImage}
              alt={institute.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{institute.name}</h1>
              <p className="text-lg opacity-90">{institute.shortDescription}</p>
            </div>
          </div>

          {/* Institute Info */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6">
                <img
                  src={institute.logo}
                  alt={institute.name}
                  className="w-20 h-20 rounded-lg object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <div className="flex items-center mb-2">
                    {getRatingStars(institute.rating, "lg")}
                    <span className="ml-4 text-gray-600">({institute.totalReviews} reviews)</span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    <i className="fa fa-map-marker mr-2"></i>
                    {institute.location.address}, {institute.location.city}, {institute.location.country}
                  </p>
                  <p className="text-gray-600">
                    <i className="fa fa-calendar mr-2"></i>
                    Established {institute.established}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(true)}
                className="bg-[#17487f] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="fa fa-phone mr-2"></i>
                Contact Institute
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold textBlue">{institute.stats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{institute.stats.totalCourses}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{institute.stats.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{institute.stats.employmentRate}%</div>
                <div className="text-sm text-gray-600">Employment Rate</div>
              </div>
            </div>

            {/* Accreditations */}
            <div className="flex flex-wrap gap-2">
              {institute.accreditation.map((acc, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {acc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: 'fa-info-circle' },
                { id: 'courses', label: 'Courses', icon: 'fa-book' },
                { id: 'instructors', label: 'Instructors', icon: 'fa-users' },
                { id: 'reviews', label: 'Reviews', icon: 'fa-star' },
                { id: 'admissions', label: 'Admissions', icon: 'fa-graduation-cap' }
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
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">About the Institute</h3>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {institute.description}
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Campus Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {institute.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${institute.name} facility ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setActiveImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Facilities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {institute.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center">
                        <i className="fa fa-check text-green-500 mr-3"></i>
                        <span className="text-gray-600">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {institute.specializations.map((spec, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Achievements & Recognition</h3>
                  <div className="space-y-2">
                    {institute.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <i className="fa fa-trophy text-yellow-500 mr-3 mt-1"></i>
                        <span className="text-gray-600">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partnerships */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Industry Partners</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {institute.partnerships.map((partner, index) => (
                      <div key={index} className="bg-gray-100 p-4 rounded-lg text-center text-sm font-medium text-gray-700">
                        {partner}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'courses' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold textBlue mb-4">Available Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {institute.courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                            {course.category}
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {course.level}
                          </span>
                        </div>
                        <h4 className="font-semibold textBlue mb-2">{course.title}</h4>
                        <div className="flex items-center mb-3">
                          {getRatingStars(course.rating, "sm")}
                          <span className="ml-2 text-sm text-gray-600">
                            ({course.enrolledStudents} students)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span><i className="fa fa-clock mr-1"></i>{course.duration}</span>
                          <span><i className="fa fa-globe mr-1"></i>{course.format}</span>
                          <span><i className="fa fa-calendar mr-1"></i>{formatDate(course.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold textBlue">${course.price}</span>
                          <button
                            onClick={() => router.push(`/course-details/${course.id}`)}
                            className="bg-[#17487f] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'instructors' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold textBlue mb-4">Our Expert Instructors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {institute.instructors.map((instructor) => (
                    <div key={instructor.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="text-center mb-4">
                        <img
                          src={instructor.image}
                          alt={instructor.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                        />
                        <h4 className="font-semibold textBlue">{instructor.name}</h4>
                        <p className="text-sm text-gray-600">{instructor.title}</p>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p><i className="fa fa-graduation-cap mr-2"></i>{instructor.specialization}</p>
                        <p><i className="fa fa-briefcase mr-2"></i>{instructor.experience}</p>
                        <div className="flex items-center justify-center">
                          {getRatingStars(instructor.rating, "sm")}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{instructor.bio}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold textBlue">Student Reviews</h3>
                  <div className="flex items-center">
                    {getRatingStars(institute.rating)}
                    <span className="ml-2 text-gray-600">({institute.totalReviews} total reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {institute.reviews.map((review) => (
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
                            <p className="text-sm text-gray-600">{review.courseTaken} • {formatDate(review.date)}</p>
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

            {selectedTab === 'admissions' && (
              <div className="space-y-8">
                {/* Admission Process */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Admission Process</h3>
                  <div className="space-y-3">
                    {institute.admissionProcess.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                          {index + 1}
                        </div>
                        <p className="text-gray-600 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scholarships */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Scholarships & Financial Aid</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {institute.scholarships.map((scholarship, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold textBlue mb-2">{scholarship.name}</h4>
                        <p className="text-gray-600 mb-3">{scholarship.description}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Eligibility:</strong> {scholarship.eligibility}</p>
                          <p><strong>Amount:</strong> {scholarship.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campuses */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Campus Locations</h3>
                  <div className="space-y-4">
                    {institute.campuses.map((campus) => (
                      <div key={campus.id} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold textBlue mb-2">{campus.name}</h4>
                        <p className="text-gray-600 mb-3">
                          <i className="fa fa-map-marker mr-2"></i>
                          {campus.address}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600"><strong>Capacity:</strong> {campus.capacity} students</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2"><strong>Facilities:</strong></p>
                            <div className="flex flex-wrap gap-1">
                              {campus.facilities.map((facility, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {facility}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact {institute.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <i className="fa fa-phone text-blue-600 w-5 mr-3"></i>
                  <a href={`tel:${institute.contact.phone}`} className="text-gray-600 hover:text-blue-600">
                    {institute.contact.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-envelope text-blue-600 w-5 mr-3"></i>
                  <a href={`mailto:${institute.contact.email}`} className="text-gray-600 hover:text-blue-600">
                    {institute.contact.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-globe text-blue-600 w-5 mr-3"></i>
                  <a href={institute.contact.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                    Visit Website
                  </a>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                {Object.entries(institute.contact.socialMedia).map(([platform, url]) => (
                  url && (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 text-xl"
                    >
                      <i className={`fa fa-${platform}`}></i>
                    </a>
                  )
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
