import { MetadataRoute } from 'next';
import { BASE_URL } from '../utils/seo.utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/jobs`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/companies`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/training-institutes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/candidate-register`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/employer-signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/institute-signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-condition`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/bulk-hire`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/resume-building`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/skill-training-institute`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/trade-test-center`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/trade-testing-institute`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    }
  ];

  // TODO: Add dynamic pages when we can fetch data
  // For now, return static pages
  // In a full implementation, you would:
  // 1. Fetch job IDs, company IDs, institute IDs from your API
  // 2. Generate URLs for dynamic pages like /job-description/[id], /company-details/[id], etc.
  // 3. Add them to the sitemap with appropriate priorities and frequencies
  
  /*
  // Example of how to add dynamic pages (uncomment and implement when API is available):
  
  const jobs = await fetchJobIds(); // Implement this function
  const jobPages: MetadataRoute.Sitemap = jobs.map((jobId: string) => ({
    url: `${BASE_URL}/job-description/${jobId}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const companies = await fetchCompanyIds(); // Implement this function
  const companyPages: MetadataRoute.Sitemap = companies.map((companyId: string) => ({
    url: `${BASE_URL}/company-details/${companyId}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const institutes = await fetchInstituteIds(); // Implement this function
  const institutePages: MetadataRoute.Sitemap = institutes.map((instituteId: string) => ({
    url: `${BASE_URL}/institute-details/${instituteId}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...jobPages, ...companyPages, ...institutePages];
  */

  return staticPages;
}
