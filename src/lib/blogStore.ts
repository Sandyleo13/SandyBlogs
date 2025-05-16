
"use client";

import { create } from 'zustand';
import {type BlogPost, type User } from '@/lib/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';

const BLOG_STORAGE_KEY = 'sandy_blogs_posts';

interface BlogState {
  posts: BlogPost[];
  isLoading: boolean;
  fetchPosts: (page: number) => Promise<{ posts: BlogPost[], totalPosts: number }>;
  fetchPostById: (id: string) => Promise<BlogPost | undefined>;
  createPost: (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorEmail'>, currentUser: User) => Promise<BlogPost>;
  updatePost: (id: string, data: Partial<Omit<BlogPost, 'id' | 'authorId' | 'createdAt' | 'authorEmail'>>, currentUser: User) => Promise<BlogPost | undefined>;
  deletePost: (id: string, currentUser: User) => Promise<boolean>;
  initializeBlogs: () => void;
}

const getInitialPosts = (): BlogPost[] => {
  if (typeof window === 'undefined') return [];
  const storedPosts = localStorage.getItem(BLOG_STORAGE_KEY);
  if (storedPosts) {
    try {
      return JSON.parse(storedPosts);
    } catch (e) {
      console.error("Failed to parse blogs from localStorage", e);
      return [];
    }
  }
  // Default initial posts if nothing in localStorage
  return [
    {
      id: '1',
      title: 'Getting Started with Next.js',
      content: 'Next.js is a popular React framework for building server-side rendered and static web applications. This post covers the basics.',
      authorId: 'mock-user-1',
      authorEmail: 'user1@example.com',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Understanding Tailwind CSS',
      content: 'Tailwind CSS is a utility-first CSS framework that helps you build custom designs rapidly. Learn how to make the most of it.',
      authorId: 'mock-user-2',
      authorEmail: 'user2@example.com',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'The Art of Minimalism in Design',
      content: 'Minimalist design focuses on simplicity and functionality. This post explores its principles and benefits.',
      authorId: 'mock-user-1',
      authorEmail: 'user1@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};


export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  isLoading: true,

  initializeBlogs: () => {
    const initialPosts = getInitialPosts();
    set({ posts: initialPosts, isLoading: false });
    if (typeof window !== 'undefined' && !localStorage.getItem(BLOG_STORAGE_KEY)) {
       localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(initialPosts));
    }
  },
  
  fetchPosts: async (page: number = 1) => {
    const allPosts = get().posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const totalPosts = allPosts.length;
    const paginatedPosts = allPosts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    return { posts: paginatedPosts, totalPosts };
  },

  fetchPostById: async (id: string) => {
    return get().posts.find(post => post.id === id);
  },

  createPost: async (data, currentUser) => {
    const newPost: BlogPost = {
      ...data,
      id: Date.now().toString(),
      authorId: currentUser.id,
      authorEmail: currentUser.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(state => {
      const updatedPosts = [newPost, ...state.posts];
      if (typeof window !== 'undefined') {
        localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(updatedPosts));
      }
      return { posts: updatedPosts };
    });
    return newPost;
  },

  updatePost: async (id, data, currentUser) => {
    let updatedPost: BlogPost | undefined;
    set(state => {
      const posts = state.posts.map(post => {
        if (post.id === id && post.authorId === currentUser.id) {
          updatedPost = { ...post, ...data, updatedAt: new Date().toISOString() };
          return updatedPost;
        }
        return post;
      });
      if (updatedPost) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
        }
        return { posts };
      }
      return state; // No change if post not found or user not author
    });
    return updatedPost;
  },

  deletePost: async (id: string, currentUser: User) => {
    let success = false;
    set(state => {
      const postToDelete = state.posts.find(p => p.id === id);
      if (postToDelete && postToDelete.authorId === currentUser.id) {
        const updatedPosts = state.posts.filter(post => post.id !== id);
        if (typeof window !== 'undefined') {
          localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(updatedPosts));
        }
        success = true;
        return { posts: updatedPosts };
      }
      return state; // No change
    });
    return success;
  },
}));

if (typeof window !== 'undefined') {
  useBlogStore.getState().initializeBlogs();
}

