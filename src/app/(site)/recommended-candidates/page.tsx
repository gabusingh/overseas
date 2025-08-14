"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";

interface RecommendedCandidate {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  currentLocation: string;
  experience: string;
  expectedSalary: string;
  currency: string;
  skills: string[];
  education: string;
  profilePicture?: string;
  rating?: number;
  matchScore: number;
  matchReasons: string[];
  availability: string;
  lastActive: string;
  workAuthStatus: "authorized" | "visa_required" | "citizen";
  languageSkills: string[];
  certifications: string[];
  previousCompanies: string[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  isBookmarked: boolean;
  contactedDate?: string;
  responseStatus?: "not_contacted" | "contacted" | "responded" | "interested" | "not_interested";
}

interface JobFilter {
  id: string;
  title: string;
  department: string;
  location: string;
  experienceLevel: string;
  skillsRequired: string[];
}

export default function RecommendedCandidatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<RecommendedCandidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<RecommendedCandidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobFilter | null>(null);
  const [availableJobs, setAvailableJobs] = useState<JobFilter[]>([]);
  
  // Filters
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [matchScoreFilter, setMatchScoreFilter] = useState<number>(0);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [workAuthFilter, setWorkAuthFilter] = useState<string>("all");
  const [contactStatusFilter, setContactStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("match_score");
  
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [isContacting, setIsContacting] = useState(false);

  useEffect(() => {
    fetchRecommendedCandidates();
    fetchAvailableJobs();
  }, [jobId]);

  useEffect(() => {
    filterAndSortCandidates();
  }, [candidates, searchQuery, experienceFilter, locationFilter, matchScoreFilter, availabilityFilter, workAuthFilter, contactStatusFilter, sortBy]);

  const fetchAvailableJobs = async () => {
    try {
      // Mock jobs data
      const mockJobs: JobFilter[] = [
        {
          id: "1",
          title: "Senior Software Engineer",
          department: "Engineering",
          location: "Dubai, UAE",
          experienceLevel: "Senior",
          skillsRequired: ["React", "Node.js", "AWS", "MongoDB"]
        },
        {
          id: "2", 
          title: "Frontend Developer",
          department: "Engineering",
          location: "Abu Dhabi, UAE",
          experienceLevel: "Mid-level",
          skillsRequired: ["React", "TypeScript", "CSS", "JavaScript"]
        },
        {
          id: "3",
          title: "DevOps Engineer",
          department: "Infrastructure",
          location: "Remote",
          experienceLevel: "Senior",
          skillsRequired: ["Docker", "Kubernetes", "AWS", "CI/CD"]
        }
      ];

      setAvailableJobs(mockJobs);
      
      // Set selected job based on jobId or default to first
      const currentJob = mockJobs.find(job => job.id === jobId) || mockJobs[0];
      setSelectedJob(currentJob);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    }
  };

  const fetchRecommendedCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Mock recommended candidates data with AI matching scores
      const mockCandidates: RecommendedCandidate[] = [
        {
          id: "1",
          candidateName: "Ahmed Hassan",
          email: "ahmed.hassan@email.com",
          phone: "+971-50-123-4567",
          currentLocation: "Mumbai, India",
          experience: "5 years",
          expectedSalary: "12000",
          currency: "AED",
          skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
          education: "Bachelor's in Computer Science",
          rating: 4.2,
          matchScore: 95,
          matchReasons: [
            "5+ years React experience matches requirements",
            "Node.js and AWS skills are perfect fit", 
            "Located in preferred timezone",
            "Salary expectations align with budget"
          ],
          availability: "Immediately",
          lastActive: "2024-12-10",
          workAuthStatus: "visa_required",
          languageSkills: ["English", "Arabic", "Hindi"],
          certifications: ["AWS Solutions Architect", "MongoDB Certified Developer"],
          previousCompanies: ["TechCorp Dubai", "InnovateSoft Mumbai"],
          portfolioUrl: "https://ahmed-portfolio.dev",
          linkedinUrl: "https://linkedin.com/in/ahmed-hassan",
          githubUrl: "https://github.com/ahmed-hassan",
          isBookmarked: false,
          responseStatus: "not_contacted",
          profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "2",
          candidateName: "Priya Sharma",
          email: "priya.sharma@email.com", 
          phone: "+91-98765-43210",
          currentLocation: "Bangalore, India",
          experience: "7 years",
          expectedSalary: "15000",
          currency: "AED",
          skills: ["Angular", "React", "Python", "PostgreSQL", "Docker"],
          education: "Master's in Software Engineering",
          rating: 4.7,
          matchScore: 92,
          matchReasons: [
            "7+ years full-stack experience",
            "Strong React and Python background",
            "Docker skills for containerization",
            "Previous startup experience"
          ],
          availability: "2 weeks notice",
          lastActive: "2024-12-09",
          workAuthStatus: "visa_required",
          languageSkills: ["English", "Hindi", "Kannada"],
          certifications: ["Google Cloud Professional", "React Advanced Certification"],
          previousCompanies: ["Flipkart", "Zomato", "TechStart Bangalore"],
          linkedinUrl: "https://linkedin.com/in/priya-sharma",
          githubUrl: "https://github.com/priya-sharma",
          isBookmarked: true,
          contactedDate: "2024-12-08",
          responseStatus: "interested",
          profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "3",
          candidateName: "Mohammad Khan",
          email: "mohammad.khan@email.com",
          phone: "+92-300-123-4567", 
          currentLocation: "Karachi, Pakistan",
          experience: "6 years",
          expectedSalary: "10000",
          currency: "AED",
          skills: ["Vue.js", "Laravel", "MySQL", "Redis", "JavaScript"],
          education: "Bachelor's in Information Technology",
          rating: 4.0,
          matchScore: 78,
          matchReasons: [
            "6 years JavaScript experience",
            "Full-stack development background",
            "Budget-friendly salary expectations",
            "Available immediately"
          ],
          availability: "Immediately",
          lastActive: "2024-12-08",
          workAuthStatus: "visa_required",
          languageSkills: ["English", "Urdu"],
          certifications: ["Laravel Certified Developer"],
          previousCompanies: ["SoftTech Karachi", "WebSolutions Pakistan"],
          linkedinUrl: "https://linkedin.com/in/mohammad-khan",
          isBookmarked: false,
          responseStatus: "not_contacted",
          profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "4",
          candidateName: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1-555-123-4567",
          currentLocation: "New York, USA",
          experience: "8 years",
          expectedSalary: "18000",
          currency: "AED",
          skills: ["React Native", "TypeScript", "GraphQL", "Kubernetes", "AWS"],
          education: "Master's in Computer Engineering",
          rating: 4.9,
          matchScore: 98,
          matchReasons: [
            "8+ years senior-level experience",
            "React Native and TypeScript expertise",
            "GraphQL and AWS cloud experience",
            "Strong technical leadership background"
          ],
          availability: "1 month notice",
          lastActive: "2024-12-07",
          workAuthStatus: "authorized",
          languageSkills: ["English"],
          certifications: ["AWS DevOps Engineer", "Kubernetes Administrator", "React Native Certified"],
          previousCompanies: ["Google", "Netflix", "Airbnb"],
          portfolioUrl: "https://sarah-johnson.dev",
          linkedinUrl: "https://linkedin.com/in/sarah-johnson",
          githubUrl: "https://github.com/sarah-johnson",
          isBookmarked: true,
          contactedDate: "2024-12-05",
          responseStatus: "responded",
          profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "5",
          candidateName: "David Chen",
          email: "david.chen@email.com",
          phone: "+65-9876-5432",
          currentLocation: "Singapore",
          experience: "9 years",
          expectedSalary: "20000",
          currency: "AED",
          skills: ["Java", "Spring Boot", "Microservices", "AWS", "Kafka"],
          education: "Master's in Computer Science",
          rating: 4.5,
          matchScore: 85,
          matchReasons: [
            "9+ years Java enterprise experience",
            "Microservices architecture expertise",
            "AWS cloud platform proficiency",
            "Singapore location advantage"
          ],
          availability: "3 weeks notice",
          lastActive: "2024-12-06",
          workAuthStatus: "citizen",
          languageSkills: ["English", "Mandarin"],
          certifications: ["Oracle Java Certified", "AWS Solutions Architect", "Spring Professional"],
          previousCompanies: ["DBS Bank", "Grab", "Sea Limited"],
          linkedinUrl: "https://linkedin.com/in/david-chen",
          isBookmarked: false,
          responseStatus: "not_contacted",
          profilePicture: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "6",
          candidateName: "Maria Rodriguez",
          email: "maria.rodriguez@email.com",
          phone: "+34-612-345-678",
          currentLocation: "Madrid, Spain",
          experience: "4 years",
          expectedSalary: "11000",
          currency: "AED",
          skills: ["Python", "Django", "React", "PostgreSQL", "Docker"],
          education: "Bachelor's in Software Engineering",
          rating: 4.1,
          matchScore: 82,
          matchReasons: [
            "4 years full-stack Python experience",
            "React frontend skills",
            "Django backend expertise",
            "European timezone compatibility"
          ],
          availability: "2 weeks notice",
          lastActive: "2024-12-05",
          workAuthStatus: "visa_required",
          languageSkills: ["English", "Spanish", "French"],
          certifications: ["Python Institute Certified", "Django Advanced"],
          previousCompanies: ["Banco Santander", "Telefonica"],
          linkedinUrl: "https://linkedin.com/in/maria-rodriguez",
          githubUrl: "https://github.com/maria-rodriguez",
          isBookmarked: false,
          contactedDate: "2024-12-03",
          responseStatus: "not_interested",
          profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
        },
        {
          id: "7",
          candidateName: "Raj Patel",
          email: "raj.patel@email.com",
          phone: "+971-55-987-6543",
          currentLocation: "Dubai, UAE",
          experience: "3 years",
          expectedSalary: "8000",
          currency: "AED",
          skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
          education: "Bachelor's in Computer Applications",
          rating: 3.8,
          matchScore: 88,
          matchReasons: [
            "Already located in Dubai",
            "React and Node.js skills match",
            "Budget-friendly expectations",
            "Immediate availability"
          ],
          availability: "Immediately",
          lastActive: "2024-12-10",
          workAuthStatus: "authorized",
          languageSkills: ["English", "Arabic", "Hindi"],
          certifications: ["MongoDB Developer"],
          previousCompanies: ["Emirates Group", "ADNOC Digital"],
          linkedinUrl: "https://linkedin.com/in/raj-patel",
          isBookmarked: false,
          responseStatus: "not_contacted",
          profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
        }
      ];

      setCandidates(mockCandidates);
    } catch (error) {
      console.error("Error fetching recommended candidates:", error);
      toast.error("Failed to load recommended candidates");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCandidates = () => {
    let filtered = [...candidates];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(candidate =>
        candidate.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.currentLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        candidate.previousCompanies.some(company => company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Experience filter
    if (experienceFilter !== "all") {
      filtered = filtered.filter(candidate => {
        const years = parseInt(candidate.experience);
        switch (experienceFilter) {
          case "junior": return years <= 3;
          case "mid": return years >= 4 && years <= 6;
          case "senior": return years >= 7;
          default: return true;
        }
      });
    }

    // Location filter  
    if (locationFilter !== "all") {
      filtered = filtered.filter(candidate => 
        candidate.currentLocation.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Match score filter
    if (matchScoreFilter > 0) {
      filtered = filtered.filter(candidate => candidate.matchScore >= matchScoreFilter);
    }

    // Availability filter
    if (availabilityFilter !== "all") {
      filtered = filtered.filter(candidate => {
        switch (availabilityFilter) {
          case "immediate": return candidate.availability.toLowerCase().includes("immediately");
          case "notice": return candidate.availability.toLowerCase().includes("notice") || candidate.availability.toLowerCase().includes("weeks") || candidate.availability.toLowerCase().includes("month");
          default: return true;
        }
      });
    }

    // Work authorization filter
    if (workAuthFilter !== "all") {
      filtered = filtered.filter(candidate => candidate.workAuthStatus === workAuthFilter);
    }

    // Contact status filter
    if (contactStatusFilter !== "all") {
      filtered = filtered.filter(candidate => candidate.responseStatus === contactStatusFilter);
    }

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "match_score":
          return b.matchScore - a.matchScore;
        case "experience":
          return parseInt(b.experience) - parseInt(a.experience);
        case "salary_low":
          return parseInt(a.expectedSalary) - parseInt(b.expectedSalary);
        case "salary_high":
          return parseInt(b.expectedSalary) - parseInt(a.expectedSalary);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "last_active":
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        default:
          return 0;
      }
    });

    setFilteredCandidates(filtered);
  };

  const handleBookmarkToggle = async (candidateId: string) => {
    try {
      setCandidates(prev => prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, isBookmarked: !candidate.isBookmarked }
          : candidate
      ));
      
      const candidate = candidates.find(c => c.id === candidateId);
      toast.success(
        `${candidate?.candidateName} ${candidate?.isBookmarked ? 'removed from' : 'added to'} bookmarks`
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const handleContactCandidates = async () => {
    if (selectedCandidates.length === 0) {
      toast.error("Please select candidates to contact");
      return;
    }

    setIsContacting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update contact status
      setCandidates(prev => prev.map(candidate => 
        selectedCandidates.includes(candidate.id)
          ? { 
              ...candidate, 
              responseStatus: "contacted" as const,
              contactedDate: new Date().toISOString().split('T')[0]
            }
          : candidate
      ));

      toast.success(`Successfully contacted ${selectedCandidates.length} candidates`);
      setSelectedCandidates([]);
      setShowContactModal(false);
      setContactMessage("");
    } catch (error) {
      console.error("Error contacting candidates:", error);
      toast.error("Failed to contact candidates");
    } finally {
      setIsContacting(false);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getWorkAuthBadge = (status: string) => {
    const statusConfig = {
      authorized: { bg: "bg-green-100 text-green-800", icon: "fa-check-circle", text: "Authorized" },
      citizen: { bg: "bg-blue-100 text-blue-800", icon: "fa-flag", text: "Citizen" },
      visa_required: { bg: "bg-yellow-100 text-yellow-800", icon: "fa-passport", text: "Visa Required" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.bg}`}>
        <i className={`fa ${config.icon} mr-1`}></i>
        {config.text}
      </span>
    );
  };

  const getResponseStatusBadge = (status?: string) => {
    if (!status || status === "not_contacted") return null;
    
    const statusConfig = {
      contacted: { bg: "bg-blue-100 text-blue-800", icon: "fa-envelope", text: "Contacted" },
      responded: { bg: "bg-purple-100 text-purple-800", icon: "fa-reply", text: "Responded" },
      interested: { bg: "bg-green-100 text-green-800", icon: "fa-heart", text: "Interested" },
      not_interested: { bg: "bg-red-100 text-red-800", icon: "fa-times", text: "Not Interested" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.bg}`}>
        <i className={`fa ${config.icon} mr-1`}></i>
        {config.text}
      </span>
    );
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fa fa-star text-sm ${
              i < fullStars 
                ? 'text-yellow-400' 
                : i === fullStars && hasHalfStar 
                  ? 'text-yellow-400' 
                  : 'text-gray-300'
            }`}
          ></i>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading AI-powered recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>AI Recommended Candidates - Smart Talent Matching | Overseas.ai</title>
        <meta name="description" content="Discover the best candidates for your job openings with AI-powered recommendations and smart matching." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold textBlue mb-2">
              <i className="fa fa-magic mr-3"></i>
              AI Recommended Candidates
            </h1>
            <p className="text-gray-600">
              Discover top talent matches powered by intelligent algorithms
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/hra-jobs")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Jobs
            </button>
            <button
              onClick={() => router.push("/hra-dashboard")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-dashboard mr-2"></i>
              Dashboard
            </button>
          </div>
        </div>

        {/* Job Selection & Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Job Position
              </label>
              <select
                value={selectedJob?.id || ""}
                onChange={(e) => {
                  const job = availableJobs.find(j => j.id === e.target.value);
                  setSelectedJob(job || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableJobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.location} ({job.department})
                  </option>
                ))}
              </select>
              
              {selectedJob && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedJob.skillsRequired.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center lg:text-right">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <p className="text-2xl font-bold textBlue">{filteredCandidates.length}</p>
                <p className="text-sm text-gray-600">Recommended Candidates</p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg. Match Score: {Math.round(filteredCandidates.reduce((acc, c) => acc + c.matchScore, 0) / filteredCandidates.length || 0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search candidates..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Experience</option>
                <option value="junior">Junior (1-3 years)</option>
                <option value="mid">Mid-level (4-6 years)</option>
                <option value="senior">Senior (7+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Locations</option>
                <option value="india">India</option>
                <option value="uae">UAE</option>
                <option value="usa">USA</option>
                <option value="singapore">Singapore</option>
                <option value="spain">Spain</option>
                <option value="pakistan">Pakistan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Score (Min: {matchScoreFilter}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={matchScoreFilter}
                onChange={(e) => setMatchScoreFilter(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Availability</option>
                <option value="immediate">Immediately Available</option>
                <option value="notice">On Notice Period</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="match_score">Match Score</option>
                <option value="experience">Experience</option>
                <option value="rating">Rating</option>
                <option value="salary_low">Salary (Low to High)</option>
                <option value="salary_high">Salary (High to Low)</option>
                <option value="last_active">Recently Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCandidates.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {selectedCandidates.length} candidates selected
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {selectedCandidates.length === filteredCandidates.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="bg-[#17487f] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <i className="fa fa-envelope mr-2"></i>
                  Contact Selected
                </button>
                <button
                  onClick={() => router.push(`/bulk-hire?candidates=${selectedCandidates.join(',')}`)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  <i className="fa fa-users mr-2"></i>
                  Bulk Hire
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidates List */}
        {filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <i className="fa fa-search text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Candidates Found</h3>
            <p className="text-gray-500">
              Try adjusting your filters to find more candidates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleCandidateSelect(candidate.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      
                      <div className="flex-shrink-0">
                        <img
                          src={candidate.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.candidateName)}&background=random`}
                          alt={candidate.candidateName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-semibold textBlue">{candidate.candidateName}</h3>
                            <span className={`px-3 py-1 text-sm font-bold rounded-full ${getMatchScoreColor(candidate.matchScore)}`}>
                              {candidate.matchScore}% Match
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getRatingStars(candidate.rating)}
                            <button
                              onClick={() => handleBookmarkToggle(candidate.id)}
                              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                                candidate.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                              }`}
                            >
                              <i className={`fa ${candidate.isBookmarked ? 'fa-bookmark' : 'fa-bookmark-o'}`}></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <i className="fa fa-envelope mr-1"></i>
                            {candidate.email}
                          </div>
                          <div>
                            <i className="fa fa-phone mr-1"></i>
                            {candidate.phone}
                          </div>
                          <div>
                            <i className="fa fa-map-marker mr-1"></i>
                            {candidate.currentLocation}
                          </div>
                          <div>
                            <i className="fa fa-money mr-1"></i>
                            {candidate.currency} {candidate.expectedSalary}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <i className="fa fa-briefcase mr-1"></i>
                            {candidate.experience} experience
                          </div>
                          <div>
                            <i className="fa fa-graduation-cap mr-1"></i>
                            {candidate.education}
                          </div>
                          <div>
                            <i className="fa fa-calendar mr-1"></i>
                            Available: {candidate.availability}
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 6).map((skill, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 6 && (
                              <span className="text-gray-500 text-xs">+{candidate.skills.length - 6} more</span>
                            )}
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="bg-green-50 p-3 rounded-lg mb-3">
                          <h4 className="text-sm font-medium text-green-800 mb-2">
                            <i className="fa fa-lightbulb mr-1"></i>
                            Why this candidate matches:
                          </h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            {candidate.matchReasons.slice(0, 2).map((reason, index) => (
                              <li key={index}>• {reason}</li>
                            ))}
                            {candidate.matchReasons.length > 2 && (
                              <li className="text-green-600">• +{candidate.matchReasons.length - 2} more reasons</li>
                            )}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getWorkAuthBadge(candidate.workAuthStatus)}
                            {getResponseStatusBadge(candidate.responseStatus)}
                            <span className="text-xs text-gray-500">
                              Last active: {new Date(candidate.lastActive).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {candidate.portfolioUrl && (
                              <a
                                href={candidate.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <i className="fa fa-globe mr-1"></i>
                                Portfolio
                              </a>
                            )}
                            {candidate.linkedinUrl && (
                              <a
                                href={candidate.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <i className="fa fa-linkedin mr-1"></i>
                                LinkedIn
                              </a>
                            )}
                            {candidate.githubUrl && (
                              <a
                                href={candidate.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-800 text-sm"
                              >
                                <i className="fa fa-github mr-1"></i>
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact {selectedCandidates.length} Candidates
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Template
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your message to candidates..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContactCandidates}
                  disabled={isContacting}
                  className="bg-[#17487f] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {isContacting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-send mr-2"></i>
                      Send Messages
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
