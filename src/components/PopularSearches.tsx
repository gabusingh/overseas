"use client";
import React, { useMemo, useCallback } from "react";

interface PopularSearchItem {
  label: string;
  value: number;
  img?: string;
}

interface PopularSearchesProps {
  data?: PopularSearchItem[];
  variant?: 'default' | 'hero' | 'compact';
  maxItems?: number;
  onSearchClick?: (item: PopularSearchItem) => void;
  className?: string;
}

const PopularSearches = React.memo(({ 
  data = [], 
  variant = 'default', 
  maxItems = 6,
  onSearchClick,
  className = ""
}: PopularSearchesProps) => {
  
  // Use only provided data - no fallback data
  const popularSearches = useMemo(() => {
    // If data is provided and not empty, use it
    if (data && data.length > 0) {
      return data.slice(0, maxItems);
    }
    
    // Return empty array if no data - don't show anything
    return [];
  }, [data, maxItems]);

  // Memoize click handler
  const handleClick = useCallback((item: PopularSearchItem) => {
    if (onSearchClick) {
      onSearchClick(item);
    }
  }, [onSearchClick]);

  // Memoize variant-specific styling - Updated to match your design pattern
  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'hero':
        return {
          container: "mt-6 text-center",
          title: "text-gray-700 mb-3 text-sm font-medium",
          button: "px-4 py-2 bg-white/90 text-gray-800 rounded-full text-sm hover:bg-white hover:text-blue-600 transition-all duration-200 backdrop-blur-sm font-medium border border-white/50 hover:border-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        };
      case 'compact':
        return {
          container: "mt-4",
          title: "text-sm font-medium text-gray-600 mb-2",
          button: "px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 border border-blue-200 font-medium"
        };
      default:
        return {
          container: "mt-6",
          title: "text-lg font-semibold text-gray-800 mb-3",
          button: "px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full text-sm transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium"
        };
    }
  }, [variant]);

  // Memoize title text - Updated to be more concise
  const titleText = useMemo(() => {
    switch (variant) {
      case 'hero':
        return "Popular searches:";
      case 'compact':
        return "Popular:";
      default:
        return "Popular job searches";
    }
  }, [variant]);

  // Memoize subtitle text
  const subtitleText = useMemo(() => {
    switch (variant) {
      case 'hero':
        return null;
      case 'compact':
        return null;
      default:
        return "Trending job titles and skills";
    }
  }, [variant]);

  // Don't render anything if no popular searches available
  if (!popularSearches || popularSearches.length === 0) {
    return null;
  }

  return (
    <div className={`${variantStyles.container} ${className}`}>
      <div className="text-center mb-4">
        <h3 className={variantStyles.title}>{titleText}</h3>
        {subtitleText && (
          <p className="text-gray-600 text-sm">{subtitleText}</p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
        {popularSearches.slice(0, 6).map((item, index) => (
          <button
            key={`${item.value}-${index}`}
            className={variantStyles.button}
            onClick={() => handleClick(item)}
            title={`Search for ${item.label} jobs`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
});

// Set display name for debugging
PopularSearches.displayName = 'PopularSearches';

export default PopularSearches;
