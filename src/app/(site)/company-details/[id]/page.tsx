"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";

interface CompanyDetail {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  logo: string;
  coverImage: string;
  images: string[];
  founded: string;
  size: string;
  industry: string;
  headquarters: {
    address: string;
    city: string;
    country: string;
  };
  offices: Array<{
    city: string;
    country: string;
    address: string;
    employees: number;
  }>;
  contact: {
    phone: string;
    email: string;
    website: string;
    careers: string;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
  rating: number;
  totalReviews: number;
  culture: {
    values: string[];
    workEnvironment: string;
    benefits: string[];
    diversity: string;
  };
  stats: {
    totalEmployees: number;
    openPositions: number;
    avgSalary: number;
    employeeSatisfaction: number;
  };
  jobs: Array<{
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    salaryRange: {
      min: number;
      max: number;
      currency: string;
    };
    postedDate: string;
    applicants: number;
    isUrgent: boolean;
    description: string;
  }>;
  team: Array<{
    id: string;
    name: string;
    position: string;
    department: string;
    image: string;
    bio: string;
    linkedin?: string;
  }>;
  reviews: Array<{
    id: string;
    reviewerName: string;
    position: string;
    rating: number;
    comment: string;
    pros: string[];
    cons: string[];
    date: string;
    verified: boolean;
    recommend: boolean;
  }>;
  awards: string[];
  certifications: string[];
  technologies: string[];
  workPolicy: {
    remoteWork: boolean;
    flexibleHours: boolean;
    hybridModel: boolean;
    paidTimeOff: number;
    sickLeave: number;
  };
  careerGrowth: {
    trainingPrograms: string[];
    mentorship: boolean;
    promotionRate: number;
    learningBudget: number;
  };
  companyNews: Array<{
    id: string;
    title: string;
    summary: string;
    date: string;
    link: string;
    category: string;
  }>;
}

export default function CompanyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'jobs' | 'team' | 'reviews' | 'culture'>('overview');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      // Mock company data - replace with actual API call
      const mockCompany: CompanyDetail = {
        id: companyId,
        name: "TechCorp Solutions",
        description: `TechCorp Solutions is a leading technology company that specializes in developing innovative software solutions for businesses worldwide. Founded in 2010, we have grown from a small startup to a multinational corporation with offices in Dubai, London, Singapore, and New York.

Our mission is to empower businesses through technology by providing cutting-edge solutions that drive growth, efficiency, and innovation. We serve clients across various industries including finance, healthcare, e-commerce, and manufacturing.

At TechCorp, we believe that our employees are our greatest asset. We foster a culture of innovation, collaboration, and continuous learning. Our diverse team of talented professionals works together to solve complex challenges and deliver exceptional results for our clients.

We are committed to creating a workplace where everyone can thrive, grow, and make a meaningful impact. Our comprehensive benefits package, flexible work arrangements, and focus on work-life balance make TechCorp an employer of choice in the technology industry.`,
        shortDescription: "Leading technology company providing innovative software solutions for businesses worldwide with offices across Dubai, London, Singapore, and New York.",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop"
        ],
        founded: "2010",
        size: "1000-5000 employees",
        industry: "Information Technology",
        headquarters: {
          address: "Sheikh Zayed Road, Trade Centre",
          city: "Dubai",
          country: "UAE"
        },
        offices: [
          {
            city: "Dubai",
            country: "UAE",
            address: "Sheikh Zayed Road, Trade Centre",
            employees: 250
          },
          {
            city: "London",
            country: "UK",
            address: "Canary Wharf, London",
            employees: 180
          },
          {
            city: "Singapore",
            country: "Singapore", 
            address: "Marina Bay Financial Centre",
            employees: 120
          },
          {
            city: "New York",
            country: "USA",
            address: "Manhattan, NYC",
            employees: 200
          }
        ],
        contact: {
          phone: "+971-4-567-8900",
          email: "info@techcorp.com",
          website: "https://www.techcorp.com",
          careers: "https://careers.techcorp.com",
          socialMedia: {
            linkedin: "https://linkedin.com/company/techcorp",
            twitter: "https://twitter.com/techcorp",
            facebook: "https://facebook.com/techcorp",
            instagram: "https://instagram.com/techcorp"
          }
        },
        rating: 4.6,
        totalReviews: 324,
        culture: {
          values: [
            "Innovation First", "Customer Success", "Team Collaboration", 
            "Integrity & Trust", "Continuous Learning", "Work-Life Balance"
          ],
          workEnvironment: "Modern, collaborative workspace with open-plan offices, recreational areas, and state-of-the-art technology infrastructure.",
          benefits: [
            "Health Insurance", "Dental & Vision", "Life Insurance", "401k Matching",
            "Flexible Working Hours", "Remote Work Options", "Professional Development",
            "Paid Time Off", "Parental Leave", "Gym Membership", "Free Meals",
            "Transportation Allowance", "Annual Retreats"
          ],
          diversity: "We are committed to building a diverse and inclusive workplace where people from all backgrounds can thrive and contribute to our success."
        },
        stats: {
          totalEmployees: 750,
          openPositions: 25,
          avgSalary: 85000,
          employeeSatisfaction: 87
        },
        jobs: [
          {
            id: "1",
            title: "Senior Software Engineer",
            department: "Engineering",
            location: "Dubai, UAE",
            type: "Full-time",
            experience: "5+ years",
            salaryRange: {
              min: 15000,
              max: 25000,
              currency: "AED"
            },
            postedDate: "2024-12-01",
            applicants: 45,
            isUrgent: true,
            description: "We are looking for a Senior Software Engineer to join our Dubai team and lead the development of our next-generation applications."
          },
          {
            id: "2",
            title: "Product Manager",
            department: "Product",
            location: "Remote",
            type: "Full-time",
            experience: "3+ years",
            salaryRange: {
              min: 12000,
              max: 18000,
              currency: "AED"
            },
            postedDate: "2024-11-28",
            applicants: 32,
            isUrgent: false,
            description: "Join our product team to define and execute product strategy for our innovative software solutions."
          },
          {
            id: "3",
            title: "Data Scientist",
            department: "Data & Analytics",
            location: "Singapore",
            type: "Full-time",
            experience: "4+ years",
            salaryRange: {
              min: 20000,
              max: 30000,
              currency: "SGD"
            },
            postedDate: "2024-11-25",
            applicants: 28,
            isUrgent: false,
            description: "Lead data science initiatives and develop machine learning models to drive business insights."
          },
          {
            id: "4",
            title: "Frontend Developer",
            department: "Engineering",
            location: "London, UK",
            type: "Contract",
            experience: "2+ years",
            salaryRange: {
              min: 40000,
              max: 60000,
              currency: "GBP"
            },
            postedDate: "2024-11-22",
            applicants: 67,
            isUrgent: true,
            description: "Build responsive and interactive user interfaces using modern frontend technologies."
          }
        ],
        team: [
          {
            id: "1",
            name: "Sarah Ahmed",
            position: "Chief Technology Officer",
            department: "Technology",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=150&h=150&fit=crop&crop=face",
            bio: "Sarah leads our technology vision and strategy with over 15 years of experience in software development and architecture.",
            linkedin: "https://linkedin.com/in/sarah-ahmed"
          },
          {
            id: "2",
            name: "Michael Chen",
            position: "VP of Engineering",
            department: "Engineering",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            bio: "Michael oversees our engineering teams and drives technical excellence across all our product lines.",
            linkedin: "https://linkedin.com/in/michael-chen"
          },
          {
            id: "3",
            name: "Emily Rodriguez",
            position: "Head of Product",
            department: "Product",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            bio: "Emily leads product strategy and development, ensuring we build solutions that truly meet our customers' needs."
          },
          {
            id: "4",
            name: "David Kumar",
            position: "Director of Data Science",
            department: "Data & Analytics",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            bio: "David heads our data science initiatives and helps derive actionable insights from complex datasets."
          }
        ],
        reviews: [
          {
            id: "1",
            reviewerName: "Anonymous Software Engineer",
            position: "Software Engineer",
            rating: 5,
            comment: "Amazing company culture and work-life balance. Great opportunities for growth and learning.",
            pros: ["Excellent benefits", "Flexible working hours", "Great team collaboration", "Learning opportunities"],
            cons: ["Sometimes fast-paced environment can be challenging"],
            date: "2024-11-15",
            verified: true,
            recommend: true
          },
          {
            id: "2",
            reviewerName: "Former Product Manager",
            position: "Product Manager",
            rating: 4,
            comment: "Good company with strong leadership and clear vision. Compensation is competitive.",
            pros: ["Strong leadership", "Clear career path", "Good compensation", "Modern office"],
            cons: ["Limited remote work options", "High expectations"],
            date: "2024-10-28",
            verified: true,
            recommend: true
          },
          {
            id: "3",
            reviewerName: "Current Data Analyst",
            position: "Data Analyst",
            rating: 5,
            comment: "Love working here! The company truly cares about employee development and satisfaction.",
            pros: ["Professional development support", "Diverse team", "Innovation focus", "Great benefits"],
            cons: ["Could use more diversity in leadership"],
            date: "2024-11-02",
            verified: true,
            recommend: true
          }
        ],
        awards: [
          "Best Places to Work in Tech 2023",
          "Top Employer Award - UAE",
          "Innovation Excellence Award",
          "Digital Transformation Leader",
          "Diversity & Inclusion Champion"
        ],
        certifications: [
          "ISO 9001:2015", "ISO 27001:2013", "SOC 2 Type II", "AWS Partner", 
          "Microsoft Gold Partner", "Google Cloud Partner"
        ],
        technologies: [
          "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java",
          "AWS", "Azure", "Docker", "Kubernetes", "MongoDB", "PostgreSQL"
        ],
        workPolicy: {
          remoteWork: true,
          flexibleHours: true,
          hybridModel: true,
          paidTimeOff: 25,
          sickLeave: 10
        },
        careerGrowth: {
          trainingPrograms: [
            "Technical Certification Programs", "Leadership Development",
            "Conference Attendance", "Online Learning Platforms"
          ],
          mentorship: true,
          promotionRate: 75,
          learningBudget: 2000
        },
        companyNews: [
          {
            id: "1",
            title: "TechCorp Expands to New Markets",
            summary: "We're excited to announce our expansion into Southeast Asian markets with new offices in Thailand and Vietnam.",
            date: "2024-11-20",
            link: "#",
            category: "Expansion"
          },
          {
            id: "2",
            title: "Innovation Award Recognition",
            summary: "TechCorp receives prestigious innovation award for our AI-powered business solutions platform.",
            date: "2024-11-10",
            link: "#",
            category: "Awards"
          },
          {
            id: "3",
            title: "New Sustainability Initiative",
            summary: "Launching our comprehensive sustainability program to achieve carbon neutrality by 2030.",
            date: "2024-10-25",
            link: "#",
            category: "Sustainability"
          }
        ]
      };

      setCompany(mockCompany);
    } catch (error) {
      console.error("Error fetching company details:", error);
      toast.error("Failed to load company details");
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

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Company Not Found</h2>
          <p className="text-gray-600 mb-4">The company you're looking for could not be found.</p>
          <button
            onClick={() => router.push("/jobs")}
            className="bg-[#17487f] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{company.name} - Company Profile | Overseas.ai</title>
        <meta name="description" content={company.shortDescription} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
            <img
              src={company.coverImage}
              alt={company.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
              <p className="text-lg opacity-90">{company.shortDescription}</p>
            </div>
          </div>

          {/* Company Info */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-20 h-20 rounded-lg object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <div className="flex items-center mb-2">
                    {getRatingStars(company.rating, "lg")}
                    <span className="ml-4 text-gray-600">({company.totalReviews} reviews)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <p><i className="fa fa-building mr-2"></i>{company.industry}</p>
                    <p><i className="fa fa-users mr-2"></i>{company.size}</p>
                    <p><i className="fa fa-calendar mr-2"></i>Founded {company.founded}</p>
                    <p><i className="fa fa-map-marker mr-2"></i>{company.headquarters.city}, {company.headquarters.country}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(true)}
                className="bg-[#17487f] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="fa fa-phone mr-2"></i>
                Contact Company
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold textBlue">{company.stats.totalEmployees}</div>
                <div className="text-sm text-gray-600">Total Employees</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{company.stats.openPositions}</div>
                <div className="text-sm text-gray-600">Open Positions</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">${company.stats.avgSalary.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Avg Salary</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{company.stats.employeeSatisfaction}%</div>
                <div className="text-sm text-gray-600">Employee Satisfaction</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex space-x-4">
              <a
                href={company.contact.careers}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <i className="fa fa-briefcase mr-2"></i>
                View All Jobs
              </a>
              <a
                href={company.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className="fa fa-globe mr-2"></i>
                Visit Website
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: 'fa-info-circle' },
                { id: 'jobs', label: 'Jobs', icon: 'fa-briefcase' },
                { id: 'team', label: 'Team', icon: 'fa-users' },
                { id: 'reviews', label: 'Reviews', icon: 'fa-star' },
                { id: 'culture', label: 'Culture', icon: 'fa-heart' }
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
                  <h3 className="text-xl font-semibold textBlue mb-4">About the Company</h3>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {company.description}
                  </div>
                </div>

                {/* Office Locations */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Office Locations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {company.offices.map((office, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold textBlue mb-2">
                          {office.city}, {office.country}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          <i className="fa fa-map-marker mr-2"></i>
                          {office.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <i className="fa fa-users mr-2"></i>
                          {office.employees} employees
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Gallery */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Company Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {company.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${company.name} office ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setActiveImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Technologies We Use</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.technologies.map((tech, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Awards & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold textBlue mb-4">Awards & Recognition</h3>
                    <div className="space-y-2">
                      {company.awards.map((award, index) => (
                        <div key={index} className="flex items-start">
                          <i className="fa fa-trophy text-yellow-500 mr-3 mt-1"></i>
                          <span className="text-gray-600">{award}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold textBlue mb-4">Certifications</h3>
                    <div className="space-y-2">
                      {company.certifications.map((cert, index) => (
                        <div key={index} className="flex items-start">
                          <i className="fa fa-certificate text-green-500 mr-3 mt-1"></i>
                          <span className="text-gray-600">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent News */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Recent News</h3>
                  <div className="space-y-4">
                    {company.companyNews.map((news) => (
                      <div key={news.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold textBlue">{news.title}</h4>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {news.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{news.summary}</p>
                        <p className="text-sm text-gray-500">{formatDate(news.date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'jobs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold textBlue">Open Positions ({company.jobs.length})</h3>
                  <a
                    href={company.contact.careers}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All Jobs
                    <i className="fa fa-external-link ml-2"></i>
                  </a>
                </div>

                <div className="space-y-4">
                  {company.jobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold textBlue mr-3">{job.title}</h4>
                            {job.isUrgent && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                Urgent
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <span><i className="fa fa-building mr-1"></i>{job.department}</span>
                            <span><i className="fa fa-map-marker mr-1"></i>{job.location}</span>
                            <span><i className="fa fa-clock mr-1"></i>{job.type}</span>
                            <span><i className="fa fa-user mr-1"></i>{job.experience}</span>
                          </div>
                          <p className="text-gray-600 mb-3">{job.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-green-600">
                              {formatSalary(job.salaryRange.min, job.salaryRange.max, job.salaryRange.currency)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {job.applicants} applicants • Posted {formatDate(job.postedDate)}
                            </span>
                          </div>
                        </div>
                        <a href="job-details/${job.id}" title=""> <button
                          onClick={() => router.push(`/job-details/${job.id}`)}
                          className="ml-6 bg-[#17487f] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Apply Now
                        </button></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'team' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold textBlue">Leadership Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {company.team.map((member) => (
                    <div key={member.id} className="flex items-start space-x-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold textBlue mb-1">{member.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">{member.position}</p>
                        <p className="text-xs text-gray-500 mb-3">{member.department}</p>
                        <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <i className="fa fa-linkedin mr-2"></i>
                            Connect on LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold textBlue">Employee Reviews</h3>
                  <div className="flex items-center">
                    {getRatingStars(company.rating)}
                    <span className="ml-2 text-gray-600">({company.totalReviews} total reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {company.reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <p className="font-medium textBlue mr-2">{review.reviewerName}</p>
                            {review.verified && (
                              <i className="fa fa-check-circle text-green-500 text-sm" title="Verified Employee"></i>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{review.position} • {formatDate(review.date)}</p>
                        </div>
                        <div className="text-right">
                          {getRatingStars(review.rating, "sm")}
                          {review.recommend && (
                            <p className="text-xs text-green-600 mt-1">
                              <i className="fa fa-thumbs-up mr-1"></i>
                              Recommends
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{review.comment}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Pros</h5>
                          <ul className="space-y-1">
                            {review.pros.map((pro, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                <i className="fa fa-plus text-green-500 mr-2"></i>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-red-700 mb-2">Cons</h5>
                          <ul className="space-y-1">
                            {review.cons.map((con, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                <i className="fa fa-minus text-red-500 mr-2"></i>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'culture' && (
              <div className="space-y-8">
                {/* Company Values */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Company Values</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {company.culture.values.map((value, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="font-medium textBlue">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Environment */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Work Environment</h3>
                  <p className="text-gray-600 leading-relaxed">{company.culture.workEnvironment}</p>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Benefits & Perks</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {company.culture.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <i className="fa fa-check text-green-500 mr-3"></i>
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Policy */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Work Policy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Remote Work</span>
                        <span className={`px-2 py-1 rounded text-sm ${company.workPolicy.remoteWork ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {company.workPolicy.remoteWork ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Flexible Hours</span>
                        <span className={`px-2 py-1 rounded text-sm ${company.workPolicy.flexibleHours ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {company.workPolicy.flexibleHours ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Hybrid Model</span>
                        <span className={`px-2 py-1 rounded text-sm ${company.workPolicy.hybridModel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {company.workPolicy.hybridModel ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Paid Time Off</span>
                        <span className="text-gray-800 font-medium">{company.workPolicy.paidTimeOff} days/year</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sick Leave</span>
                        <span className="text-gray-800 font-medium">{company.workPolicy.sickLeave} days/year</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career Growth */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Career Growth & Development</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Training Programs</h4>
                      <ul className="space-y-2">
                        {company.careerGrowth.trainingPrograms.map((program, index) => (
                          <li key={index} className="text-gray-600">
                            <i className="fa fa-graduation-cap text-blue-500 mr-2"></i>
                            {program}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Mentorship Program</span>
                        <span className={`px-2 py-1 rounded text-sm ${company.careerGrowth.mentorship ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {company.careerGrowth.mentorship ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Internal Promotion Rate</span>
                        <span className="text-gray-800 font-medium">{company.careerGrowth.promotionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Learning Budget</span>
                        <span className="text-gray-800 font-medium">${company.careerGrowth.learningBudget}/year</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diversity & Inclusion */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Diversity & Inclusion</h3>
                  <p className="text-gray-600 leading-relaxed">{company.culture.diversity}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact {company.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <i className="fa fa-phone text-blue-600 w-5 mr-3"></i>
                  <a href={`tel:${company.contact.phone}`} className="text-gray-600 hover:text-blue-600">
                    {company.contact.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-envelope text-blue-600 w-5 mr-3"></i>
                  <a href={`mailto:${company.contact.email}`} className="text-gray-600 hover:text-blue-600">
                    {company.contact.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-globe text-blue-600 w-5 mr-3"></i>
                  <a href={company.contact.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                    Visit Website
                  </a>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-briefcase text-blue-600 w-5 mr-3"></i>
                  <a href={company.contact.careers} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                    View Careers Page
                  </a>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                {Object.entries(company.contact.socialMedia).map(([platform, url]) => (
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
