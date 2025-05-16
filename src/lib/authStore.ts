
"use client";

import { create } from 'zustand';
import {type User } from '@/lib/types';

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

// Mock user data - in a real app, this would come from a backend
const MOCK_USERS: Record<string, User> = {};

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
          // In a real app, you'd verify the token with the backend here
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
    // Simulate API call & JWT generation
    // For mock: if user exists (previously signed up) or is a known mock user, log them in.
    // Password check is trivialized for mock.
    return new Promise((resolve) => {
      setTimeout(() => {
        let userToLogin = MOCK_USERS[email];
        if (!userToLogin) { // Simple auto-signup if not found, for easier testing.
           userToLogin = { id: Date.now().toString(), email };
           MOCK_USERS[email] = userToLogin;
        }

        const mockToken = `mock-jwt-for-${email}-${Date.now()}`;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userToLogin, token: mockToken }));
        set({ user: userToLogin, token: mockToken, isLoading: false });
        resolve(userToLogin);
      }, 500);
    });
  },

  signup: async (email, password) => {
     // Simulate API call & JWT generation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (MOCK_USERS[email]) {
          // reject(new Error("User already exists")); // Or allow login
          // For simplicity, let's just log them in if they try to signup again
        }
        const newUser: User = { id: Date.now().toString(), email };
        MOCK_USERS[email] = newUser; // Store mock user

        const mockToken = `mock-jwt-for-${email}-${Date.now()}`;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: newUser, token: mockToken }));
        set({ user: newUser, token: mockToken, isLoading: false });
        resolve(newUser);
      }, 500);
    });
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
