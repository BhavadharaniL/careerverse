import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, setAuthToken } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateGoals: (goals: string[]) => Promise<void>;
  updateEducation: (education: any, targetCareer?: string) => Promise<void>;
  updateSkills: (skills: any[]) => Promise<void>;
  addCertificate: (cert: any) => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto load profile if token exists in state (mock persistence)
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      reloadProfile();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      setAuthToken(receivedToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      setAuthToken(receivedToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const reloadProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error reloading profile:', error);
    }
  };

  const updateGoals = async (goals: string[]) => {
    try {
      await authAPI.updateGoals(goals);
      if (user) {
        setUser({ ...user, goals });
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update goals.');
    }
  };

  const updateEducation = async (education: any, targetCareer?: string) => {
    try {
      const response = await authAPI.updateProfile({ education, targetCareer });
      setUser(response.data.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const updateSkills = async (skills: any[]) => {
    try {
      const response = await authAPI.updateSkills(skills);
      if (user) {
        setUser({ 
          ...user, 
          skills: response.data.skills, 
          xp: response.data.xp, 
          badges: response.data.badges 
        });
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update skills.');
    }
  };

  const addCertificate = async (cert: any) => {
    try {
      const response = await authAPI.addCertificate(cert);
      if (user) {
        setUser({ 
          ...user, 
          certificates: response.data.certificates, 
          xp: response.data.xp 
        });
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add certificate.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        register,
        logout,
        updateGoals,
        updateEducation,
        updateSkills,
        addCertificate,
        reloadProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
