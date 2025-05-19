"use client";

import BlogForm from '@/components/blog/BlogForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createBlog } from '@/lib/api';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateBlogPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: { title: string; content: string }) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a post.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const newPost = await createBlog({ ...data, authorId: user.id, authorEmail: user.email });
      toast({ title: "Post Created", description: `"${newPost.title}" has been successfully published.` });
      router.push(`/blogs/${newPost.id}`);
    } catch (error: any) {
      toast({ title: "Error Creating Post", description: error.message || "An unexpected error occurred.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto">
         <Button variant="outline" asChild className="mb-6">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Link>
          </Button>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">Create New Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Publish Post" />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
