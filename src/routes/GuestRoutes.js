import React from 'react'
import {Route, Routes, Navigate } from "react-router-dom"
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
import OtpVerification from '../pages/OtpVerification'
import PageNotFound from '../pages/PageNotFound'
import ResumeBuilding from '../pages/ResumeBuilding'
import { useLocation } from 'react-router-dom'
import Institutes from '../pages/Institutes'
import TradeTestCenters from '../pages/TradeTestCenters'
import TrainingInstitute from '../pages/TrainingInstitute'
import TradeTestingList from '../pages/TradeTestingList'
import CourseDetails from '../pages/CourseDetails'
import TradeTestCourseDetails from '../pages/TradeTestCourseDetails'
import InstituteDetails from '../pages/InstituteDetails'
import TradeTestCenterDetails from '../pages/TradeTestCenterDetails'
import AboutResumeBuilding from '../pages/AboutResumeBuilding'
import PricingPage from '../pages/PricingPage'
import TermAndCondition from '../pages/TermAndCondition'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import CheckOut from '../pages/CheckOut'
import TermsPage from '../pages/TermsPage'
import RefundPolicy from '../pages/Refundpolicy'
function GuestRoutes() {
  const location = useLocation()
  
  return (
    <Routes>
        <Route path="/" index   element={<Home/>}/>
        <Route path="/about-us" element={<Aboutus/>}/>
        <Route path="/jobs" element={<JobList/>}/>
        <Route path="/jobs/:filter" element={<JobList/>}/>
        <Route path="/resume-building" element={<ResumeBuilding/>}/>
        <Route path="/contact-us" element={<Contactus/>}/>
        <Route path="/training-institutes" element={<Institutes/>}/>
        <Route path="/institute-details/:id" element={<InstituteDetails/>}/>
        <Route path="/trade-test-center" element={<TradeTestCenters/>}/>
        <Route path="/trade-test-center-details/:id" element={<TradeTestCenterDetails/>}/>
        <Route path="/job/:location/:title/:id" element={<JobDiscription/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/recruiting-companies" element={<Companies/>}/>
        <Route path="/company/:id" element={<CampanyDetails/>}/>
        <Route path="/candidate-register-step2" element={<CandidateRegister/>}/>
        <Route path="/candidate-register" element={<CandidateSignUp/>}/>
        <Route path="/otp-verification" element={<OtpVerification/>}/>
        <Route path="/skill-training-institute" element={<TrainingInstitute/>}/>
        <Route path="/trade-testing-institute" element={<TradeTestingList/>}/>
        <Route path="/course-details/:id" element={<CourseDetails/>}/>
        <Route path="/test-details/:id" element={<TradeTestCourseDetails/>}/>
        <Route path="/about-resume-building" element={<AboutResumeBuilding/>}/>
        <Route path="/pricing" element={<PricingPage/>}/>
        <Route path="/check-out" element={<CheckOut/>}/>
        <Route path="/terms-condition" element={<TermAndCondition/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
        <Route path="/terms" element={<TermsPage/>}/>
        <Route path="/refund-policy" element={<RefundPolicy/>}/>
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default GuestRoutes