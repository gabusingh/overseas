"use client";
import React from "react";
import { Search, Shield, Globe, Clock, Users, CheckCircle } from "lucide-react";

function CleanFeaturesSection() {
  const features = [
    {
      icon: Search,
      title: "Easy Job Search",
      description: "Find your perfect job with advanced filters and smart search functionality."
    },
    {
      icon: Shield,
      title: "Verified Jobs",
      description: "All jobs are verified by our team to ensure authenticity and quality."
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Access jobs from 50+ countries and expand your career horizons."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get assistance anytime with our dedicated customer support team."
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Receive career advice and guidance from industry experts."
    },
    {
      icon: CheckCircle,
      title: "Success Guaranteed",
      description: "Join thousands of successful job seekers who found their dream jobs."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why choose Overseas.ai?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We make finding international jobs simple, secure, and successful
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CleanFeaturesSection;
