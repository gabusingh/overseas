import React, {createContext, useContext, useEffect, useState} from 'react';

// Step 1: Create a context
const GlobalStateContext = createContext();

// Step 2: Create a provider component
export const GlobalStateProvider = ({children}) => {
  const setUserData = async () => {
    try {
      let localUser = JSON.parse(localStorage.getItem("loggedUser"))
      setGlobalState({...globalState, user: localUser});
    } catch (error) {
      console.warn('error from global provider');
    }
  };

  const [globalState, setGlobalState] = useState({
    user: null,
    profileStrength: null,
    notifications: null,
    regSource:null
  });

  useEffect(() => {
    setUserData();
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        globalState,
        setGlobalState,
        setUserData: setUserData,
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Step 3: Create a custom hook to access the global state
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
