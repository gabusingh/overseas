/**
 * Image optimization utilities for better performance and SEO
 */

/**
 * Generate optimized image URL with Next.js Image component parameters
 */
export function getOptimizedImageUrl(
  src: string, 
  width?: number, 
  height?: number, 
  quality: number = 75
): string {
  if (!src) return '/images/placeholder.jpg';
  
  // If it's already an external URL, return as is
  if (src.startsWith('http')) {
    return src;
  }
  
  // For internal images, add optimization parameters
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  
  return params.toString() ? `${src}?${params.toString()}` : src;
}

/**
 * Generate responsive image srcSet for different screen sizes
 */
export function generateResponsiveImageSrcSet(src: string, sizes: number[]): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(src, size)} ${size}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function getImageSizes(breakpoints: { [key: string]: string }): string {
  return Object.entries(breakpoints)
    .map(([media, size]) => `${media} ${size}`)
    .join(', ');
}

/**
 * Get placeholder image based on content type
 */
export function getPlaceholderImage(type: 'job' | 'company' | 'institute' | 'user'): string {
  const placeholders = {
    job: '/images/job-placeholder.jpg',
    company: '/images/company-placeholder.jpg', 
    institute: '/images/institute-placeholder.jpg',
    user: '/images/user-placeholder.jpg'
  };
  
  return placeholders[type] || '/images/placeholder.jpg';
}

/**
 * Generate blur data URL for image placeholder
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) {
    // Server-side fallback
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
  }
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
}

/**
 * Lazy loading configuration for images
 */
export const lazyLoadingConfig = {
  loading: 'lazy' as const,
  placeholder: 'blur' as const,
  quality: 75,
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
};

/**
 * Critical images configuration (above the fold)
 */
export const criticalImageConfig = {
  loading: 'eager' as const,
  priority: true,
  quality: 85,
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
};

/**
 * Common image breakpoints for responsive images
 */
export const imageBreakpoints = {
  mobile: [320, 480, 640],
  tablet: [768, 1024],
  desktop: [1200, 1600, 1920]
};

export default {
  getOptimizedImageUrl,
  generateResponsiveImageSrcSet,
  getImageSizes,
  getPlaceholderImage,
  generateBlurDataURL,
  lazyLoadingConfig,
  criticalImageConfig,
  imageBreakpoints
};
