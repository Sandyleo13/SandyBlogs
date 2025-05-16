
import type { BlogPost } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200); // Approximate reading time

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/blogs/${post.id}`} className="block">
        <Image
          src={`https://placehold.co/600x300.png`} // Generic placeholder
          alt={`Cover image for ${post.title}`}
          width={600}
          height={300}
          className="w-full h-48 object-cover"
          data-ai-hint="article blog"
        />
      </Link>
      <CardHeader className="p-4 sm:p-6">
        <Link href={`/blogs/${post.id}`} className="block">
          <CardTitle className="text-xl sm:text-2xl font-semibold hover:text-primary transition-colors duration-200 leading-tight">
            {post.title}
          </CardTitle>
        </Link>
        <CardDescription className="mt-2 text-sm text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1">
          <span className="flex items-center"><UserCircle className="h-4 w-4 mr-1" /> {post.authorEmail || 'Anonymous'}</span>
          <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1" /> {new Date(post.createdAt).toLocaleDateString()}</span>
          <Badge variant="secondary" className="text-xs">{readingTime} min read</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 flex-grow">
        <p className="text-foreground/80 line-clamp-3 text-sm sm:text-base">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Button asChild variant="link" className="p-0 text-accent hover:text-accent/80">
          <Link href={`/blogs/${post.id}`}>
            Read More <span aria-hidden="true">&rarr;</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
