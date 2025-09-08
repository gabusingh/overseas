/**
 * SEO Utilities for Overseas.ai
 * Comprehensive SEO optimization utilities
 */

import { Metadata } from 'next';

// Base URL for the application
export const BASE_URL = 'https://www.overseas.ai';
export const SITE_NAME = 'Overseas.ai';
export const SITE_DESCRIPTION = 'Find your dream job abroad with Overseas.ai. Discover international job opportunities, training programs, and career support services. Connect with top employers worldwide.';

// Default SEO configuration
export const DEFAULT_SEO = {
  title: 'Overseas.ai - Find International Jobs & Career Opportunities',
  description: SITE_DESCRIPTION,
  keywords: [
    'overseas jobs',
    'international careers',
    'job abroad',
    'global employment',
    'work overseas',
    'international job opportunities',
    'career abroad',
    'overseas recruitment',
    'global jobs',
    'international training'
  ],
  author: 'Overseas.ai Team',
  robots: 'index,follow',
  language: 'en-US'
};

// Page-specific SEO configurations
export const PAGE_SEO_CONFIG = {
  home: {
    title: 'Find Your Dream Job Abroad - Overseas.ai',
    description: 'Discover thousands of international job opportunities across various industries. Get career support, training, and placement services to work abroad.',
    keywords: ['overseas jobs', 'international careers', 'job abroad', 'work overseas', 'global employment']
  },
  jobs: {
    title: 'International Jobs - Browse Global Career Opportunities',
    description: 'Browse thousands of international job opportunities across different countries and industries. Find your perfect career abroad.',
    keywords: ['international jobs', 'global careers', 'overseas employment', 'job search abroad']
  },
  companies: {
    title: 'Top International Companies - Employers Hiring Abroad',
    description: 'Discover leading international companies offering career opportunities abroad. Connect with top employers worldwide.',
    keywords: ['international companies', 'global employers', 'companies hiring abroad', 'overseas employers']
  },
  'training-institutes': {
    title: 'Training Institutes - Skill Development for International Careers',
    description: 'Find the best training institutes to develop skills for international careers. Get certified and increase your chances of working abroad.',
    keywords: ['training institutes', 'skill development', 'international training', 'career certification']
  },
  'about-us': {
    title: 'About Overseas.ai - Your International Career Partner',
    description: 'Learn about Overseas.ai, your trusted partner for international career opportunities, training, and overseas job placement services.',
    keywords: ['about overseas.ai', 'international career services', 'overseas job placement']
  },
  'contact-us': {
    title: 'Contact Overseas.ai - Get International Career Support',
    description: 'Contact Overseas.ai for international career guidance, job placement assistance, and overseas employment support.',
    keywords: ['contact overseas.ai', 'career support', 'job placement assistance']
  }
};

/**
 * Generate SEO-optimized metadata for pages
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  canonical,
  noIndex = false,
  images = [],
  type = 'website'
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
  images?: string[];
  type?: 'website' | 'article' | 'profile';
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${DEFAULT_SEO.title} | ${SITE_NAME}`;
  const finalDescription = description || DEFAULT_SEO.description;
  const allKeywords = [...DEFAULT_SEO.keywords, ...keywords].join(', ');
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  
  // Default OG image
  const defaultImage = `${BASE_URL}/images/og-image.jpg`;
  const ogImages = images.length > 0 ? images.map(img => ({
    url: img.startsWith('http') ? img : `${BASE_URL}${img}`,
    width: 1200,
    height: 630,
    alt: fullTitle
  })) : [{
    url: defaultImage,
    width: 1200,
    height: 630,
    alt: fullTitle
  }];

  return {
    title: fullTitle,
    description: finalDescription,
    keywords: allKeywords,
    authors: [{ name: DEFAULT_SEO.author }],
    creator: DEFAULT_SEO.author,
    publisher: SITE_NAME,
    robots: noIndex ? 'noindex,nofollow' : DEFAULT_SEO.robots,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type,
      title: fullTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: ogImages,
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      creator: '@overseasai',
      images: ogImages[0].url
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION
    }
  };
}

/**
 * Generate job-specific metadata
 */
export function generateJobMetadata({
  jobTitle,
  company,
  location,
  salary,
  jobType,
  description,
  jobId
}: {
  jobTitle: string;
  company?: string;
  location?: string;
  salary?: string;
  jobType?: string;
  description?: string;
  jobId: string;
}) {
  const title = company 
    ? `${jobTitle} at ${company} - ${location || 'International'}`
    : `${jobTitle} - ${location || 'International'} Job`;
  
  const desc = description 
    ? description.substring(0, 160) + '...'
    : `Apply for ${jobTitle} position${company ? ` at ${company}` : ''}${location ? ` in ${location}` : ''}. Competitive salary${salary ? `: ${salary}` : ''}.`;

  const keywords = [
    jobTitle.toLowerCase(),
    company?.toLowerCase() || '',
    location?.toLowerCase() || '',
    jobType?.toLowerCase() || '',
    'international job',
    'overseas career'
  ].filter(Boolean);

  return generateMetadata({
    title,
    description: desc,
    keywords,
    canonical: `/job-description/${jobId}`,
    type: 'article'
  });
}

/**
 * Generate company-specific metadata
 */
export function generateCompanyMetadata({
  companyName,
  description,
  location,
  industryType,
  companyId
}: {
  companyName: string;
  description?: string;
  location?: string;
  industryType?: string;
  companyId: string;
}) {
  const title = `${companyName} Jobs - International Career Opportunities`;
  const desc = description 
    ? `${description.substring(0, 140)}... View all job openings at ${companyName}.`
    : `Explore career opportunities at ${companyName}. Find international jobs and apply for positions in ${industryType || 'various industries'}.`;

  const keywords = [
    companyName.toLowerCase(),
    `${companyName.toLowerCase()} jobs`,
    location?.toLowerCase() || '',
    industryType?.toLowerCase() || '',
    'company careers',
    'international employer'
  ].filter(Boolean);

  return generateMetadata({
    title,
    description: desc,
    keywords,
    canonical: `/company-details/${companyId}`,
    type: 'profile'
  });
}

/**
 * Generate institute-specific metadata
 */
export function generateInstituteMetadata({
  instituteName,
  description,
  courses,
  location,
  instituteId
}: {
  instituteName: string;
  description?: string;
  courses?: string[];
  location?: string;
  instituteId: string;
}) {
  const title = `${instituteName} - Training Institute for International Careers`;
  const courseList = courses?.slice(0, 3).join(', ') || 'various courses';
  const desc = description 
    ? `${description.substring(0, 120)}... Offering ${courseList} and more.`
    : `Learn at ${instituteName}. Professional training in ${courseList} to enhance your international career prospects.`;

  const keywords = [
    instituteName.toLowerCase(),
    `${instituteName.toLowerCase()} training`,
    ...(courses?.map(c => c.toLowerCase()) || []),
    location?.toLowerCase() || '',
    'training institute',
    'international training',
    'skill development'
  ].filter(Boolean);

  return generateMetadata({
    title,
    description: desc,
    keywords,
    canonical: `/institute-details/${instituteId}`,
    type: 'profile'
  });
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbLD(breadcrumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`
    }))
  };
}

/**
 * Generate job posting structured data
 */
export function generateJobPostingLD({
  title,
  description,
  company,
  location,
  salary,
  jobType,
  datePosted,
  validThrough,
  applicationUrl
}: {
  title: string;
  description: string;
  company: string;
  location?: string;
  salary?: { min?: number; max?: number; currency?: string };
  jobType?: string;
  datePosted?: string;
  validThrough?: string;
  applicationUrl?: string;
}) {
  const jobPosting: any = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    hiringOrganization: {
      '@type': 'Organization',
      name: company,
      sameAs: BASE_URL
    },
    datePosted: datePosted || new Date().toISOString().split('T')[0],
    validThrough: validThrough || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    employmentType: jobType || 'FULL_TIME'
  };

  if (location) {
    jobPosting.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: location
      }
    };
  }

  if (salary) {
    jobPosting.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: salary.currency || 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: salary.min,
        maxValue: salary.max,
        unitText: 'MONTH'
      }
    };
  }

  if (applicationUrl) {
    jobPosting.url = applicationUrl;
  }

  return jobPosting;
}

/**
 * Generate organization structured data
 */
export function generateOrganizationLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description: SITE_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi']
    },
    sameAs: [
      'https://www.facebook.com/overseasai',
      'https://www.twitter.com/overseasai',
      'https://www.linkedin.com/company/overseasai',
      'https://www.instagram.com/overseasai'
    ]
  };
}

/**
 * Generate website structured data
 */
export function generateWebsiteLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/jobs?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Utility to clean and truncate text for SEO
 */
export function cleanTextForSEO(text: string, maxLength: number = 160): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, maxLength)
    .replace(/\s+\S*$/, '') // Remove partial word at the end
    .concat(text.length > maxLength ? '...' : '');
}

/**
 * Generate FAQ structured data
 */
export function generateFAQLD(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export default {
  generateMetadata,
  generateJobMetadata,
  generateCompanyMetadata,
  generateInstituteMetadata,
  generateBreadcrumbLD,
  generateJobPostingLD,
  generateOrganizationLD,
  generateWebsiteLD,
  generateFAQLD,
  cleanTextForSEO,
  DEFAULT_SEO,
  PAGE_SEO_CONFIG,
  BASE_URL,
  SITE_NAME
};
