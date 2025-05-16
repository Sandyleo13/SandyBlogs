
"use client";

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function PaginationControls({ currentPage, totalPages, hasNextPage, hasPrevPage }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', page.toString());
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/blogs${query}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 mt-12">
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-5 w-5 mr-2" />
        Previous
      </Button>
      <span className="text-sm text-foreground/80">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Go to next page"
      >
        Next
        <ChevronRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
}
