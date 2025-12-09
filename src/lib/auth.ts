interface User {
  id: number;
  type: 'person' | 'company' | 'institute';
  email: string;
  phone: string;
  name?: string;
}

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const setStoredUser = (user: User, token: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('access_token', token);
  // Legacy compatibility - full data structure with access_token
  localStorage.setItem('loggedUser', JSON.stringify({ 
    user: user, 
    access_token: token,
    // Also store at root level for compatibility
    ...user
  }));
};

export const clearStoredAuth = (): void => {
  if (typeof window === 'undefined') return;
  
  // Clear all possible authentication-related data
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('loggedUser');
  
  // Clear any session storage as well
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('loggedUser');
  
  // Clear any other auth-related items that might exist
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userToken');
};

export const isAuthenticated = (): boolean => {
  return !!getStoredToken() && !!getStoredUser();
};

export const getUserType = (): User['type'] | null => {
  const user = getStoredUser();
  return user?.type || null;
};
