
"use client"; 

import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)] py-12 px-4">
      <AlertTriangle className="h-24 w-24 text-destructive mb-6" />
      <h1 className="text-4xl font-bold text-primary mb-4">Something Went Wrong</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        We encountered an unexpected issue. Please try again, or if the problem persists, contact support.
      </p>
      {error?.message && (
         <p className="text-sm text-destructive/80 bg-destructive/10 p-3 rounded-md mb-6 max-w-xl">
           Error details: {error.message}
         </p>
      )}
      <Button
        onClick={() => reset()}
        size="lg"
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <RefreshCcw className="mr-2 h-5 w-5" />
        Try Again
      </Button>
    </div>
  );
}
