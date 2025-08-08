# Overseas.ai API Documentation

## Table of Contents
- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [HRA Service](#hra-service)
- [Info Service](#info-service)
- [Institute Service](#institute-service)
- [Job Service](#job-service)
- [Language Training Service](#language-training-service)
- [Resume Service](#resume-service)
- [User Service](#user-service)
- [User Video Service](#user-video-service)
- [Notification Service](#notification-service)
- [Help Service](#help-service)
- [OTP Service](#otp-service)

## Base URLs
- Production: `https://backend.overseas.ai/api/`
- Test: `https://test.overseas.ai/api/`

## Authentication
Most API endpoints require authentication using an access token.

- **Login with OTP**: `POST /person-login-using-otp`
- **Login with Password**: `POST /person-login-using-password`
- **Logout**: `POST /logout`
- **Refresh Token**: `POST /refresh-token`

## HRA Service
API endpoints related to HR agencies and company operations.

### getHraList
- **Endpoint**: `GET /get-all-companies`
- **Parameters**: `access_token`
- **Returns**: List of all companies/HR agencies
  - Schema: Array of company objects with id, name, logo, etc.

### createJobByHr
- **Endpoint**: `POST /create-job`
- **Parameters**: 
  - `access_token`: Authentication token
  - `formData`: Job details including title, description, requirements, etc.
- **Returns**: Job creation response with job ID and status

### editJobByHr
- **Endpoint**: `PUT /edit-job/{jobId}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `formData`: Updated job details
  - `jobId`: ID of the job to edit
- **Returns**: Job update response with status

### getJobByHra
- **Endpoint**: `GET /jobs-posted-by-hra/{cmpID}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `cmpID`: Company ID
- **Returns**: List of jobs posted by the specified HRA
  - Schema: Array of job objects with details

### getHraDashboardAnalytics
- **Endpoint**: `GET /get-hra-dashboard-analytics`
- **Parameters**: `access_token`
- **Returns**: Dashboard analytics data for HRA
  - Schema: Object with counts of applications, interviews, etc.

### bulkHiringRequestList
- **Endpoint**: `GET /bulk-hiring-request-list`
- **Parameters**: `access_token`
- **Returns**: List of bulk hiring requests
  - Schema: Array of bulk hiring request objects

### bulkHiringRequestPost
- **Endpoint**: `POST /bulk-job-request-post`
- **Parameters**: 
  - `access_token`: Authentication token
  - `formData`: Bulk hiring request details
- **Returns**: Bulk hiring request creation response

### getAppliedJobUserList
- **Endpoint**: `POST /applied-candidates-list`
- **Parameters**: `access_token`
- **Returns**: List of candidates who applied for jobs
  - Schema: Array of candidate objects with application details

### getJobWiseRecommendations
- **Endpoint**: `GET /get-job-wise-recommandations/{jobId}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `jobId`: Job ID
- **Returns**: List of recommended candidates for the job
  - Schema: Array of candidate objects

### acceptJobMatchingCandidate
- **Endpoint**: `GET /accept-job-matching-candidate/{jobId}/{candidateId}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `jobId`: Job ID
  - `candidateId`: Candidate ID
- **Returns**: Acceptance status

### rejectJobMatchingCandidate
- **Endpoint**: `GET /reject-job-matching-candidate/{jobId}/{candidateId}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `jobId`: Job ID
  - `candidateId`: Candidate ID
- **Returns**: Rejection status

### companyRegister
- **Endpoint**: `POST /company-register`
- **Parameters**: Company registration details
- **Returns**: Registration response with company ID

### editCompanyProfile
- **Endpoint**: `POST /edit-company-profile`
- **Parameters**: 
  - `access_token`: Authentication token
  - `formData`: Updated company details
- **Returns**: Profile update response

### getCompanyDetails
- **Endpoint**: `GET /get-company-details`
- **Parameters**: `access_token`
- **Returns**: Company details
  - Schema: Company object with all details

### createHR
- **Endpoint**: `POST /create-hr`
- **Parameters**: 
  - `access_token`: Authentication token
  - `formData`: HR details
- **Returns**: HR creation response

### updateHR
- **Endpoint**: `POST /update-hr/{id}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `formData`: Updated HR details
  - `id`: HR ID
- **Returns**: HR update response

### deleteHR
- **Endpoint**: `GET /delete-hr/{id}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `id`: HR ID
- **Returns**: Deletion status

### getHrDetails
- **Endpoint**: `GET /get-hr-details`
- **Parameters**: `access_token`
- **Returns**: HR details
  - Schema: HR object with all details

## Info Service
API endpoints for retrieving various information.

### getCountries
- **Endpoint**: `GET /get-countries`
- **Parameters**: None
- **Returns**: List of all countries
  - Schema: Array of country objects with id, name, etc.

### getCountriesForJobs
- **Endpoint**: `GET /get-countries-for-jobs`
- **Parameters**: None
- **Returns**: List of countries with active jobs
  - Schema: Array of country objects with job counts

### getStates
- **Endpoint**: `GET /get-states`
- **Parameters**: `countryId`
- **Returns**: List of states for the specified country
  - Schema: Array of state objects

### getDistricts
- **Endpoint**: `GET /get-districts`
- **Parameters**: `stateId`
- **Returns**: List of districts for the specified state
  - Schema: Array of district objects

### getPs
- **Endpoint**: `GET /get-ps`
- **Parameters**: `districtId`
- **Returns**: List of police stations for the specified district
  - Schema: Array of PS objects

### getVillage
- **Endpoint**: `GET /get-village`
- **Parameters**: `psId`
- **Returns**: List of villages for the specified police station
  - Schema: Array of village objects

### getPanchayat
- **Endpoint**: `GET /get-panchayat`
- **Parameters**: `psId`
- **Returns**: List of panchayats for the specified police station
  - Schema: Array of panchayat objects

### getNecessaryData
- **Endpoint**: `GET /get-neccesery-data`
- **Parameters**: None
- **Returns**: Various necessary data for the application
  - Schema: Object with multiple data categories

### getActiveCountries
- **Endpoint**: `GET /get-active-countries`
- **Parameters**: None
- **Returns**: List of active countries
  - Schema: Array of country objects

### getCountryCodes
- **Endpoint**: `GET /get-country-codes`
- **Parameters**: None
- **Returns**: List of country codes
  - Schema: Array of country code objects

## Institute Service
API endpoints related to training institutes and courses.

### requestOtpForInstRegister
- **Endpoint**: `POST /request-otp-for-inst-register`
- **Parameters**: Phone number and country code
- **Returns**: OTP request response

### instituteRegister
- **Endpoint**: `POST /institute-register`
- **Parameters**: Institute registration details
- **Returns**: Registration response with institute ID

### listTrainingInstitutes
- **Endpoint**: `GET /list-training-institutes`
- **Parameters**: Optional filters
- **Returns**: List of training institutes
  - Schema: Array of institute objects

### getInstituteDetailsById
- **Endpoint**: `GET /get-institute-details-by-id/{id}`
- **Parameters**: `id`: Institute ID
- **Returns**: Institute details
  - Schema: Institute object with all details

### listAllCourse
- **Endpoint**: `GET /list-all-course`
- **Parameters**: Optional filters
- **Returns**: List of all courses
  - Schema: Array of course objects

### getCourseDetailsById
- **Endpoint**: `GET /get-course-details-by-id/{id}`
- **Parameters**: `id`: Course ID
- **Returns**: Course details
  - Schema: Course object with all details

### getCoursesByInstitute
- **Endpoint**: `GET /get-courses-by-institute`
- **Parameters**: `instituteId`
- **Returns**: List of courses offered by the institute
  - Schema: Array of course objects

### filterCourses
- **Endpoint**: `POST /filter-courses`
- **Parameters**: Filter criteria
- **Returns**: Filtered list of courses
  - Schema: Array of course objects

### applyCourseByUser
- **Endpoint**: `GET /apply-course-by-user/{courseId}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `courseId`: Course ID
- **Returns**: Application status

### listAppliedCourses
- **Endpoint**: `GET /list-applied-courses`
- **Parameters**: `access_token`
- **Returns**: List of courses applied by the user
  - Schema: Array of course application objects

### rateAndReviewInstitute
- **Endpoint**: `POST /rate-and-review-institute`
- **Parameters**: 
  - `access_token`: Authentication token
  - `instituteId`: Institute ID
  - `rating`: Rating value
  - `review`: Review text
- **Returns**: Rating submission status

### getRateReviewInstitute
- **Endpoint**: `GET /get-rate-review-institute`
- **Parameters**: `instituteId`
- **Returns**: Ratings and reviews for the institute
  - Schema: Array of rating objects

### editRateAndReviewInstitute
- **Endpoint**: `POST /edit-rate-and-review-institute`
- **Parameters**: 
  - `access_token`: Authentication token
  - `ratingId`: Rating ID
  - `rating`: Updated rating value
  - `review`: Updated review text
- **Returns**: Rating update status

## Job Service
API endpoints related to job listings and applications.

### searchJobs
- **Endpoint**: `GET /search`
- **Parameters**: Search criteria
- **Returns**: List of matching jobs
  - Schema: Array of job objects

### getJobDetails
- **Endpoint**: `GET /job-r/{id}`
- **Parameters**: `id`: Job ID
- **Returns**: Job details
  - Schema: Job object with all details

### getJobsByCountries
- **Endpoint**: `GET /get-jobs-by-countries/{id}`
- **Parameters**: `id`: Country ID
- **Returns**: List of jobs in the specified country
  - Schema: Array of job objects

### getOccupationByJobs
- **Endpoint**: `GET /get-occupation-by-jobs/{id}`
- **Parameters**: `id`: Occupation ID
- **Returns**: List of jobs for the specified occupation
  - Schema: Array of job objects

### getRelatedJobs
- **Endpoint**: `GET /get-related-jobs`
- **Parameters**: `jobId`
- **Returns**: List of related jobs
  - Schema: Array of job objects

### jobQuery
- **Endpoint**: `POST /job-query`
- **Parameters**: Query details
- **Returns**: Query submission status

### getLatestJobs
- **Endpoint**: `GET /get-latest-jobs`
- **Parameters**: None
- **Returns**: List of latest jobs
  - Schema: Array of job objects

### searchAllJobs
- **Endpoint**: `POST /search-all-jobs`
- **Parameters**: Search criteria
- **Returns**: List of matching jobs
  - Schema: Array of job objects

### filterAllJobs
- **Endpoint**: `POST /filter-all-jobs`
- **Parameters**: Filter criteria
- **Returns**: Filtered list of jobs
  - Schema: Array of job objects

### lastWeekJobs
- **Endpoint**: `GET /last-week-jobs`
- **Parameters**: None
- **Returns**: List of jobs posted in the last week
  - Schema: Array of job objects

### getJobsByCountryByDepartment
- **Endpoint**: `POST /get-jobs-by-country-by-department`
- **Parameters**: 
  - `countryId`: Country ID
  - `departmentId`: Department ID
- **Returns**: List of jobs filtered by country and department
  - Schema: Array of job objects

### saveJobByUser
- **Endpoint**: `POST /save-job-by-user`
- **Parameters**: 
  - `access_token`: Authentication token
  - `jobId`: Job ID
- **Returns**: Job saving status

### userSavedJobsList
- **Endpoint**: `GET /user-saved-jobs-list`
- **Parameters**: `access_token`
- **Returns**: List of jobs saved by the user
  - Schema: Array of saved job objects

### applyForJob
- **Endpoint**: `POST /apply-job`
- **Parameters**: 
  - `access_token`: Authentication token
  - `jobId`: Job ID
- **Returns**: Job application status

### userAppliedJobsList
- **Endpoint**: `GET /user-applied-jobs-list`
- **Parameters**: `access_token`
- **Returns**: List of jobs applied by the user
  - Schema: Array of job application objects

### appliedJobById
- **Endpoint**: `GET /applied-job-by-id/{id}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `id`: Application ID
- **Returns**: Job application details
  - Schema: Job application object

## Language Training Service
API endpoints related to language training.

### getLanguageTrainingData
- **Endpoint**: `GET /get-language-training-data/{skillId}`
- **Parameters**: `skillId`: Skill ID
- **Returns**: Language training data for the skill
  - Schema: Training data object with videos, audios, etc.

### getLanguageTrainingData1
- **Endpoint**: `POST /get-language-training-data1`
- **Parameters**: Training criteria
- **Returns**: Language training data
  - Schema: Training data object

## Resume Service
API endpoints related to resume management.

### storeResumePerson
- **Endpoint**: `POST /store-resume-person`
- **Parameters**: Personal details
- **Returns**: Resume creation status

### updateResumePerson
- **Endpoint**: `POST /update-resume-person`
- **Parameters**: Updated personal details
- **Returns**: Resume update status

### storeResumeUserExperience
- **Endpoint**: `POST /store-resume-user-experience`
- **Parameters**: Experience details
- **Returns**: Experience addition status

### storeResumeUserLicence
- **Endpoint**: `POST /store-resume-user-licence`
- **Parameters**: License details
- **Returns**: License addition status

### storeResumeUserPassport
- **Endpoint**: `POST /store-resume-user-passport`
- **Parameters**: Passport details
- **Returns**: Passport addition status

## User Service
API endpoints related to user management.

### registerPerson
- **Endpoint**: `POST /register-person`
- **Parameters**: Registration details
- **Returns**: Registration status with user ID

### registerPersonWithPassword
- **Endpoint**: `POST /register-person-with-password`
- **Parameters**: Registration details with password
- **Returns**: Registration status with user ID

### profileCompleteStep2
- **Endpoint**: `POST /profile-complete-step2`
- **Parameters**: 
  - `access_token`: Authentication token
  - Profile details for step 2
- **Returns**: Profile update status

### companyProfileCompleteStep2
- **Endpoint**: `POST /company-profile-complete-step2`
- **Parameters**: 
  - `access_token`: Authentication token
  - Company profile details for step 2
- **Returns**: Profile update status

### profileCompleteStep3
- **Endpoint**: `POST /profile-complete-step3`
- **Parameters**: 
  - `access_token`: Authentication token
  - Profile details for step 3
- **Returns**: Profile update status

### updatePastOccupation
- **Endpoint**: `POST /update-past-occupation`
- **Parameters**: 
  - `access_token`: Authentication token
  - Past occupation details
- **Returns**: Update status

### pastExperienceList
- **Endpoint**: `GET /past-experience-list`
- **Parameters**: `access_token`
- **Returns**: List of past experiences
  - Schema: Array of experience objects

### passportUpload
- **Endpoint**: `POST /passport-upload`
- **Parameters**: 
  - `access_token`: Authentication token
  - Passport images
- **Returns**: Upload status

### passportView
- **Endpoint**: `GET /passport-view`
- **Parameters**: `access_token`
- **Returns**: Passport details
  - Schema: Passport object with images

### passportEdit
- **Endpoint**: `POST /passport-edit`
- **Parameters**: 
  - `access_token`: Authentication token
  - Updated passport details
- **Returns**: Edit status

### addExperience
- **Endpoint**: `POST /add-experience`
- **Parameters**: 
  - `access_token`: Authentication token
  - Experience details
- **Returns**: Addition status

### experienceList
- **Endpoint**: `GET /experience-list`
- **Parameters**: `access_token`
- **Returns**: List of experiences
  - Schema: Array of experience objects

### viewExperience
- **Endpoint**: `GET /view-experience/{id}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `id`: Experience ID
- **Returns**: Experience details
  - Schema: Experience object

### editExperience
- **Endpoint**: `POST /edit-experience`
- **Parameters**: 
  - `access_token`: Authentication token
  - Updated experience details
- **Returns**: Edit status

### editProfile
- **Endpoint**: `POST /edit-profile`
- **Parameters**: 
  - `access_token`: Authentication token
  - Updated profile details
- **Returns**: Edit status

### getEmpData
- **Endpoint**: `GET /get-emp-data`
- **Parameters**: `access_token`
- **Returns**: Employee data
  - Schema: Employee object with all details

### getEmpDataForEdit
- **Endpoint**: `GET /get-emp-data-for-edit`
- **Parameters**: `access_token`
- **Returns**: Employee data for editing
  - Schema: Employee object with editable fields

### storeAppUseTime
- **Endpoint**: `POST /store-app-use-time`
- **Parameters**: 
  - `access_token`: Authentication token
  - Usage time details
- **Returns**: Storage status

### storeLocation
- **Endpoint**: `POST /store-location`
- **Parameters**: 
  - `access_token`: Authentication token
  - Location details
- **Returns**: Storage status

### getUserDashboard
- **Endpoint**: `GET /get-user-dashboard`
- **Parameters**: `access_token`
- **Returns**: User dashboard data
  - Schema: Dashboard object with various metrics

## User Video Service
API endpoints related to user videos.

### storeWorkVideos
- **Endpoint**: `POST /store-work-videos`
- **Parameters**: 
  - `access_token`: Authentication token
  - Video file
- **Returns**: Storage status

### listWorkVideos
- **Endpoint**: `GET /list-work-videos`
- **Parameters**: `access_token`
- **Returns**: List of work videos
  - Schema: Array of video objects

### deleteWorkVideo
- **Endpoint**: `GET /delete-work-video/{vidId}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `vidId`: Video ID
- **Returns**: Deletion status

### storeIntroductionVideos
- **Endpoint**: `POST /store-introduction-videos`
- **Parameters**: 
  - `access_token`: Authentication token
  - Video file
  - `videoLanguage`: Language of the video
- **Returns**: Storage status

### listIntroductionVideos
- **Endpoint**: `GET /list-introduction-videos`
- **Parameters**: `access_token`
- **Returns**: List of introduction videos
  - Schema: Array of video objects

### deleteIntroductionVideo
- **Endpoint**: `GET /delete-introduction-video/{vidId}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `vidId`: Video ID
- **Returns**: Deletion status

### getAllUsersWithVideos
- **Endpoint**: `GET /get-all-users-with-videos`
- **Parameters**: Optional filters
- **Returns**: List of users with videos
  - Schema: Array of user objects with video details

## Notification Service
API endpoints related to notifications.

### getNotifications
- **Endpoint**: `GET /get-notifications`
- **Parameters**: `access_token`
- **Returns**: List of notifications
  - Schema: Array of notification objects

### getAllNotification
- **Endpoint**: `GET /get-all-notification`
- **Parameters**: `access_token`
- **Returns**: List of all notifications
  - Schema: Array of notification objects

### updateNotificationStatus
- **Endpoint**: `POST /update-notification-status/{notificationId}`
- **Parameters**: 
  - `access_token`: Authentication token
  - `notificationId`: Notification ID
- **Returns**: Update status

### sendNotification
- **Endpoint**: `POST /send-notification`
- **Parameters**: Notification details
- **Returns**: Sending status

## Help Service
API endpoints related to help and support.

### storeHelpQuery
- **Endpoint**: `POST /store-help-query`
- **Parameters**: 
  - `access_token`: Authentication token
  - Query details
- **Returns**: Storage status

### storeQueryWeb
- **Endpoint**: `POST /store-query-web`
- **Parameters**: Query details
- **Returns**: Storage status

## OTP Service
API endpoints related to OTP management.

### getOtp
- **Endpoint**: `POST /get-otp`
- **Parameters**: Phone number and country code
- **Returns**: OTP sending status

### getOTPOnEmail
- **Endpoint**: `POST /get-otp-on-email`
- **Parameters**: Email address
- **Returns**: OTP sending status

### otpRequest
- **Endpoint**: `POST /otp-request`
- **Parameters**: Phone number and country code
- **Returns**: OTP request status 