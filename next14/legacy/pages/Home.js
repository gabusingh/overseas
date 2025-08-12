import React, { useEffect, useState , Suspense } from "react";
import HeroSection from "../components/HeroSection";
import AppPromationSection from "../components/AppPromationSection";
import SuccessfulPlacedCandidateList from "../components/SuccessfulPlacedCandidateList";
import { getOccupations, getCountriesForJobs } from "../services/info.service";
import { getInstituteList } from "../services/institute.service";
import { Helmet } from "react-helmet";
const JobsSliderList = React.lazy(() => import('../components/JobsSliderList'));
const JobOpeningInTopCompany = React.lazy(() => import('../components/JobOpeningInTopCompany'));
const NewsSlider = React.lazy(() => import('../components/NewsSlider'));
function Home() {
  const [departmentList, setDepartmentList] = useState([]);
  const [instituteList, setInstituteList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const getOccupationsListFunc = async () => {
    try {
      let response = await getOccupations();
      let occupations = response?.occupation?.map((item) => ({
        label: item.occupation,
        value: item.id,
        img:
          "https://backend.overseas.ai/storage/uploads/occupationImage/" +
          item.id +
          "/" +
          item.occuLgIcon,
      }));
      setDepartmentList(occupations);
    } catch (error) {
      console.log(error);
    }
  };
  const getTrainingInsFunc = async () => {
    try {
      let response = await getInstituteList();
      let institute = response?.data?.map((item) => ({
        label: item.instituteName,
        value: item.id,
        img:
          item.profileImageUrl ==
          "https://backend.overseas.ai/placeholder/institute.jpg"
            ? "/images/institute.png"
            : item.profileImageUrl,
      }));
      setInstituteList(institute);
    } catch (error) {
      console.log(error);
    }
  };
  const getCountriesForJobsFunc = async () => {
    try {
      let response = await getCountriesForJobs();
      let countries = response?.countries?.map((item) => ({
        label: item.name,
        value: item.id,
        img: `https://backend.overseas.ai/storage/uploads/countryFlag/${item?.countryFlag}`,
      }));
      setCountryList(countries);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOccupationsListFunc();
    getTrainingInsFunc();
    getCountriesForJobsFunc();
  }, []);
  return (
    <>
      <Helmet>
        <title>Overseas Jobs: Top job Providers for Global Opportunities</title>
        <meta
          name="description"
          content="Explore a world of overseas job opportunities. Start your global career now!"
        />
        <meta name="keywords" content="overseas jobs" />
      </Helmet>
      <HeroSection data={departmentList} />
      <Suspense fallback={<div>Loading...</div>}>
      <JobsSliderList
        title="Job Opening In Top Countries"
        rounded={true}
        backgroundColor="#fff"
        data={countryList}
      />
      <JobsSliderList
        title="Find Jobs By Department"
        rounded={true}
        backgroundColor="#F8F9FA"
        data={departmentList}
      />
      <JobOpeningInTopCompany />
      <JobsSliderList
        title="Meet Our Institutes"
        titleH4={true}
        rounded={false}
        backgroundColor="#F8F9FA"
        data={instituteList}
        institute={true}
      />
      <AppPromationSection />
      <SuccessfulPlacedCandidateList
        title="Find Jobs By Department"
        rounded={true}
        backgroundColor="#F4FAFD"
      />
      <NewsSlider />
      </Suspense>
      
    </>
  );
}

export default Home;
