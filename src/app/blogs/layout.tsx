
import type { ReactNode } from 'react';

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <section className="w-full">
      {children}
    </section>
  );
}
