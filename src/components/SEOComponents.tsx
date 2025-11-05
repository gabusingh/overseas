/**
 * SEO Components for structured data and meta tags
 */

import React from 'react';
import Script from 'next/script';

interface StructuredDataProps {
  data: object | object[];
}

/**
 * Component to inject JSON-LD structured data
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

interface BreadcrumbProps {
  items: { name: string; url: string }[];
}

/**
 * Breadcrumb navigation component with SEO markup
 */
export function SEOBreadcrumb({ items }: BreadcrumbProps) {
  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {index === items.length - 1 ? (
              <span className="font-medium text-gray-900" aria-current="page">
                {item.name}
              </span>
            ) : (
              <a 
                href={item.url}
                className="hover:text-blue-600 transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface FAQSectionProps {
  faqs: { question: string; answer: string }[];
  structuredData?: boolean;
}

/**
 * FAQ Section with SEO-optimized markup
 */
export function FAQSection({ faqs, structuredData = true }: FAQSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <h3 
              className="text-lg font-semibold text-gray-900 mb-3"
              itemProp="name"
            >
              {faq.question}
            </h3>
            <div 
              className="text-gray-700 prose prose-sm max-w-none"
              itemProp="text"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

interface JobCardSEOProps {
  job: {
    id: string;
    title: string;
    company: string;
    location?: string;
    salary?: string;
    datePosted?: string;
    description?: string;
  };
}

/**
 * Job card with microdata markup
 */
export function JobCardSEO({ job }: JobCardSEOProps) {
  return (
    <div 
      itemScope 
      itemType="https://schema.org/JobPosting"
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <h3 
        itemProp="title"
        className="text-lg font-semibold text-gray-900 mb-2"
      >
        <a href={`/job-description/${job.id}`} className="hover:text-blue-600">
          {job.title}
        </a>
      </h3>
      
      <div 
        itemProp="hiringOrganization" 
        itemScope 
        itemType="https://schema.org/Organization"
        className="text-gray-600 mb-2"
      >
        <span itemProp="name">{job.company}</span>
      </div>
      
      {job.location && (
        <div 
          itemProp="jobLocation"
          itemScope
          itemType="https://schema.org/Place"
          className="text-gray-600 mb-2"
        >
          <span itemProp="address">{job.location}</span>
        </div>
      )}
      
      {job.salary && (
        <div className="text-green-600 font-medium mb-2">
          {job.salary}
        </div>
      )}
      
      {job.datePosted && (
        <time 
          itemProp="datePosted"
          dateTime={job.datePosted}
          className="text-sm text-gray-500"
        >
          Posted: {new Date(job.datePosted).toLocaleDateString()}
        </time>
      )}
      
      {job.description && (
        <meta itemProp="description" content={job.description} />
      )}
    </div>
  );
}

interface CompanyCardSEOProps {
  company: {
    id: string;
    name: string;
    description?: string;
    location?: string;
    website?: string;
    logo?: string;
  };
}

/**
 * Company card with microdata markup
 */
export function CompanyCardSEO({ company }: CompanyCardSEOProps) {
  return (
    <div 
      itemScope 
      itemType="https://schema.org/Organization"
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start">
        {company.logo && (
          <img 
            itemProp="logo"
            src={company.logo}
            alt={`${company.name} logo`}
            className="w-12 h-12 rounded-lg mr-4 object-contain"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a 
              href={`/company-details/${company.id}`}
              itemProp="url"
              className="hover:text-blue-600"
            >
              <span itemProp="name">{company.name}</span>
            </a>
          </h3>
          
          {company.location && (
            <div 
              itemProp="address"
              className="text-gray-600 mb-2"
            >
              {company.location}
            </div>
          )}
          
          {company.description && (
            <p 
              itemProp="description"
              className="text-gray-700 text-sm line-clamp-2"
            >
              {company.description}
            </p>
          )}
          
          {company.website && (
            <meta itemProp="sameAs" content={company.website} />
          )}
        </div>
      </div>
    </div>
  );
}

interface InstituteCardSEOProps {
  institute: {
    id: string;
    name: string;
    description?: string;
    location?: string;
    courses?: string[];
    website?: string;
  };
}

/**
 * Institute card with microdata markup
 */
export function InstituteCardSEO({ institute }: InstituteCardSEOProps) {
  return (
    <div 
      itemScope 
      itemType="https://schema.org/EducationalOrganization"
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        <a 
          href={`/institute-details/${institute.id}`}
          itemProp="url"
          className="hover:text-blue-600"
        >
          <span itemProp="name">{institute.name}</span>
        </a>
      </h3>
      
      {institute.location && (
        <div 
          itemProp="address"
          className="text-gray-600 mb-2"
        >
          {institute.location}
        </div>
      )}
      
      {institute.description && (
        <p 
          itemProp="description"
          className="text-gray-700 text-sm mb-3"
        >
          {institute.description}
        </p>
      )}
      
      {institute.courses && institute.courses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {institute.courses.slice(0, 3).map((course, index) => (
            <span 
              key={index}
              itemProp="hasOfferCatalog"
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
            >
              {course}
            </span>
          ))}
        </div>
      )}
      
      {institute.website && (
        <meta itemProp="sameAs" content={institute.website} />
      )}
    </div>
  );
}

/**
 * Page loading skeleton with proper semantic markup
 */
export function SEOLoadingSkeleton({ type = 'page' }: { type?: 'page' | 'jobs' | 'companies' }) {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading content">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
      
      {type === 'jobs' && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}
      
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default {
  StructuredData,
  SEOBreadcrumb,
  FAQSection,
  JobCardSEO,
  CompanyCardSEO,
  InstituteCardSEO,
  SEOLoadingSkeleton
};
