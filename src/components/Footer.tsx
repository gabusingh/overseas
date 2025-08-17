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
    <footer className="bg-white border-t border-gray-200 text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="flex flex-col gap-3">
            <Image
              src="/images/overseas.ainewlogo.png"
              width={100}
              height={100}
              className="w-auto mb-1"
              alt="Overseas.ai Logo"
              unoptimized
            />
            <p className="text-gray-500 text-xs leading-relaxed pr-2">
              Find your next international job opportunity with <span className="font-semibold text-indigo-700">Overseas.ai</span>.<br/>
              Connect with employers worldwide and start your global career today.
            </p>
            <div className="flex gap-2 mt-1">
              {socialLinks?.map((social, i) => {
                const iconClass = social.icon.includes('whatsapp') || social.icon.includes('facebook') || social.icon.includes('linkedin') || social.icon.includes('instagram') || social.icon.includes('youtube')
                  ? `fab fa-${social.icon.split('fa-')[1]}`
                  : `fas fa-${social.icon.split('fa-')[1]}`;
                return (
                  <a
                    key={i}
                    href={social?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-100 hover:bg-indigo-50 border border-gray-200 p-1.5 text-indigo-600 hover:text-indigo-900 transition-colors"
                    aria-label={social?.icon.replace('fa fa-', '')}
                  >
                    <i className={`${iconClass} text-base`}></i>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-xs uppercase tracking-wider">Job Seekers</h3>
            <ul className="space-y-1">
              <li><Link href="/" className="hover:text-indigo-700">Home</Link></li>
              <li><Link href="/jobs" className="hover:text-indigo-700">Browse Jobs</Link></li>
              <li><Link href="/candidate-register" className="hover:text-indigo-700">Register</Link></li>
              <li><Link href="/applied-jobs" className="hover:text-indigo-700">Applied Jobs</Link></li>
              <li><Link href="/resume-building" className="hover:text-indigo-700">Resume Services</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-xs uppercase tracking-wider">Employers</h3>
            <ul className="space-y-1">
              <li><Link href="/create-jobs" className="hover:text-indigo-700">Post a Job</Link></li>
              <li><Link href="/hra-dashboard" className="hover:text-indigo-700">Employer Dashboard</Link></li>
              <li><Link href="/companies" className="hover:text-indigo-700">Browse Companies</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-700">Pricing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-xs uppercase tracking-wider">Contact</h3>
            <ul className="space-y-1 mb-3">
              <li>
                <a href="tel:18008904788" className="flex items-center hover:text-indigo-700">
                  <i className="fas fa-phone mr-2"></i> 1800 890 4788
                </a>
              </li>
              <li>
                <a href="mailto:contact@overseas.ai" className="flex items-center hover:text-indigo-700">
                  <i className="fas fa-envelope mr-2"></i> contact@overseas.ai
                </a>
              </li>
            </ul>
            <a
              href="https://play.google.com/store/apps/details?id=ai.overseas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-indigo-700 transition-colors shadow"
            >
              <i className="fas fa-mobile"></i> Download App
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © 2024 Overseas.ai. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-indigo-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-condition" className="text-gray-500 hover:text-indigo-700 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
