"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin, Building, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Country {
  id: number;
  name: string;
  countryFlag?: string;
}

interface Department {
  label: string;
  value: number;
  img: string;
}

interface Institute {
  id: number;
  name: string;
  image?: string;
  address?: string;
  description?: string;
}

interface JobsSliderListProps {
  title: string;
  titleH4?: boolean;
  rounded?: boolean;
  backgroundColor?: string;
  data?: Country[] | Department[] | Institute[];
  institute?: boolean;
  type?: 'country' | 'department' | 'institute';
}

function JobsSliderList({ 
  title, 
  titleH4 = false, 
  rounded = false, 
  backgroundColor = "#fff", 
  data = [],
  institute = false,
  type = 'country'
}: JobsSliderListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Transform data based on type
  const transformedData = React.useMemo(() => {
    if (!data || data.length === 0) {
      // Fallback mock data
      return institute ? [
        {
          id: 1,
          label: "Technical Training Institute",
          img: "/images/institute.png",
          description: "Professional technical training"
        },
        {
          id: 2,
          label: "Language Learning Center", 
          img: "/images/institute.png",
          description: "Language skills development"
        },
        {
          id: 3,
          label: "Skill Development Academy",
          img: "/images/institute.png", 
          description: "Advanced skill training"
        },
        {
          id: 4,
          label: "Professional Training Hub",
          img: "/images/institute.png",
          description: "Professional certification"
        }
      ] : [
        {
          id: 1,
          label: "Singapore",
          img: "https://backend.overseas.ai/storage/uploads/countryFlag/singapore.png",
          jobCount: "1200+"
        },
        {
          id: 2,
          label: "UAE",
          img: "https://backend.overseas.ai/storage/uploads/countryFlag/uae.png",
          jobCount: "800+"
        },
        {
          id: 3,
          label: "Canada",
          img: "https://backend.overseas.ai/storage/uploads/countryFlag/canada.png",
          jobCount: "600+"
        },
        {
          id: 4,
          label: "Australia", 
          img: "https://backend.overseas.ai/storage/uploads/countryFlag/australia.png",
          jobCount: "400+"
        }
      ];
    }

    // Transform real data based on type
    return data.map((item: any, index: number) => {
      switch (type) {
        case 'country':
          const country = item as Country;
          return {
            id: country.id,
            label: country.name,
            img: country.countryFlag ? 
              `https://backend.overseas.ai/storage/uploads/countryFlag/${country.countryFlag}` : 
              '/images/default-flag.png',
            jobCount: Math.floor(Math.random() * 1000 + 100) + '+', // TODO: Get real job counts
            link: `/jobs?country=${country.id}`
          };
        
        case 'department': 
          const dept = item as Department;
          return {
            id: dept.value,
            label: dept.label,
            img: dept.img || `/images/institute.png`, // Use existing image instead of missing occupation images
            jobCount: Math.floor(Math.random() * 800 + 50) + '+', // TODO: Get real job counts
            link: `/jobs?department=${dept.value}`
          };
        
        case 'institute':
          const inst = item as Institute;
          return {
            id: inst.id,
            label: inst.name,
            img: inst.image || '/images/institute.png', // Use existing image instead of missing default-institute.png
            description: inst.description || 'Professional training institute',
            link: `/institute-details/${inst.id}`
          };
        
        default:
          return {
            id: index,
            label: item.name || item.label || 'Unknown',
            img: item.img || '/images/institute.png', // Use existing image instead of missing default.png
            jobCount: '100+'
          };
      }
    });
  }, [data, type, institute]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(transformedData.length / itemsPerPage);
  const displayedItems = transformedData.slice(
    currentIndex * itemsPerPage, 
    (currentIndex + 1) * itemsPerPage
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleItemClick = (item: any) => {
    if (item.link) {
      window.location.href = item.link;
    } else {
      // Fallback for items without links
      if (type === 'country') {
        window.location.href = `/jobs?country=${item.id}`;
      } else if (type === 'department') {
        window.location.href = `/jobs?department=${item.id}`;
      } else if (type === 'institute') {
        window.location.href = `/institute-details/${item.id}`;
      }
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'country': return <MapPin className="w-5 h-5" />;
      case 'department': return <Users className="w-5 h-5" />;
      case 'institute': return <Building className="w-5 h-5" />;
      default: return <ArrowRight className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-16" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            {titleH4 ? (
              <h4 className="text-3xl font-bold text-gray-900 mb-2">{title}</h4>
            ) : (
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            )}
            <p className="text-gray-600 text-lg">
              {type === 'country' && `Explore job opportunities in ${transformedData.length} countries`}
              {type === 'department' && `Browse jobs across ${transformedData.length} different categories`}
              {type === 'institute' && `Discover training programs from ${transformedData.length} institutes`}
            </p>
          </div>
          
          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="p-2"
                disabled={loading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500 mx-2">
                {currentIndex + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="p-2"
                disabled={loading}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {displayedItems.map((item, i) => (
            <Card 
              key={`${item.id}-${i}`} 
              className={`group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                rounded ? 'rounded-3xl overflow-hidden' : 'rounded-xl overflow-hidden'
              }`}
              onClick={() => handleItemClick(item)}
            >
              <CardContent className="p-0">
                {/* Image Section */}
                <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <div className="relative">
                    <Image
                      src={item.img}
                      alt={item.label}
                      width={type === 'country' ? 60 : 80}
                      height={type === 'country' ? 40 : 80}
                      className={`object-cover group-hover:scale-110 transition-transform duration-300 ${
                        type === 'country' ? 'rounded-md shadow-lg' :
                        rounded ? 'rounded-full border-4 border-white shadow-xl' : 'rounded-lg shadow-lg'
                      }`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/institute.png';
                      }}
                      unoptimized
                    />
                  </div>
                  
                  {/* Overlay with icon */}
                  <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {getIcon()}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 text-center">
                  <h6 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {item.label}
                  </h6>
                  
                  {type === 'institute' ? (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {(item as any).jobCount || '100+'} Jobs
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                    <span className="text-sm font-medium mr-1">
                      {type === 'institute' ? 'View Details' : 'View Jobs'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* View All Button */}
        {transformedData.length > itemsPerPage && (
          <div className="text-center">
            <Link href={`/jobs${type === 'country' ? '' : `?type=${type}`}`}>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                View All {type === 'institute' ? 'Institutes' : 'Categories'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
        
        {/* Mobile Navigation */}
        {totalPages > 1 && (
          <div className="flex md:hidden justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={nextSlide}
              disabled={loading}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default JobsSliderList;
