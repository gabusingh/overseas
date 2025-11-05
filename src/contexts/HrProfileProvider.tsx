"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { HrDetails, getEnhancedHrDetails } from '@/services/hra.service';
import { toast } from 'sonner';

interface HrProfileContextType {
  hrProfile: HrDetails | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<HrDetails>) => void;
  clearProfile: () => void;
  isHrUser: boolean;
  companyName: string;
  companyLogo?: string;
  hrName: string;
  hrEmail: string;
  hrPhone: string;
}

const HrProfileContext = createContext<HrProfileContextType | undefined>(undefined);

export const useHrProfile = () => {
  const context = useContext(HrProfileContext);
  if (!context) {
    throw new Error('useHrProfile must be used within an HrProfileProvider');
  }
  return context;
};

interface HrProfileProviderProps {
  children: ReactNode;
}

export const HrProfileProvider: React.FC<HrProfileProviderProps> = ({ children }) => {
  const [hrProfile, setHrProfile] = useState<HrDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if user is HR
  const checkIsHrUser = useCallback((): boolean => {
    try {
      const loggedUser = localStorage.getItem("loggedUser");
      const userSimple = localStorage.getItem("user");
      
      if (loggedUser) {
        const userData = JSON.parse(loggedUser);
        const userType = userData?.user?.type || userData?.type;
        return userType === 'company';
      }
      
      if (userSimple) {
        const userSimpleData = JSON.parse(userSimple);
        return userSimpleData?.type === 'company';
      }
      
      return false;
    } catch (error) {
      console.error('Error checking HR user status:', error);
      return false;
    }
  }, []);

  // Function to fetch HR profile
  const fetchHrProfile = useCallback(async (): Promise<void> => {
    if (!checkIsHrUser()) {
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = await getEnhancedHrDetails(token);
      
      if (profile) {
        setHrProfile(profile);
      } else {
        setError('Failed to load HR profile');
      }
    } catch (error) {
      console.error('Error fetching HR profile:', error);
      setError('Failed to fetch HR profile');
      // Don't show toast error here to avoid spam
    } finally {
      setLoading(false);
    }
  }, [checkIsHrUser]);

  // Function to refresh profile (public API)
  const refreshProfile = useCallback(async (): Promise<void> => {
    await fetchHrProfile();
  }, [fetchHrProfile]);

  // Function to update profile locally (optimistic updates)
  const updateProfile = useCallback((updates: Partial<HrDetails>): void => {
    setHrProfile(current => {
      if (!current) return null;
      
      return {
        ...current,
        ...updates,
        // Handle nested cmpData updates
        cmpData: updates.cmpData ? {
          ...current.cmpData,
          ...updates.cmpData
        } : current.cmpData,
        // Handle nested user updates
        user: updates.user ? {
          ...current.user,
          ...updates.user
        } : current.user,
        updated_at: new Date().toISOString()
      };
    });
  }, []);

  // Function to clear profile
  const clearProfile = useCallback((): void => {
    setHrProfile(null);
    setError(null);
    setLoading(false);
  }, []);

  // Initialize profile on mount
  useEffect(() => {
    const initializeProfile = async () => {
      if (checkIsHrUser()) {
        await fetchHrProfile();
      }
    };

    initializeProfile();
  }, [fetchHrProfile, checkIsHrUser]);

  // Listen for storage changes (user login/logout)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'loggedUser' || e.key === 'access_token') {
        if (e.newValue === null) {
          // User logged out
          clearProfile();
        } else if (checkIsHrUser()) {
          // User logged in as HR
          fetchHrProfile();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchHrProfile, clearProfile, checkIsHrUser]);

  // Computed values for easy access
  const isHrUser = checkIsHrUser();
  const companyName = hrProfile?.cmpData?.cmpName || 'Your Company';
  const companyLogo = hrProfile?.cmpData?.cmpLogoS3;
  const hrName = hrProfile?.empName || hrProfile?.user?.name || 'HR User';
  const hrEmail = hrProfile?.empEmail || hrProfile?.user?.email || '';
  const hrPhone = hrProfile?.empMobile || hrProfile?.user?.phone || '';

  const contextValue: HrProfileContextType = {
    hrProfile,
    loading,
    error,
    refreshProfile,
    updateProfile,
    clearProfile,
    isHrUser,
    companyName,
    companyLogo,
    hrName,
    hrEmail,
    hrPhone
  };

  return (
    <HrProfileContext.Provider value={contextValue}>
      {children}
    </HrProfileContext.Provider>
  );
};

// HOC for components that require HR authentication
export const withHrAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithHrAuthComponent = (props: P) => {
    const { isHrUser, loading } = useHrProfile();

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading HR profile...</p>
          </div>
        </div>
      );
    }

    if (!isHrUser) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-ban text-red-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              This page is only accessible to HR/Company users. Please log in with the appropriate credentials.
            </p>
            <div className="flex gap-3 justify-center">
              <a 
                href="/login" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </a>
              <a 
                href="/" 
                className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithHrAuthComponent.displayName = `withHrAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithHrAuthComponent;
};
