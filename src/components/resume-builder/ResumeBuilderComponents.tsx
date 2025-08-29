import React from 'react';

// Types
interface User {
  id: string;
  name: string;
  contact: string;
  email?: string;
  photo?: string;
  profileTitle?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Married' | 'Unmarried';
  languageKnown?: string[];
  highEdu?: string;
  highEduYear?: string;
  techEdu?: string;
  techEduYear?: string;
  state?: string;
  district?: string;
  village?: string;
  panchayat?: string;
  ps?: string;
}

interface Experience {
  id?: string;
  userId: string;
  organisationName: string;
  designation: string;
  jobType?: string;
  type: 'Domestic' | 'International';
  country?: string;
  state?: string;
  joiningDate: string;
  leavingDate?: string;
  isWorking: boolean;
  duration?: string;
  image?: File | string;
}

interface Passport {
  id?: string;
  userId: string;
  passportNo: string;
  passportCategory: 'ECR' | 'ECNR';
  issueDate: string;
  expiryDate: string;
  image?: File | string;
}

interface License {
  id?: string;
  userId: string;
  licenceName: string;
  licenceImage?: File | string;
}

interface ResumePreviewProps {
  userDetails: User | null;
  experiences: Experience[];
  passport: Passport | null;
  licenses: License[];
  imageDimensions: { width: number; height: number };
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  userDetails,
  experiences,
  passport,
  licenses,
  imageDimensions,
}) => {
  return (
    <div
      id="resume-content"
      className="bg-white rounded-lg p-8"
      style={{
        backgroundImage: 'url(/images/templetBackground.jpeg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: imageDimensions.height || 800,
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            {userDetails?.photo ? (
              <img src={userDetails.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <i className="fa fa-user text-4xl text-gray-500"></i>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{userDetails?.name || 'Your Name'}</h1>
            <p className="text-xl text-gray-600">{userDetails?.profileTitle || 'Professional Title'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center">
                <span className="w-1 h-5 bg-blue-600 mr-2"></span>
                Address & Contact Details
              </h3>
              <div className="ml-3 space-y-1">
                {userDetails?.village && <p>Village: {userDetails.village}</p>}
                {userDetails?.ps && <p>P.S: {userDetails.ps}</p>}
                {userDetails?.district && <p>District: {userDetails.district}</p>}
                {userDetails?.state && <p>State: {userDetails.state}</p>}
                {userDetails?.contact && <p>Phone: +91 {userDetails.contact}</p>}
                {userDetails?.email && <p>Email: {userDetails.email}</p>}
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center">
                <span className="w-1 h-5 bg-blue-600 mr-2"></span>
                Personal Info
              </h3>
              <div className="ml-3 space-y-1">
                {userDetails?.dob && <p>DOB: {userDetails.dob}</p>}
                {userDetails?.gender && <p>Gender: {userDetails.gender}</p>}
                {userDetails?.maritalStatus && <p>Marital Status: {userDetails.maritalStatus}</p>}
                {userDetails?.languageKnown && Array.isArray(userDetails.languageKnown) && (
                  <p>Languages: {userDetails.languageKnown.join(', ')}</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center">
                <span className="w-1 h-5 bg-blue-600 mr-2"></span>
                Educational Info
              </h3>
              <div className="ml-3 space-y-2">
                {userDetails?.highEdu && (
                  <div>
                    <p>✓ {userDetails.highEdu}</p>
                    {userDetails.highEduYear && <p className="text-sm text-gray-600 ml-4">{userDetails.highEduYear}</p>}
                  </div>
                )}
                {userDetails?.techEdu && (
                  <div>
                    <p>✓ {userDetails.techEdu}</p>
                    {userDetails.techEduYear && <p className="text-sm text-gray-600 ml-4">{userDetails.techEduYear}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Passport */}
            {passport && (
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center">
                  <span className="w-1 h-5 bg-blue-600 mr-2"></span>
                  Passport Details
                </h3>
                <div className="ml-3 space-y-1">
                  <p>Number: {passport.passportNo}</p>
                  <p>Category: {passport.passportCategory}</p>
                  <p>Issue Date: {passport.issueDate}</p>
                  <p>Expiry Date: {passport.expiryDate}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Work Experience */}
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center">
                <span className="w-1 h-5 bg-blue-600 mr-2"></span>
                Work Experience
              </h3>
              <div className="ml-3 space-y-3">
                {experiences.map((exp, index) => (
                  <div key={index} className="pb-2 border-b last:border-0">
                    <h4 className="font-semibold">{exp.organisationName}</h4>
                    <p className="text-sm text-gray-600">
                      {exp.joiningDate} - {exp.isWorking ? 'Present' : exp.leavingDate}
                    </p>
                    <p>{exp.designation}</p>
                    <p className="text-sm text-gray-600">
                      {exp.type === 'International' ? exp.country : exp.state}
                    </p>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <p className="text-gray-400">No experience added yet</p>
                )}
              </div>
            </div>

            {/* Licenses */}
            {licenses.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center">
                  <span className="w-1 h-5 bg-blue-600 mr-2"></span>
                  Licenses
                </h3>
                <div className="ml-3 space-y-2">
                  {licenses.map((license, index) => (
                    <div key={index}>
                      <p className="font-semibold">{license.licenceName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BuilderSidebarProps {
  onSectionClick: (section: string) => void;
  showMoreOptions: boolean;
  setShowMoreOptions: (show: boolean) => void;
  onDownloadPDF: () => void;
  onBackToTemplates: () => void;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  onSectionClick,
  showMoreOptions,
  setShowMoreOptions,
  onDownloadPDF,
  onBackToTemplates,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-4 space-y-3">
      <button
        onClick={onBackToTemplates}
        className="w-full text-left p-3 rounded hover:bg-gray-50 transition text-gray-600 mb-4"
      >
        <i className="fa fa-arrow-left mr-2"></i> Back to Templates
      </button>
      
      <button
        onClick={() => onSectionClick('personal')}
        className="w-full text-left p-3 rounded hover:bg-gray-50 transition"
      >
        <i className="fa fa-user mr-2"></i> Personal Details
      </button>
      <button
        onClick={() => onSectionClick('work')}
        className="w-full text-left p-3 rounded hover:bg-gray-50 transition"
      >
        <i className="fa fa-suitcase mr-2"></i> Work Experience
      </button>
      <button
        onClick={() => onSectionClick('education')}
        className="w-full text-left p-3 rounded hover:bg-gray-50 transition"
      >
        <i className="fa fa-graduation-cap mr-2"></i> Education
      </button>
      <button
        onClick={() => onSectionClick('address')}
        className="w-full text-left p-3 rounded hover:bg-gray-50 transition"
      >
        <i className="fa fa-address-card mr-2"></i> Address
      </button>
      
      {/* More Options */}
      <div>
        <button
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="w-full text-left p-3 rounded hover:bg-gray-50 transition flex justify-between items-center"
        >
          <span><i className="fa fa-file mr-2"></i> Add More Section</span>
          <i className={`fa fa-caret-${showMoreOptions ? 'up' : 'down'}`}></i>
        </button>
        {showMoreOptions && (
          <div className="ml-8 space-y-2 mt-2">
            <button
              onClick={() => onSectionClick('passport')}
              className="block text-gray-600 hover:text-blue-600"
            >
              Passport
            </button>
            <button
              onClick={() => onSectionClick('license')}
              className="block text-gray-600 hover:text-blue-600"
            >
              License
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onDownloadPDF}
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
      >
        <i className="fa fa-download mr-2"></i> Download PDF
      </button>
    </div>
  );
};
