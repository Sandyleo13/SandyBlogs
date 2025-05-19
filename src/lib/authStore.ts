"use client";

import { create } from 'zustand';
import {type User } from '@/lib/types';
import { login as apiLogin, signup as apiSignup } from '@/lib/api';

const AUTH_STORAGE_KEY = 'sandy_blogs_auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, token: string) => Promise<User | null>; // Simulate API call
  signup: (email: string, token: string) => Promise<User | null>; // Simulate API call
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  initializeAuth: () => {
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const { user, token } = JSON.parse(storedAuth);
        if (user && token) {
          set({ user, token, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to initialize auth from localStorage", error);
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    // Use real API
    const user = await apiLogin(email, password);
    const mockToken = `mock-jwt-for-${email}-${Date.now()}`;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token: mockToken }));
    set({ user, token: mockToken, isLoading: false });
    return user;
  },

  signup: async (email, password) => {
    // Use real API
    const user = await apiSignup(email, password);
    const mockToken = `mock-jwt-for-${email}-${Date.now()}`;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token: mockToken }));
    set({ user, token: mockToken, isLoading: false });
    return user;
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ user: null, token: null, isLoading: false });
  },
}));

// Initialize auth state on load for client components
if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuth();
}
