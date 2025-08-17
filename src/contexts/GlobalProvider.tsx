"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getStoredUser, isAuthenticated, getStoredToken } from '../lib/auth';

interface User {
  id: number;
  type: 'person' | 'company' | 'institute';
  email: string;
  phone: string;
  name?: string;
  access_token?: string;
}

interface GlobalState {
  user: User | null;
  profileStrength: number | null;
  notifications: unknown[] | null;
  regSource: string | null;
}

interface GlobalStateContextType {
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
  setUserData: () => Promise<void>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    user: null,
    profileStrength: null,
    notifications: null,
    regSource: null
  });

  const setUserData = async () => {
    try {
      if (isAuthenticated()) {
        const user = getStoredUser();
        const accessToken = getStoredToken();
        if (user && accessToken) {
          setGlobalState(prev => ({ 
            ...prev, 
            user: { ...user, access_token: accessToken }
          }));
        }
      }
    } catch (error) {
      console.warn('Error from global provider:', error);
    }
  };

  useEffect(() => {
    setUserData();
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        globalState,
        setGlobalState,
        setUserData
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
