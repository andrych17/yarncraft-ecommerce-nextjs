/**
 * Authentication Context
 * Manages user authentication state and provides auth-related functions
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types/api';
import { authService } from '@/lib/api/services/auth';
import { tokenStorage, userStorage } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    const savedToken = tokenStorage.get();
    const savedUser = userStorage.get();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    
    if (response.data) {
      const { token, partner } = response.data;
      setToken(token);
      setUser(partner);
      tokenStorage.set(token);
      userStorage.set(partner);
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data);
    
    if (response.data) {
      const { token, partner } = response.data;
      setToken(token);
      setUser(partner);
      tokenStorage.set(token);
      userStorage.set(partner);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } finally {
      setToken(null);
      setUser(null);
      tokenStorage.remove();
      userStorage.remove();
    }
  }, [token]);

  // Refresh user profile
  const refreshUser = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await authService.getProfile(token);
      if (response.data) {
        setUser(response.data);
        userStorage.set(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
