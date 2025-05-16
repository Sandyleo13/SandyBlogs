
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, BookOpen, PlusCircle, LogIn, UserPlus, LogOut } from 'lucide-react';

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const { initializeAuth, user, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          {children}
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader className="p-4">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors group-data-[collapsible=icon]:hidden">
              {APP_NAME}
            </Link>
             <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors hidden group-data-[collapsible=icon]:block text-center">
              {APP_NAME.charAt(0)}
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{children: "Home", side:"right", align:"center"}}>
                  <Link href="/"><Home /><span>Home</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{children: "Blogs", side:"right", align:"center"}}>
                  <Link href="/blogs"><BookOpen /><span>Blogs</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{children: "New Post", side:"right", align:"center"}}>
                    <Link href="/blogs/create"><PlusCircle /><span>New Post</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start px-2 h-auto py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center">
                    <Avatar className="h-8 w-8 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:mr-0 mr-2">
                      <AvatarImage src={`https://placehold.co/100x100.png?text=${user.email[0].toUpperCase()}`} alt={user.email} data-ai-hint="avatar user" />
                      <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate group-data-[collapsible=icon]:hidden">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Logged in as</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{children: "Login", side:"right", align:"center"}}>
                    <Link href="/auth/login"><LogIn /><span>Login</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{children: "Sign Up", side:"right", align:"center"}}>
                    <Link href="/auth/signup"><UserPlus /><span>Sign Up</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-3 md:hidden">
            {/* Mobile Trigger */}
            <SidebarTrigger />
            <Link href="/" className="text-xl font-bold text-primary md:hidden ml-2">
              {APP_NAME}
            </Link>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </SidebarInset>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
