"use client";
import React from "react";

export default function PricingPage() {
  const jobApplicationPlan = {
    name: "Standard Job Application Package",
    price: "₹99",
    period: "/package",
    applications: "10",
    validity: "No expiration - use anytime!",
    features: [
      "Full access to all job listings and categories",
      "Track applications through personal dashboard",
      "Prioritized support for application issues",
      "100% Refund Guarantee - If rejected by employer, payment refunded"
    ],
    buttonText: "Purchase Package",
    buttonClass: "downloadButton"
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="heading textBlue mb-6">Unlock Your Career with Just ₹99</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We&apos;re committed to helping you find your dream job by giving you access to the best opportunities. 
          To streamline your application process, we offer an affordable, transparent pricing model.
        </p>
      </div>

      {/* Single Plan Card */}
      <div className="flex justify-center mb-16">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-blue-600 shadow-lg rounded-lg overflow-hidden">
            <div className="bgBlue text-white text-center py-4">
              <h3 className="text-xl font-bold">Most Popular</h3>
            </div>
            
            <div className="p-8 text-center">
              <h4 className="textBlue mb-4 text-2xl font-bold">{jobApplicationPlan.name}</h4>
              
              <div className="mb-6">
                <span className="heading textBlue text-5xl font-bold">{jobApplicationPlan.price}</span>
                <span className="text-gray-500 text-lg block mt-2">{jobApplicationPlan.period}</span>
              </div>
              
              <div className="mb-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold textBlue">{jobApplicationPlan.applications}</div>
                  <div className="text-sm text-gray-600">Job Applications</div>
                </div>
                <div className="text-sm textBlue font-semibold">{jobApplicationPlan.validity}</div>
              </div>
              
              <ul className="space-y-3 mb-8 text-left">
                {jobApplicationPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <i className="fa fa-check textBlue mr-3 text-sm mt-1 flex-shrink-0"></i>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="downloadButton w-full py-4 text-lg font-semibold">
                {jobApplicationPlan.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Pay Section */}
      <div className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="subHeading textBlue text-center mb-8">Why Pay for Job Applications?</h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              The ₹99 package ensures that only serious applicants apply, enhancing the quality of candidates 
              and employer responses. This small fee helps us maintain a high-quality platform with verified 
              job listings and genuine employers.
            </p>
          </div>
        </div>
      </div>

      {/* Refund Guarantee Section */}
      <div className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="subHeading textBlue text-center mb-8">100% Refund Guarantee – Apply Risk-Free</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <p className="text-lg text-gray-700 text-center mb-6">
              We understand that job hunting can be challenging. That&apos;s why we offer a full refund 
              for applications if you are rejected by the employer. Your payment will be credited 
              back to your account without any hassle.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-4 mb-3">
                  <i className="fa fa-refresh textBlue text-2xl"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Automatic Refund</h4>
                <p className="text-sm text-gray-600">Refunds initiated automatically if rejected</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-4 mb-3">
                  <i className="fa fa-calendar textBlue text-2xl"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">15 Business Days</h4>
                <p className="text-sm text-gray-600">Refunds reflect in original payment method</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-4 mb-3">
                  <i className="fa fa-question-circle textBlue text-2xl"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">No Questions Asked</h4>
                <p className="text-sm text-gray-600">Simple and hassle-free process</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="subHeading textBlue text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="textBlue text-2xl font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Browse Jobs</h4>
              <p className="text-sm text-gray-600">Explore thousands of active job listings</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="textBlue text-2xl font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Purchase Package</h4>
              <p className="text-sm text-gray-600">Pay ₹99 to unlock 10 applications</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="textBlue text-2xl font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Apply for Jobs</h4>
              <p className="text-sm text-gray-600">Use your package to apply for up to 10 jobs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="textBlue text-2xl font-bold">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Monitor Progress</h4>
              <p className="text-sm text-gray-600">Track all applications through dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="subHeading textBlue text-center mb-8">Payment Methods</h2>
          <div className="bg-white rounded-lg border shadow-sm p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <i className="fa fa-credit-card text-3xl textBlue mb-2"></i>
                <span className="text-sm font-medium">Credit/Debit Cards</span>
              </div>
              <div className="flex flex-col items-center">
                <i className="fa fa-university text-3xl textBlue mb-2"></i>
                <span className="text-sm font-medium">UPI & Net Banking</span>
              </div>
              <div className="flex flex-col items-center">
                <i className="fa fa-mobile text-3xl textBlue mb-2"></i>
                <span className="text-sm font-medium">Paytm</span>
              </div>
              <div className="flex flex-col items-center">
                <i className="fa fa-google text-3xl textBlue mb-2"></i>
                <span className="text-sm font-medium">Google Pay & PhonePe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="subHeading textBlue text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h5 className="textBlue text-lg font-semibold mb-3">What happens after using 10 applications?</h5>
              <p className="text-gray-700">
                If you&apos;ve used all 10 applications, you can purchase another ₹99 package to apply for more jobs. 
                There is no limit to how many packages you can buy.
              </p>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h5 className="textBlue text-lg font-semibold mb-3">How does the 100% refund guarantee work?</h5>
              <p className="text-gray-700">
                If your application is rejected by an employer, the refund will be initiated automatically. 
                Refunds will reflect in your original payment method within 15 business days. No questions asked!
              </p>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h5 className="textBlue text-lg font-semibold mb-3">What payment methods do you accept?</h5>
              <p className="text-gray-700">
                We accept Credit/Debit Cards, UPI & Net Banking, and Mobile Wallets 
                (Paytm, Google Pay, PhonePe, etc.).
              </p>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h5 className="textBlue text-lg font-semibold mb-3">Why do you charge for job applications?</h5>
              <p className="text-gray-700">
                The ₹99 package ensures that only serious applicants apply, enhancing the quality of 
                candidates and employer responses. This helps us maintain a high-quality platform with 
                verified job listings and genuine employers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="textBlue text-2xl font-bold mb-4">Get Started Today!</h3>
          <p className="text-gray-700 mb-6">
            Don&apos;t wait—purchase your Job Application Package now for ₹99 and unlock 10 job applications. 
            With our refund policy, there&apos;s zero risk in applying. Take the first step toward building your career today!
          </p>
          <button className="downloadButton px-8 py-4 text-lg font-semibold">
            Purchase Package for ₹99
          </button>
        </div>
      </div>
    </div>
  );
}
