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
  
  // Use provided data or fallback data
  const popularSearches = useMemo(() => {
    // If data is provided and not empty, use it
    if (data && data.length > 0) {
      return data.slice(0, maxItems);
    }

    // Fallback data when no data is provided
    const fallbackData: PopularSearchItem[] = [
      { label: "Helper", value: 1, img: "/images/institute.png" },
      { label: "Plumber", value: 2, img: "/images/institute.png" },
      { label: "Electrician", value: 3, img: "/images/institute.png" },
      { label: "Painter", value: 4, img: "/images/institute.png" },
      { label: "Steel Fixer", value: 5, img: "/images/institute.png" },
      { label: "Mason", value: 6, img: "/images/institute.png" },
      { label: "Carpenter", value: 7, img: "/images/institute.png" }
    ];

    return fallbackData.slice(0, maxItems);
  }, [data, maxItems]);

  // Memoize click handler
  const handleClick = useCallback((item: PopularSearchItem) => {
    if (onSearchClick) {
      onSearchClick(item);
    }
  }, [onSearchClick]);



  // Memoize variant-specific styling
  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'hero':
        return {
          container: "mt-8 text-center",
          title: "text-blue-100 mb-4",
          button: "px-4 py-2 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors backdrop-blur-sm font-medium"
        };
      case 'compact':
        return {
          container: "mt-4",
          title: "text-sm font-medium text-gray-600 mb-2",
          button: "px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
        };
      default:
        return {
          container: "mt-8",
          title: "text-lg font-semibold text-gray-800 mb-2",
          button: "px-3 py-2 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full text-sm hover:bg-white hover:shadow-md transition-all border border-gray-200 hover:border-blue-300 hover:text-blue-700 font-medium"
        };
    }
  }, [variant]);

  // Memoize title text
  const titleText = useMemo(() => {
    switch (variant) {
      case 'hero':
        return "Popular searches:";
      case 'compact':
        return "Popular:";
      default:
        return "Popular searches";
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

  return (
    <div className={`${variantStyles.container} ${className}`}>
      <div className="text-center mb-4">
        <h3 className={variantStyles.title}>{titleText}</h3>
        {subtitleText && (
          <p className="text-gray-600 text-sm">{subtitleText}</p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
        {popularSearches.map((item, index) => (
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
