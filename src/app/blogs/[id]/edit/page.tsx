
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogForm from '@/components/blog/BlogForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useBlogStore } from '@/lib/blogStore';
import { useAuthStore } from '@/lib/authStore';
import type { BlogPost } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = typeof params.id === 'string' ? params.id : '';

  const { fetchPostById, updatePost } = useBlogStore();
  const { user } = useAuthStore();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id && user) { // Ensure user is loaded before checking authorship
      const loadPost = async () => {
        setIsLoading(true);
        const fetchedPost = await fetchPostById(id);
        if (fetchedPost) {
          if (fetchedPost.authorId !== user.id) {
            toast({ title: "Unauthorized", description: "You are not authorized to edit this post.", variant: "destructive" });
            router.push(`/blogs/${id}`);
            return;
          }
          setPost(fetchedPost);
        } else {
          toast({ title: "Error", description: "Blog post not found.", variant: "destructive" });
          router.push('/blogs');
        }
        setIsLoading(false);
      };
      loadPost();
    } else if (id && !user && !useAuthStore.getState().isLoading) { // User not logged in and auth check finished
        toast({ title: "Authentication Required", description: "Please log in to edit posts.", variant: "destructive" });
        router.push(`/auth/login?redirect=/blogs/${id}/edit`);
    }
  }, [id, user, fetchPostById, router, toast]);

  const handleSubmit = async (data: Partial<Omit<BlogPost, 'id' | 'authorId' | 'createdAt' | 'authorEmail'>>) => {
    if (!post || !user) {
      toast({ title: "Error", description: "Post data or user session is missing.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedPost = await updatePost(post.id, data, user);
      if (updatedPost) {
        toast({ title: "Post Updated", description: `"${updatedPost.title}" has been successfully updated.` });
        router.push(`/blogs/${updatedPost.id}`);
      } else {
        throw new Error("Failed to update post. You might not be the author or the post doesn't exist.");
      }
    } catch (error: any) {
      toast({ title: "Error Updating Post", description: error.message || "An unexpected error occurred.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };
  
  if (isLoading || (id && !post && !useAuthStore.getState().isLoading && !user)) { // Show loader if loading post or if auth is still loading for an unauth user
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  if (!post) {
    // Should have been redirected or handled by auth loading state
    return <div className="text-center py-10"><p className="text-xl text-muted-foreground">Post not found or you are not authorized.</p></div>;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" asChild className="mb-6">
            <Link href={`/blogs/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Edit
            </Link>
          </Button>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">Edit Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogForm initialData={post} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Save Changes" />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
