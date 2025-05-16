
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const { initializeAuth } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  // Don't show Navbar and Footer on auth pages
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      {!isAuthPage && <Footer />}
      <Toaster />
    </div>
  );
}
