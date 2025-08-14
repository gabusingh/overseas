"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";

interface TradeTestCenter {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  logo: string;
  coverImage: string;
  images: string[];
  established: string;
  accreditation: {
    body: string;
    number: string;
    validUntil: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    emergencyContact: string;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
    };
  };
  rating: number;
  totalReviews: number;
  capacity: {
    totalCandidates: number;
    dailyCapacity: number;
    timeSlots: string[];
  };
  facilities: {
    testingHalls: number;
    equipmentList: string[];
    amenities: string[];
    accessibility: string[];
  };
  trades: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    testDuration: string;
    passingScore: number;
    fee: {
      amount: number;
      currency: string;
    };
    equipment: string[];
    certification: string;
    nextAvailableDate: string;
    availableSlots: number;
  }>;
  staff: Array<{
    id: string;
    name: string;
    position: string;
    qualification: string;
    experience: string;
    image: string;
    specialization: string[];
  }>;
  operatingHours: {
    monday: { open: string; close: string; };
    tuesday: { open: string; close: string; };
    wednesday: { open: string; close: string; };
    thursday: { open: string; close: string; };
    friday: { open: string; close: string; };
    saturday: { open: string; close: string; };
    sunday: { open: string; close: string; };
  };
  requirements: {
    documents: string[];
    preparation: string[];
    guidelines: string[];
  };
  results: {
    processingTime: string;
    deliveryMethods: string[];
    certificateValidity: string;
  };
  reviews: Array<{
    id: string;
    candidateName: string;
    tradeTest: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
    helpfulVotes: number;
  }>;
  statistics: {
    totalTests: number;
    passRate: number;
    avgRating: number;
    establishedYear: number;
  };
  policies: {
    cancellation: string;
    rescheduling: string;
    refund: string;
    retakePolicy: string;
  };
  safetyMeasures: string[];
  certifications: string[];
  partnerships: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

export default function TradeTestCenterDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const centerId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<TradeTestCenter | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'trades' | 'facilities' | 'staff' | 'reviews'>('overview');
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchCenterDetails();
  }, [centerId]);

  const fetchCenterDetails = async () => {
    setLoading(true);
    try {
      // Mock center data - replace with actual API call
      const mockCenter: TradeTestCenter = {
        id: centerId,
        name: "Emirates Trade Testing Center",
        description: `Emirates Trade Testing Center is a leading assessment facility specializing in comprehensive trade skill evaluations for skilled workers seeking employment opportunities in the UAE and other Gulf countries. 

Established in 2008, we have been at the forefront of trade testing excellence, serving thousands of candidates annually across various skilled trades. Our state-of-the-art facility is equipped with modern tools and equipment that mirror real-world working conditions.

We are accredited by the UAE Ministry of Human Resources and Emiratisation and maintain international standards in our testing procedures. Our experienced assessors are certified professionals with extensive industry background.

Our mission is to provide fair, accurate, and comprehensive skill assessments that help both candidates and employers make informed decisions. We offer testing for over 50 different trades across construction, mechanical, electrical, and hospitality sectors.`,
        shortDescription: "Premier trade testing center offering comprehensive skill assessments for skilled workers seeking employment in the UAE and Gulf countries.",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=400&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800&h=400&fit=crop"
        ],
        established: "2008",
        accreditation: {
          body: "UAE Ministry of Human Resources and Emiratisation",
          number: "ACC/2008/TTC/001",
          validUntil: "2025-12-31"
        },
        address: {
          street: "Industrial Area 2, Sheikh Zayed Road",
          city: "Dubai",
          state: "Dubai",
          country: "United Arab Emirates",
          postalCode: "00000",
          coordinates: {
            lat: 25.2048,
            lng: 55.2708
          }
        },
        contact: {
          phone: "+971-4-567-8900",
          email: "info@emiratestradetest.com",
          website: "https://www.emiratestradetest.com",
          emergencyContact: "+971-50-123-4567",
          socialMedia: {
            facebook: "https://facebook.com/emiratestradetest",
            linkedin: "https://linkedin.com/company/emiratestradetest",
            youtube: "https://youtube.com/emiratestradetest"
          }
        },
        rating: 4.7,
        totalReviews: 1247,
        capacity: {
          totalCandidates: 200,
          dailyCapacity: 50,
          timeSlots: ["08:00-10:00", "10:30-12:30", "14:00-16:00", "16:30-18:30"]
        },
        facilities: {
          testingHalls: 8,
          equipmentList: [
            "Modern Welding Equipment", "Electrical Testing Tools", "Plumbing Systems",
            "Construction Tools", "Heavy Machinery Simulators", "Safety Equipment",
            "Computer-Based Testing Stations", "Audio-Visual Equipment"
          ],
          amenities: [
            "Air-Conditioned Waiting Area", "Prayer Room", "Canteen", "Parking Facility",
            "Document Processing Office", "Medical First Aid", "WiFi Access", "ATM"
          ],
          accessibility: [
            "Wheelchair Access", "Disabled Parking", "Sign Language Interpreter",
            "Large Print Materials", "Audio Instructions", "Special Needs Support"
          ]
        },
        trades: [
          {
            id: "1",
            name: "Welding (Arc & Gas)",
            category: "Construction",
            description: "Comprehensive welding test covering arc welding, gas welding, and safety procedures.",
            testDuration: "3 hours",
            passingScore: 75,
            fee: {
              amount: 350,
              currency: "AED"
            },
            equipment: ["Welding Machine", "Gas Torch", "Safety Gear", "Metal Pieces"],
            certification: "UAE Welding Certificate",
            nextAvailableDate: "2024-12-15",
            availableSlots: 12
          },
          {
            id: "2",
            name: "Electrician",
            category: "Electrical",
            description: "Electrical installation, maintenance, and troubleshooting assessment.",
            testDuration: "2.5 hours",
            passingScore: 80,
            fee: {
              amount: 300,
              currency: "AED"
            },
            equipment: ["Multimeter", "Electrical Tools", "Wiring Materials", "Control Panel"],
            certification: "UAE Electrician License",
            nextAvailableDate: "2024-12-16",
            availableSlots: 8
          },
          {
            id: "3",
            name: "Plumbing",
            category: "Construction",
            description: "Pipe installation, repair, and plumbing systems assessment.",
            testDuration: "2 hours",
            passingScore: 75,
            fee: {
              amount: 250,
              currency: "AED"
            },
            equipment: ["Pipe Tools", "Fittings", "Testing Equipment", "Repair Materials"],
            certification: "UAE Plumber Certificate",
            nextAvailableDate: "2024-12-14",
            availableSlots: 15
          },
          {
            id: "4",
            name: "Heavy Equipment Operator",
            category: "Mechanical",
            description: "Operating heavy machinery including excavators, cranes, and bulldozers.",
            testDuration: "4 hours",
            passingScore: 85,
            fee: {
              amount: 500,
              currency: "AED"
            },
            equipment: ["Simulator", "Heavy Machinery", "Safety Equipment", "Control Systems"],
            certification: "UAE Heavy Equipment License",
            nextAvailableDate: "2024-12-18",
            availableSlots: 5
          }
        ],
        staff: [
          {
            id: "1",
            name: "Ahmed Al-Rashid",
            position: "Chief Assessor",
            qualification: "M.Eng Mechanical Engineering",
            experience: "15+ years",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            specialization: ["Welding", "Heavy Equipment", "Safety Assessment"]
          },
          {
            id: "2",
            name: "Sarah Abdullah",
            position: "Senior Electrical Assessor",
            qualification: "B.Eng Electrical Engineering",
            experience: "12+ years",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=150&h=150&fit=crop&crop=face",
            specialization: ["Electrical Systems", "Control Panels", "Safety Standards"]
          },
          {
            id: "3",
            name: "Mohammad Hassan",
            position: "Construction Trade Assessor",
            qualification: "Civil Engineering Diploma",
            experience: "10+ years",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            specialization: ["Plumbing", "Construction", "Quality Control"]
          }
        ],
        operatingHours: {
          monday: { open: "08:00", close: "18:00" },
          tuesday: { open: "08:00", close: "18:00" },
          wednesday: { open: "08:00", close: "18:00" },
          thursday: { open: "08:00", close: "18:00" },
          friday: { open: "08:00", close: "12:00" },
          saturday: { open: "08:00", close: "16:00" },
          sunday: { open: "Closed", close: "Closed" }
        },
        requirements: {
          documents: [
            "Valid Passport with UAE Visa",
            "Original Educational Certificates",
            "Experience Certificates",
            "Passport-size Photos (4)",
            "Emirates ID (if applicable)",
            "Medical Fitness Certificate"
          ],
          preparation: [
            "Review trade-specific skills",
            "Practice safety procedures",
            "Bring appropriate work clothing",
            "Get adequate rest before test",
            "Arrive 30 minutes early",
            "Bring all required documents"
          ],
          guidelines: [
            "No mobile phones during test",
            "Follow safety protocols strictly",
            "Listen to assessor instructions",
            "Complete all test components",
            "Ask for clarification if needed",
            "Respect equipment and facilities"
          ]
        },
        results: {
          processingTime: "3-5 working days",
          deliveryMethods: ["Email", "SMS", "Physical Collection", "Courier Service"],
          certificateValidity: "2 years from issue date"
        },
        reviews: [
          {
            id: "1",
            candidateName: "Rajesh Kumar",
            tradeTest: "Welding",
            rating: 5,
            comment: "Excellent facilities and professional staff. The test was fair and well-organized.",
            date: "2024-11-20",
            verified: true,
            helpfulVotes: 23
          },
          {
            id: "2",
            candidateName: "Abdul Rahman",
            tradeTest: "Electrician",
            rating: 4,
            comment: "Good testing environment. The equipment was modern and the assessors were knowledgeable.",
            date: "2024-11-15",
            verified: true,
            helpfulVotes: 18
          },
          {
            id: "3",
            candidateName: "Maria Santos",
            tradeTest: "Plumbing",
            rating: 5,
            comment: "Very professional setup. Clear instructions and supportive staff throughout the process.",
            date: "2024-11-10",
            verified: true,
            helpfulVotes: 31
          }
        ],
        statistics: {
          totalTests: 15420,
          passRate: 78.5,
          avgRating: 4.6,
          establishedYear: 2008
        },
        policies: {
          cancellation: "Free cancellation up to 48 hours before test date.",
          rescheduling: "One free reschedule allowed up to 24 hours before test.",
          refund: "Full refund for cancellations made 72+ hours in advance.",
          retakePolicy: "Retake available after 30 days with 50% fee discount."
        },
        safetyMeasures: [
          "COVID-19 safety protocols",
          "Personal protective equipment provided",
          "Regular equipment maintenance",
          "Emergency response procedures",
          "First aid facilities on-site",
          "Fire safety systems",
          "CCTV monitoring",
          "Trained safety personnel"
        ],
        certifications: [
          "ISO 9001:2015 Quality Management",
          "UAE Ministry Accreditation",
          "International Safety Standards",
          "Occupational Health Certification"
        ],
        partnerships: [
          "UAE Ministry of Human Resources",
          "Dubai Municipality",
          "Major Construction Companies",
          "International Skills Organizations"
        ],
        faq: [
          {
            question: "What should I bring on test day?",
            answer: "Bring all required documents, wear appropriate work clothing, and arrive 30 minutes early for check-in and briefing."
          },
          {
            question: "How long are the test results valid?",
            answer: "Trade test certificates are valid for 2 years from the date of issue for employment purposes in the UAE."
          },
          {
            question: "Can I retake the test if I fail?",
            answer: "Yes, you can retake the test after 30 days with a 50% discount on the test fee."
          },
          {
            question: "What happens if I'm late for my test?",
            answer: "Late arrivals may not be accommodated on the same day. Please contact us immediately if you're running late."
          }
        ]
      };

      setCenter(mockCenter);
    } catch (error) {
      console.error("Error fetching center details:", error);
      toast.error("Failed to load center details");
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

  const getOperatingHoursForDay = (day: string) => {
    const hours = center?.operatingHours[day.toLowerCase() as keyof typeof center.operatingHours];
    if (!hours || hours.open === "Closed") return "Closed";
    return `${hours.open} - ${hours.close}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading center details...</p>
        </div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Center Not Found</h2>
          <p className="text-gray-600 mb-4">The trade test center you're looking for could not be found.</p>
          <button
            onClick={() => router.push("/trade-test-centers")}
            className="bg-[#17487f] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Centers
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{center.name} - Trade Test Center | Overseas.ai</title>
        <meta name="description" content={center.shortDescription} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-green-600">
            <img
              src={center.coverImage}
              alt={center.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{center.name}</h1>
              <p className="text-lg opacity-90">{center.shortDescription}</p>
            </div>
          </div>

          {/* Center Info */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6">
                <img
                  src={center.logo}
                  alt={center.name}
                  className="w-20 h-20 rounded-lg object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <div className="flex items-center mb-2">
                    {getRatingStars(center.rating, "lg")}
                    <span className="ml-4 text-gray-600">({center.totalReviews} reviews)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <p><i className="fa fa-calendar mr-2"></i>Established {center.established}</p>
                    <p><i className="fa fa-users mr-2"></i>{center.capacity.dailyCapacity} daily capacity</p>
                    <p><i className="fa fa-map-marker mr-2"></i>{center.address.city}, {center.address.country}</p>
                    <p><i className="fa fa-certificate mr-2"></i>Ministry Accredited</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="bg-[#17487f] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fa fa-phone mr-2"></i>
                  Contact
                </button>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i className="fa fa-calendar mr-2"></i>
                  Book Test
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold textBlue">{center.statistics.totalTests.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{center.statistics.passRate}%</div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{center.trades.length}</div>
                <div className="text-sm text-gray-600">Trade Tests</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{center.facilities.testingHalls}</div>
                <div className="text-sm text-gray-600">Testing Halls</div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Address:</span>
                  <p className="text-gray-600">{center.address.street}, {center.address.city}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-600">{center.contact.phone}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Results:</span>
                  <p className="text-gray-600">{center.results.processingTime}</p>
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
                { id: 'trades', label: 'Trade Tests', icon: 'fa-wrench' },
                { id: 'facilities', label: 'Facilities', icon: 'fa-building' },
                { id: 'staff', label: 'Staff', icon: 'fa-users' },
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
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">About the Center</h3>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {center.description}
                  </div>
                </div>

                {/* Accreditation */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Accreditation & Certifications</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                    <div className="flex items-center mb-3">
                      <i className="fa fa-certificate text-green-600 text-2xl mr-4"></i>
                      <div>
                        <h4 className="font-semibold textBlue">{center.accreditation.body}</h4>
                        <p className="text-sm text-gray-600">License: {center.accreditation.number}</p>
                        <p className="text-sm text-gray-600">Valid until: {formatDate(center.accreditation.validUntil)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {center.certifications.map((cert, index) => (
                      <div key={index} className="text-center p-3 border rounded-lg">
                        <i className="fa fa-award text-blue-600 text-xl mb-2"></i>
                        <p className="text-sm font-medium">{cert}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operating Hours */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Operating Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(center.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between py-2 border-b">
                        <span className="font-medium capitalize">{day}:</span>
                        <span className={hours.open === "Closed" ? "text-red-600" : "text-gray-600"}>
                          {hours.open === "Closed" ? "Closed" : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Test Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
                      <ul className="space-y-2">
                        {center.requirements.documents.map((doc, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <i className="fa fa-check text-green-500 mr-2 mt-1"></i>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Preparation Tips</h4>
                      <ul className="space-y-2">
                        {center.requirements.preparation.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <i className="fa fa-lightbulb text-yellow-500 mr-2 mt-1"></i>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Test Guidelines</h4>
                      <ul className="space-y-2">
                        {center.requirements.guidelines.map((guideline, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <i className="fa fa-info text-blue-500 mr-2 mt-1"></i>
                            {guideline}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Safety Measures */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Safety Measures</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {center.safetyMeasures.map((measure, index) => (
                      <div key={index} className="flex items-center">
                        <i className="fa fa-shield text-green-500 mr-3"></i>
                        <span className="text-gray-600 text-sm">{measure}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Policies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Cancellation Policy</h4>
                        <p className="text-sm text-gray-600">{center.policies.cancellation}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Rescheduling Policy</h4>
                        <p className="text-sm text-gray-600">{center.policies.rescheduling}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Refund Policy</h4>
                        <p className="text-sm text-gray-600">{center.policies.refund}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Retake Policy</h4>
                        <p className="text-sm text-gray-600">{center.policies.retakePolicy}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'trades' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold textBlue">Available Trade Tests ({center.trades.length})</h3>
                </div>

                <div className="grid gap-6">
                  {center.trades.map((trade) => (
                    <div key={trade.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold textBlue text-lg mr-3">{trade.name}</h4>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {trade.category}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{trade.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <span className="text-xs text-gray-500">Duration</span>
                              <p className="font-medium">{trade.testDuration}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Passing Score</span>
                              <p className="font-medium">{trade.passingScore}%</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Fee</span>
                              <p className="font-medium text-green-600">{trade.fee.currency} {trade.fee.amount}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Available Slots</span>
                              <p className="font-medium">{trade.availableSlots}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-700">Required Equipment:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {trade.equipment.map((item, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-600">Next Available: </span>
                              <span className="font-medium">{formatDate(trade.nextAvailableDate)}</span>
                            </div>
                            <span className="text-sm text-blue-600 font-medium">{trade.certification}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowBookingModal(true)}
                          className="ml-6 bg-[#17487f] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Book Test
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'facilities' && (
              <div className="space-y-8">
                {/* Testing Facilities */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Testing Facilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Equipment Available</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {center.facilities.equipmentList.map((equipment, index) => (
                          <div key={index} className="flex items-center py-1">
                            <i className="fa fa-wrench text-blue-600 mr-2"></i>
                            <span className="text-gray-600 text-sm">{equipment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Capacity Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Testing Halls:</span>
                          <span className="font-medium">{center.facilities.testingHalls}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Daily Capacity:</span>
                          <span className="font-medium">{center.capacity.dailyCapacity} candidates</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Capacity:</span>
                          <span className="font-medium">{center.capacity.totalCandidates} candidates</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Available Time Slots</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {center.capacity.timeSlots.map((slot, index) => (
                      <div key={index} className="text-center p-3 bg-blue-50 rounded-lg">
                        <i className="fa fa-clock text-blue-600 mb-2"></i>
                        <p className="font-medium">{slot}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {center.facilities.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <i className="fa fa-check-circle text-green-500 mr-3"></i>
                        <span className="text-gray-600">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accessibility */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Accessibility Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {center.facilities.accessibility.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <i className="fa fa-wheelchair text-blue-600 mr-3"></i>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Gallery */}
                <div>
                  <h3 className="text-xl font-semibold textBlue mb-4">Facility Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {center.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${center.name} facility ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'staff' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold textBlue">Assessment Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {center.staff.map((member) => (
                    <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                      />
                      <h4 className="font-semibold textBlue mb-1">{member.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{member.position}</p>
                      <p className="text-xs text-gray-500 mb-3">{member.qualification}</p>
                      <p className="text-sm text-gray-600 mb-3">Experience: {member.experience}</p>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Specialization:</span>
                        <div className="flex flex-wrap gap-1 mt-1 justify-center">
                          {member.specialization.map((spec, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold textBlue">Candidate Reviews</h3>
                  <div className="flex items-center">
                    {getRatingStars(center.rating)}
                    <span className="ml-2 text-gray-600">({center.totalReviews} total reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {center.reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <p className="font-medium textBlue mr-2">{review.candidateName}</p>
                            {review.verified && (
                              <i className="fa fa-check-circle text-green-500 text-sm" title="Verified Candidate"></i>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{review.tradeTest} Test • {formatDate(review.date)}</p>
                        </div>
                        <div className="text-right">
                          {getRatingStars(review.rating, "sm")}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{review.comment}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {review.helpfulVotes} people found this helpful
                        </span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="fa fa-thumbs-up mr-1"></i>
                          Helpful
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact {center.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <i className="fa fa-phone text-blue-600 w-5 mr-3"></i>
                  <a href={`tel:${center.contact.phone}`} className="text-gray-600 hover:text-blue-600">
                    {center.contact.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-envelope text-blue-600 w-5 mr-3"></i>
                  <a href={`mailto:${center.contact.email}`} className="text-gray-600 hover:text-blue-600">
                    {center.contact.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-globe text-blue-600 w-5 mr-3"></i>
                  <a href={center.contact.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                    Visit Website
                  </a>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-phone text-red-600 w-5 mr-3"></i>
                  <a href={`tel:${center.contact.emergencyContact}`} className="text-gray-600 hover:text-red-600">
                    Emergency: {center.contact.emergencyContact}
                  </a>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                {Object.entries(center.contact.socialMedia).map(([platform, url]) => (
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

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Trade Test</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Trade Test</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Choose a trade test...</option>
                    {center.trades.map((trade) => (
                      <option key={trade.id} value={trade.id}>
                        {trade.name} - {trade.fee.currency} {trade.fee.amount}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Choose time slot...</option>
                    {center.capacity.timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    toast.success("Booking request submitted successfully!");
                  }}
                  className="bg-[#17487f] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
