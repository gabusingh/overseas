import { Metadata } from 'next';
import { generateMetadata, PAGE_SEO_CONFIG } from '../../../utils/seo.utils';

export const metadata: Metadata = generateMetadata({
  title: PAGE_SEO_CONFIG.jobs.title,
  description: PAGE_SEO_CONFIG.jobs.description,
  keywords: PAGE_SEO_CONFIG.jobs.keywords,
  canonical: '/jobs',
  type: 'website'
});

export default metadata;
