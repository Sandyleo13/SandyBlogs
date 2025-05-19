"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, KeyRound } from 'lucide-react';
import { useState } from "react";
import { login } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const loginStore = useAuthStore((state) => state.login);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const user = await loginStore(values.email, values.password);
      if (user && user.email) {
        toast({ title: "Login Successful", description: `Welcome back, ${user.email}!` });
        router.push("/blogs");
      } else {
        toast({
          title: "Login Failed",
          description: "User information is missing.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">Welcome Back!</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="you@example.com" {...field} className="pl-10"/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" {...field} className="pl-10"/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? "Logging in..." : <><LogIn className="mr-2 h-5 w-5" /> Login</>}
          </Button>
        </form>
      </Form>
      <p className="mt-6 text-center text-sm text-foreground/70">
        Don&apos;t have an account?{" "}
        <Button variant="link" asChild className="p-0 text-accent hover:text-accent/80">
          <Link href="/auth/signup">Sign up here</Link>
        </Button>
      </p>
    </div>
  );
}
