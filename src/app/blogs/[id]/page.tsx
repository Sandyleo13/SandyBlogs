
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBlogStore } from '@/lib/blogStore';
import { useAuthStore } from '@/lib/authStore';
import type { BlogPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, UserCircle, Edit3, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DeleteConfirmationDialog from '@/components/blog/DeleteConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = typeof params.id === 'string' ? params.id : '';

  const { fetchPostById, deletePost } = useBlogStore();
  const { user } = useAuthStore();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const loadPost = async () => {
        setIsLoading(true);
        const fetchedPost = await fetchPostById(id);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          toast({ title: "Error", description: "Blog post not found.", variant: "destructive" });
          router.push('/blogs'); // Or a 404 page
        }
        setIsLoading(false);
      };
      loadPost();
    }
  }, [id, fetchPostById, router, toast]);

  const handleDelete = async () => {
    if (!post || !user) return;
    setIsDeleting(true);
    try {
      const success = await deletePost(post.id, user);
      if (success) {
        toast({ title: "Post Deleted", description: `"${post.title}" has been successfully deleted.` });
        router.push('/blogs');
      } else {
        throw new Error("Failed to delete post or unauthorized.");
      }
    } catch (error: any) {
      toast({ title: "Error Deleting Post", description: error.message || "Could not delete the post.", variant: "destructive" });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    // This case should ideally be handled by redirect or a proper 404 component
    return <div className="text-center py-10"><p className="text-xl text-muted-foreground">Blog post not found.</p></div>;
  }
  
  const isAuthor = user && user.id === post.authorId;
  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/blogs">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Link>
      </Button>
      <Card className="shadow-xl overflow-hidden">
        <Image
          src={`https://placehold.co/800x400.png`}
          alt={`Cover image for ${post.title}`}
          width={800}
          height={400}
          className="w-full h-64 object-cover"
          priority // Prioritize loading for LCP
          data-ai-hint="article detail"
        />
        <CardHeader className="pt-6">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary leading-tight">{post.title}</CardTitle>
          <CardDescription className="mt-3 text-base text-muted-foreground flex items-center flex-wrap gap-x-4 gap-y-2">
            <span className="flex items-center"><UserCircle className="h-5 w-5 mr-1.5" /> {post.authorEmail || 'Anonymous'}</span>
            <span className="flex items-center"><CalendarDays className="h-5 w-5 mr-1.5" /> Published on {new Date(post.createdAt).toLocaleDateString()}</span>
            <Badge variant="secondary" className="text-xs">{readingTime} min read</Badge>
          </CardDescription>
           {post.createdAt !== post.updatedAt && (
            <p className="text-xs text-muted-foreground mt-1">Last updated on {new Date(post.updatedAt).toLocaleDateString()}</p>
          )}
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none dark:prose-invert pt-4 pb-8 text-foreground/90">
          {/* Using a simple div to render content. For Markdown, use a library like react-markdown */}
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </CardContent>
      </Card>
      {isAuthor && (
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" asChild size="sm">
            <Link href={`/blogs/${post.id}/edit`}>
              <Edit3 className="mr-2 h-4 w-4" /> Edit Post
            </Link>
          </Button>
          <DeleteConfirmationDialog onConfirm={handleDelete} isLoading={isDeleting} />
        </div>
      )}
    </div>
  );
}
