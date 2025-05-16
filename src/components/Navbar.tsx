
"use client";

import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, PlusCircle, UserPlus, Home, BookOpen, Settings, UserCircle } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary-foreground hover:text-accent-foreground transition-colors">
          {APP_NAME}
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-accent-foreground hidden sm:inline-flex">
            <Link href="/">
              <Home className="mr-0 sm:mr-2 h-5 w-5" /> <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-accent-foreground hidden sm:inline-flex">
            <Link href="/blogs">
              <BookOpen className="mr-0 sm:mr-2 h-5 w-5" /> <span className="hidden sm:inline">Blogs</span>
            </Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-accent-foreground">
                <Link href="/blogs/create">
                  <PlusCircle className="mr-0 sm:mr-2 h-5 w-5" /> <span className="hidden sm:inline">New Post</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full text-primary-foreground hover:bg-primary/80 hover:text-accent-foreground">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://placehold.co/100x100.png?text=${user.email[0].toUpperCase()}`} alt={user.email} data-ai-hint="avatar user" />
                      <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Logged in as</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuItem asChild>
                    <Link href="/profile"><Settings className="mr-2 h-4 w-4" /> Profile</Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-accent-foreground">
                <Link href="/auth/login">
                  <LogIn className="mr-0 sm:mr-2 h-5 w-5" /> <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/auth/signup">
                   <UserPlus className="mr-0 sm:mr-2 h-5 w-5" /> <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </Button>
            </>
          )}
           {/* Mobile menu trigger can be added here if needed */}
        </div>
      </nav>
    </header>
  );
}
