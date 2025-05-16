
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { FileWarning, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)] py-12">
      <FileWarning className="h-24 w-24 text-destructive mb-6" />
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-foreground mb-3">Page Not Found</h2>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
      </p>
      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href="/">
          <Home className="mr-2 h-5 w-5" />
          Go Back Home
        </Link>
      </Button>
      <p className="mt-10 text-sm text-muted-foreground">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
}
