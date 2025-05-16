
"use client"; // Making it client component to use hooks for fetching and pagination

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBlogStore } from '@/lib/blogStore';
import type { BlogPost } from '@/lib/types';
import BlogCard from '@/components/blog/BlogCard';
import PaginationControls from '@/components/blog/PaginationControls';
import { ITEMS_PER_PAGE, APP_NAME } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

export default function BlogsPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const { fetchPosts } = useBlogStore();
  const { user } = useAuthStore(); // Get user for conditional "Create Post" button

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      const { posts: fetchedPosts, totalPosts: fetchedTotalPosts } = await fetchPosts(page);
      setPosts(fetchedPosts);
      setTotalPosts(fetchedTotalPosts);
      setIsLoading(false);
    };
    loadPosts();
  }, [page, fetchPosts]);

  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">{APP_NAME} Posts</h1>
        {user && (
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/blogs/create">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Post
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground mb-4">No blog posts found.</p>
          {user && (
             <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/blogs/create">Be the first to write one!</Link>
             </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        hasNextPage={page < totalPages}
        hasPrevPage={page > 1}
      />
    </div>
  );
}
