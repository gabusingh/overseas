import React from 'react'
import {Route, Routes} from "react-router-dom"
import Home from '../pages/Home'
import JobList from '../pages/JobList'
import JobDiscription from '../pages/JobDescription'
import Aboutus from '../pages/Aboutus'
import Contactus from '../pages/Contactus'
import Login from '../pages/Login'
import Companies from '../pages/Companies'
import CampanyDetails from '../pages/CampanyDetails'
import CandidateRegister from '../pages/CandidateRegister'
import CandidateSignUp from '../pages/CandidateSignUp'
import EmployerSignUp from '../pages/EmployerSignUp'
import InstituteSignUp from '../pages/InstituteSignUp'
import PartnerSignUp from '../pages/PartnerSignUp'
import OtpVerification from '../pages/OtpVerification'
import MyProfile from '../pages/MyProfile'
import PageNotFound from '../pages/PageNotFound'
import ResumeBuilding from "../pages/ResumeBuilding"
import Institutes from '../pages/Institutes'
import TradeTestCenters from '../pages/TradeTestCenters'
import TrainingInstitute from '../pages/TrainingInstitute'
import TradeTestingList from '../pages/TradeTestingList'
import CourseDetails from '../pages/CourseDetails'
import TradeTestCourseDetails from '../pages/TradeTestCourseDetails'
import CourseApplied from '../pages/CourseApplied'
import JobApplied from '../pages/JobApplied'
import MyDocuments from '../pages/MyDocuments'
import SavedJobs from '../pages/SavedJobs'
import Notifications from '../pages/Notifications'
import InstituteDetails from '../pages/InstituteDetails'
import TradeTestCenterDetails from '../pages/TradeTestCenterDetails'
import HraDashboard from '../pages/HraPages/HraDashboard'
import AboutResumeBuilding from '../pages/AboutResumeBuilding'
import CreateJobs from '../pages/HraPages/CreateJobs'
import HraViewJobs from '../pages/HraPages/HraViewJobs'
import BulkHire from '../pages/HraPages/BulkHire'
import ViewApplication from '../pages/HraPages/ViewApplication'
import RecommandedCandidates from '../pages/HraPages/RecommandedCandidates'
import EditJob from '../pages/HraPages/EditJob'
import NotificationList from '../pages/HraPages/NotificationList'
import InstituteDashboard from '../pages/InstitutesPages/InstituteDashboard'
import TermAndCondition from '../pages/TermAndCondition'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import PricingPage from '../pages/PricingPage'
import CheckOut from '../pages/CheckOut'
function InstituteRoute() {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about-us" element={<Aboutus/>}/>
        <Route path="/jobs" element={<JobList/>}/>
        <Route path="/jobs/:filter" element={<JobList/>}/>
        <Route path="/contact-us" element={<Contactus/>}/>
        <Route path="/job/:location/:title/:id" element={<JobDiscription/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/recruiting-companies" element={<Companies/>}/>
        <Route path="/training-institutes" element={<Institutes/>}/>
        <Route path="/institute-details/:id" element={<InstituteDetails/>}/>
        <Route path="/trade-test-center" element={<TradeTestCenters/>}/>
        <Route path="/trade-test-center-details/:id" element={<TradeTestCenterDetails/>}/>
        <Route path="/company/:id" element={<CampanyDetails/>}/>
        <Route path="/candidate-register-step2" element={<CandidateRegister/>}/>
        <Route path="/candidate-register" element={<CandidateSignUp/>}/>
        <Route path="/otp-verification" element={<OtpVerification/>}/>
        <Route path="/my-profile" element={<MyProfile/>}/>
        <Route path="/resume-building" element={<ResumeBuilding/>}/>
        <Route path="/skill-training-institute" element={<TrainingInstitute/>}/>
        <Route path="/trade-testing-institute" element={<TradeTestingList/>}/>
        <Route path="/course-details/:id" element={<CourseDetails/>}/>
        <Route path="/test-details/:id" element={<TradeTestCourseDetails/>}/>
        <Route path="/applied-courses" element={<CourseApplied/>}/>
        <Route path="/applied-jobs" element={<JobApplied/>}/>
        <Route path="/my-documents" element={<MyDocuments/>}/>
        <Route path="/saved-jobs" element={<SavedJobs/>}/>
        <Route path="/notifications" element={<Notifications/>}/>
        <Route path="/institute-dashboard" element={<InstituteDashboard/>}/>
        <Route path="/about-resume-building" element={<AboutResumeBuilding/>}/>
        <Route path="/create-jobs" element={<CreateJobs/>}/>
        <Route path="/edit-jobs/:id" element={<EditJob/>}/>
        <Route path="/hra-jobs" element={<HraViewJobs/>}/>
        <Route path="/create-bulk-hire" element={<BulkHire/>}/>
        <Route path="/view-candidate-aplication-list" element={<ViewApplication/>}/>
        <Route path="/recommanded-candidates" element={<RecommandedCandidates/>}/>
        <Route path="/hra-notifications" element={<NotificationList/>}/>
        <Route path="/terms-condition" element={<TermAndCondition/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
        <Route path="/pricing" element={<PricingPage/>}/>
        <Route path="/check-out" element={<CheckOut/>}/>
        <Route path="*" element={<PageNotFound/>}/>
    </Routes>
  )
}

export default InstituteRoute