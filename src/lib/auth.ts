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
    console.error('Error parsing user data:', error);
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
  // Legacy compatibility
  localStorage.setItem('loggedUser', JSON.stringify({ user }));
};

export const clearStoredAuth = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('loggedUser');
};

export const isAuthenticated = (): boolean => {
  return !!getStoredToken() && !!getStoredUser();
};

export const getUserType = (): User['type'] | null => {
  const user = getStoredUser();
  return user?.type || null;
};
