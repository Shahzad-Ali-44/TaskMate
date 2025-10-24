import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiClient from '../lib/api.ts';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (userData: { name: string; email: string; password: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<{ success: boolean }>;
  checkEmail: (email: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = apiClient.getToken();
      if (token) {
        try {
          const response = await apiClient.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
          } else {
            apiClient.removeToken();
          }
        } catch (error) {
          console.error('Auth check error:', error);
          apiClient.removeToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (userData: { name: string; email: string; password: string }) => {
    try {
      setError(null);
      const response = await apiClient.signup(userData);
      
      if (response.success) {
        const { user: newUser, token } = response.data;
        apiClient.setToken(token);
        setUser(newUser);
        return { success: true, user: newUser };
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setError(null);
      const response = await apiClient.login(credentials);
      
      if (response.success) {
        const { user: loggedInUser, token } = response.data;
        apiClient.setToken(token);
        setUser(loggedInUser);
        return { success: true, user: loggedInUser };
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setError(null);
      return { success: true };
    }
  };

  const checkEmail = async (email: string) => {
    try {
      setError(null);
      const response = await apiClient.checkEmail(email);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.message || 'Email check failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      setError(null);
      const response = await apiClient.resetPassword(email, newPassword);
      return { success: true, message: response.message };
    } catch (error: any) {
      const errorMessage = error.message || 'Password reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    checkEmail,
    resetPassword,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
