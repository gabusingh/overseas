"use client";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full">
          <h1 className="heading textBlue mb-6">Privacy Policy</h1>
          <p className="text-lg text-gray-500 mb-8">Last updated: December 12, 2024</p>
          
          <div className="termsCondition">
            <h3>1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              apply for jobs, or contact us. This may include your name, email address, phone number, 
              resume, and other personal information.
            </p>
            
            <h3>2. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Match you with relevant job opportunities</li>
              <li>Communicate with you about our services</li>
              <li>Improve our platform and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h3>3. Information Sharing</h3>
            <p>
              We may share your information with employers when you apply for jobs, 
              with service providers who assist us, and as required by law. We do not 
              sell your personal information to third parties.
            </p>
            
            <h3>4. Data Security</h3>
            <p>
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h3>5. Your Rights</h3>
            <p>
              You have the right to access, update, or delete your personal information. 
              You can also opt out of certain communications from us.
            </p>
            
            <h3>6. Cookies</h3>
            <p>
              We use cookies and similar technologies to enhance your experience on our platform. 
              You can control cookie settings through your browser.
            </p>
            
            <h3>7. International Transfers</h3>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>
            
            <h3>8. Children&apos;s Privacy</h3>
            <p>
              Our services are not intended for children under 18. We do not knowingly 
              collect personal information from children.
            </p>
            
            <h3>9. Changes to Privacy Policy</h3>
            <p>
              We may update this privacy policy from time to time. We will notify you of 
              any material changes by posting the new policy on our website.
            </p>
            
            <h3>10. Contact Us</h3>
            <p>
              If you have questions about this privacy policy, please contact us at:
            </p>
            <div className="mt-4 p-4 rounded-lg bg-blue-50">
              <p className="mb-2"><strong>Email:</strong> privacy@overseas.ai</p>
              <p className="mb-2"><strong>Phone:</strong> 1800 890 4788</p>
              <p className="mb-0">
                <strong>Address:</strong> CA 191, CA Block, Sector 1, Saltlake, Kolkata, West Bengal 700064
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
