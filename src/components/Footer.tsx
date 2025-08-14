"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCountriesForJobs, getOccupations } from "../services/info.service";
import { getSkill } from "../services/job.service";

interface Country {
  id: number;
  name: string;
}

interface Department {
  label: string;
  value: number;
  img: string;
}

interface Skill {
  skill: string;
}

function Footer() {
  const router = useRouter();

  const quickLinks = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About Us",
      link: "/about-us",
    },
    {
      name: "Our Partners",
      link: "/",
    },
    {
      name: "Contact Us",
      link: "/contact-us",
    },
    {
      name: "Labour Law",
      link: "/",
    },
    {
      name: "Privacy Policy",
      link: "/privacy-policy",
    },
    {
      name: "Terms & Conditions",
      link: "/terms-condition",
    },
    {
      name: "Pricing",
      link: "/pricing"
    }
  ];

  const socialLinks = [
    {
      link: "https://www.linkedin.com/company/findoverseasjobs?originalSubdomain=in",
      icon: "fa fa-linkedin",
    },
    {
      link: "https://wa.me/8100929525",
      icon: "fa fa-whatsapp",
    },
    {
      link: "https://www.facebook.com/overseasdreamjobs",
      icon: "fa fa-facebook",
    },
    {
      link: "https://www.youtube.com/channel/UCbmM6NPRf89yYh5AAy0kuVg",
      icon: "fa fa-youtube",
    },
    {
      link: "https://www.instagram.com/overseas.aijobs/?igsh=MTgxdHhkcHdsdWd5YQ%3D%3D",
      icon: "fa fa-instagram",
    },
  ];

  // States
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [skillList, setSkillList] = useState<Skill[]>([]);
  const [showFullDepartmentList, setShowFullDepartmentList] = useState(false);
  const [showFullSkillList, setShowFullSkillList] = useState(false);

  // Fetch Occupations
  const getOccupationsListFunc = async () => {
    try {
      const response = await getOccupations();
      const raw = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      const occupations = raw.map((item: { id: number; title?: string; name?: string }) => ({
        label: item.title || item.name || "",
        value: item.id,
        img: `/images/occupation-${item.id}.png`,
      }));
      setDepartmentList(occupations);
    } catch (error) {
      console.log(error);
      setDepartmentList([]);
    }
  };

  // Fetch Countries
  const getCountriesForJobsFunc = async () => {
    try {
      const response = await getCountriesForJobs();
      const countries = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setCountryList(countries);
    } catch (error) {
      console.log(error);
      setCountryList([]);
    }
  };

  // Fetch Skills
  const getSkillsFunc = async () => {
    try {
      const response = await getSkill();
      const skills = Array.isArray(response?.skills)
        ? response.skills
        : Array.isArray(response)
        ? response
        : [];
      setSkillList(skills);
    } catch (error) {
      console.log(error);
      setSkillList([]);
    }
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    getCountriesForJobsFunc();
    getOccupationsListFunc();
    getSkillsFunc();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Image
              src="/images/brandlogo.gif"
              width={160}
              height={40}
              className="h-10 w-auto mb-4"
              alt="Overseas.ai Logo"
              unoptimized
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Find your next international job opportunity with Overseas.ai. 
              Connect with employers worldwide and start your global career today.
            </p>
            <div className="flex space-x-4">
              {socialLinks?.map((social, i) => (
                <a 
                  key={i} 
                  href={social?.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className={`${social?.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {quickLinks.slice(0, 6).map((link, i) => (
                <Link 
                  key={i}
                  href={link.link}
                  className="block text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & App */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 mb-6">
              <a
                href="tel:18008904788"
                className="flex items-center text-gray-400 hover:text-white text-sm transition-colors"
              >
                <i className="fa fa-phone mr-2"></i>
                1800 890 4788
              </a>
              <a
                href="mailto:contact@overseas.ai"
                className="flex items-center text-gray-400 hover:text-white text-sm transition-colors"
              >
                <i className="fa fa-envelope mr-2"></i>
                contact@overseas.ai
              </a>
            </div>
            
            <a 
              href="https://play.google.com/store/apps/details?id=ai.overseas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <i className="fa fa-mobile mr-2"></i>
              Download App
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="border-gray-800 my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Overseas.ai. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-condition" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
