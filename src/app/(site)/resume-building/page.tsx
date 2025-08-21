"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";

interface ResumeTemplate {
  id: string;
  name: string;
  preview: string;
  category: string;
  isPremium: boolean;
}

export default function ResumeBuildingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const resumeTemplates: ResumeTemplate[] = [
    {
      id: "1",
      name: "Professional Classic",
      preview: "https://marketplace.canva.com/EAFHyp8xqFg/1/0/1131w/canva-blue-modern-professional-cv-resume-FAGvpPJgyBA.jpg",
      category: "professional",
      isPremium: false
    },
    {
      id: "2", 
      name: "Modern Creative",
      preview: "https://marketplace.canva.com/EAFPJ-nJl1k/1/0/1131w/canva-white-and-blue-modern-simple-cv-resume-GHRoFP1_4xg.jpg",
      category: "creative",
      isPremium: false
    },
    {
      id: "3",
      name: "Executive Premium",
      preview: "https://marketplace.canva.com/EAE8IiJNTkc/1/0/1131w/canva-white-simple-student-cv-resume-iHCKJGo0rAI.jpg",
      category: "executive",
      isPremium: true
    },
    {
      id: "4",
      name: "Tech Specialist",
      preview: "https://marketplace.canva.com/EAFXKFIap2A/1/0/1131w/canva-black-white-minimalist-cv-resume-f5JNR-K5jns.jpg",
      category: "technical",
      isPremium: false
    },
    {
      id: "5",
      name: "International Format",
      preview: "https://marketplace.canva.com/EAFaQMYuZbo/1/0/1131w/canva-brown-simple-resume-gqQ2UkFzDSg.jpg",
      category: "international",
      isPremium: true
    },
    {
      id: "6",
      name: "Fresh Graduate",
      preview: "https://marketplace.canva.com/EAE6z2vkN1U/1/0/1131w/canva-white-simple-student-cv-resume-iHCKJGo0rAI.jpg",
      category: "student",
      isPremium: false
    }
  ];

  const categories = [
    { key: "all", label: "All Templates" },
    { key: "professional", label: "Professional" },
    { key: "creative", label: "Creative" },
    { key: "technical", label: "Technical" },
    { key: "executive", label: "Executive" },
    { key: "international", label: "International" },
    { key: "student", label: "Student" }
  ];

  const filteredTemplates = activeCategory === "all" 
    ? resumeTemplates 
    : resumeTemplates.filter(template => template.category === activeCategory);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleStartBuilding = () => {
    if (!selectedTemplate) {
      toast.error("Please select a template to continue");
      return;
    }

    const user = localStorage.getItem("loggedUser");
    if (!user) {
      toast.error("Please login to continue with resume building");
      router.push("/login");
      return;
    }

    setLoading(true);
    // Simulate navigation to resume builder
    setTimeout(() => {
      toast.success("Starting resume builder...");
      // In real implementation, this would navigate to the actual resume builder
      router.push(`/resume-builder?template=${selectedTemplate}`);
    }, 1000);
  };

  const handlePreviewTemplate = (templateId: string) => {
    // Open template preview in new window/modal
    toast.info("Template preview feature coming soon!");
  };

  return (
    <>
      <Head>
        <title>Resume Building - Create Professional Resume | Overseas.ai</title>
        <meta name="description" content="Build professional resumes with our online resume builder. Choose from multiple templates optimized for international job markets." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold textBlue mb-4">
            <i className="fa fa-file-text mr-3"></i>
            Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create a professional resume that stands out to international employers. 
            Choose from our collection of ATS-friendly templates designed for overseas job markets.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand-blue/10 rounded-full flex items-center justify-center">
              <i className="fa fa-magic text-2xl textBlue"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">ATS Optimized</h3>
            <p className="text-gray-600 text-sm">All templates are optimized for Applicant Tracking Systems used by international companies.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fa fa-globe text-2xl text-green-600"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">International Format</h3>
            <p className="text-gray-600 text-sm">Formats designed specifically for overseas job applications and immigration requirements.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fa fa-download text-2xl text-purple-600"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Multiple Formats</h3>
            <p className="text-gray-600 text-sm">Download your resume in PDF, Word, or plain text formats as needed.</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold textBlue mb-6">Choose Your Template</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category.key
                    ? "bgBlue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md cursor-pointer ${
                selectedTemplate === template.id
                  ? "border-brand-blue bg-brand-blue/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="relative">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                {template.isPremium && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      <i className="fa fa-crown mr-1"></i>
                      Premium
                    </span>
                  </div>
                )}
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-brand-blue bg-opacity-20 flex items-center justify-center rounded-t-lg">
                    <div className="bg-white rounded-full p-2">
                      <i className="fa fa-check text-brand-blue text-2xl"></i>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 capitalize">{template.category}</span>
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewTemplate(template.id);
                      }}
                      className="text-sm text-brand-blue hover:text-brand-blue/80"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No templates found in this category.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={handleStartBuilding}
            className="bgBlue text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedTemplate || loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Starting Builder...
              </div>
            ) : (
              <>
                <i className="fa fa-rocket mr-2"></i>
                Start Building My Resume
              </>
            )}
          </button>

          <div className="text-sm text-gray-600">
            <i className="fa fa-info-circle mr-1"></i>
            Free templates available. Premium templates unlock advanced features.
          </div>

          <div className="flex justify-center space-x-6 text-sm text-gray-500 mt-6">
            <span><i className="fa fa-check text-green-500 mr-1"></i> ATS Friendly</span>
            <span><i className="fa fa-check text-green-500 mr-1"></i> Multiple Formats</span>
            <span><i className="fa fa-check text-green-500 mr-1"></i> Easy to Edit</span>
            <span><i className="fa fa-check text-green-500 mr-1"></i> Professional Design</span>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold textBlue mb-4">Need Help Building Your Resume?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our resume building guide will help you create a winning resume for international job opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => router.push("/about-resume-building")}
              className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center mr-3">
                  <i className="fa fa-book textBlue"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Resume Writing Guide</h3>
                  <p className="text-sm text-gray-600">Learn best practices</p>
                </div>
              </div>
              <i className="fa fa-arrow-right text-gray-400"></i>
            </button>
            
            <button
              onClick={() => router.push("/contact-us")}
              className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fa fa-headset text-green-600"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Get Expert Help</h3>
                  <p className="text-sm text-gray-600">Professional assistance</p>
                </div>
              </div>
              <i className="fa fa-arrow-right text-gray-400"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
