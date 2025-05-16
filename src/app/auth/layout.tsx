
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Feather } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <Link href="/" aria-label="Back to homepage">
              <Feather className="mx-auto h-16 w-16 text-primary mb-4" />
            </Link>
            <h1 className="text-3xl font-bold text-primary">{APP_NAME}</h1>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
