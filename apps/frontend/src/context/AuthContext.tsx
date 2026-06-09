'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setApiAuthToken } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'GUEST' | 'RENTER' | 'OWNER' | 'ADMIN';
  preferredLanguage: string;
  verificationStatus?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Set up axios bearer token interceptor
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setApiAuthToken(storedToken);
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(res.data);
    } catch (e) {
      console.error('Error fetching user profile', e);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: loggedUser } = res.data;
      setToken(access_token);
      setApiAuthToken(access_token);
      setUser(loggedUser);
    } catch (e: any) {
      setLoading(false);
      throw new Error(e.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      const { access_token, user: loggedUser } = res.data;
      setToken(access_token);
      setApiAuthToken(access_token);
      setUser(loggedUser);
    } catch (e: any) {
      setLoading(false);
      throw new Error(e.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setApiAuthToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
