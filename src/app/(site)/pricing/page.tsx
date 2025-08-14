"use client";
import React from "react";

export default function PricingPage() {
  const jobSeekerPlans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      features: [
        "Job search and applications",
        "Basic profile creation",
        "Email job alerts",
        "Community support"
      ],
      buttonText: "Get Started",
      buttonClass: "btn-outline-primary"
    },
    {
      name: "Premium",
      price: "₹999",
      period: "/month",
      popular: true,
      features: [
        "All Basic features",
        "Priority job applications",
        "Resume building service",
        "Interview preparation",
        "Direct employer contact",
        "Advanced profile visibility"
      ],
      buttonText: "Choose Premium",
      buttonClass: "downloadButton"
    },
    {
      name: "Pro",
      price: "₹2,499",
      period: "/month",
      features: [
        "All Premium features",
        "Personal career counselor",
        "Skill training access",
        "Guaranteed interviews",
        "Priority support",
        "Visa assistance"
      ],
      buttonText: "Go Pro",
      buttonClass: "btn-outline-primary"
    }
  ];

  const employerPlans = [
    {
      name: "Starter",
      price: "₹4,999",
      period: "/month",
      features: [
        "Up to 5 job postings",
        "Basic candidate search",
        "Standard support",
        "Application management"
      ],
      buttonText: "Start Hiring",
      buttonClass: "btn-outline-primary"
    },
    {
      name: "Professional",
      price: "₹9,999",
      period: "/month",
      popular: true,
      features: [
        "Up to 20 job postings",
        "Advanced candidate search",
        "Interview scheduling tools",
        "Priority support",
        "Analytics dashboard",
        "Bulk messaging"
      ],
      buttonText: "Go Professional",
      buttonClass: "downloadButton"
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      period: "",
      features: [
        "Unlimited job postings",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
        "White-label solutions",
        "24/7 premium support"
      ],
      buttonText: "Contact Sales",
      buttonClass: "btn-outline-primary"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full text-center mb-12">
          <h1 className="heading textBlue mb-6">Pricing Plans</h1>
          <p className="text-lg text-gray-600">Choose the perfect plan for your needs</p>
        </div>
      </div>
      
      {/* Job Seekers Section */}
      <div className="mb-16">
        <div className="w-full">
          <h2 className="subHeading textBlue text-center mb-8">For Job Seekers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobSeekerPlans.map((plan, index) => (
              <div key={index} className="flex flex-col">
                <div className={`bg-white border-0 shadow-sm rounded-lg h-full flex flex-col ${plan.popular ? 'border-2 border-blue-600' : ''}`}>
                  {plan.popular && (
                    <div className="bgBlue text-white text-center py-3 rounded-t-lg">
                      <small className="font-medium">Most Popular</small>
                    </div>
                  )}
                  <div className="p-6 text-center flex-grow flex flex-col">
                    <h4 className="textBlue mb-4 text-xl font-semibold">{plan.name}</h4>
                    <div className="mb-6">
                      <span className="heading textBlue text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 text-lg">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-left flex-grow">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <i className="fa fa-check textBlue mr-3 text-sm"></i>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonClass === 'downloadButton' ? 'downloadButton' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'}`}>
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Employers Section */}
      <div className="mb-16">
        <div className="w-full">
          <h2 className="subHeading textBlue text-center mb-8">For Employers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {employerPlans.map((plan, index) => (
              <div key={index} className="flex flex-col">
                <div className={`bg-white border-0 shadow-sm rounded-lg h-full flex flex-col ${plan.popular ? 'border-2 border-blue-600' : ''}`}>
                  {plan.popular && (
                    <div className="bgBlue text-white text-center py-3 rounded-t-lg">
                      <small className="font-medium">Most Popular</small>
                    </div>
                  )}
                  <div className="p-6 text-center flex-grow flex flex-col">
                    <h4 className="textBlue mb-4 text-xl font-semibold">{plan.name}</h4>
                    <div className="mb-6">
                      <span className="heading textBlue text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 text-lg">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-left flex-grow">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <i className="fa fa-check textBlue mr-3 text-sm"></i>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonClass === 'downloadButton' ? 'downloadButton' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'}`}>
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-16">
        <div className="w-full">
          <h3 className="textBlue text-center mb-8 text-2xl font-semibold">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h5 className="textBlue text-lg font-semibold mb-3">Can I change my plan anytime?</h5>
                <p className="text-gray-500">
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div className="mb-6">
                <h5 className="textBlue text-lg font-semibold mb-3">Is there a free trial?</h5>
                <p className="text-gray-500">
                  We offer a 7-day free trial for all premium plans. 
                  No credit card required to start.
                </p>
              </div>
            </div>
            <div>
              <div className="mb-6">
                <h5 className="textBlue text-lg font-semibold mb-3">What payment methods do you accept?</h5>
                <p className="text-gray-500">
                  We accept all major credit cards, UPI, net banking, 
                  and digital wallets for Indian customers.
                </p>
              </div>
              <div className="mb-6">
                <h5 className="textBlue text-lg font-semibold mb-3">Can I get a refund?</h5>
                <p className="text-gray-500">
                  We offer a 30-day money-back guarantee if you&apos;re not 
                  satisfied with our services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="mt-16">
        <div className="w-full text-center">
          <div className="p-8 rounded-lg bg-blue-50">
            <h4 className="textBlue mb-4 text-2xl font-semibold">Need a Custom Plan?</h4>
            <p className="text-gray-500 mb-6">
              Contact our sales team for enterprise solutions and custom pricing.
            </p>
            <button className="downloadButton">
              Contact Sales Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
