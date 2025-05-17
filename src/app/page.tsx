
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { BookOpen, Feather } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center py-10">
      <header className="mb-12">
        <Feather className="mx-auto h-24 w-24 text-primary mb-4" />
        <h1 className="text-5xl font-bold mb-4 text-primary">
          Welcome to {APP_NAME}
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Discover inspiring stories, insightful articles, and creative ideas shared by our community.
        </p>
      </header>

      <section className="mb-12">
        {/* Image removed as per request */}
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-primary">Ready to Dive In?</h2>
        <p className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto">
          Explore a world of thoughts and perspectives. Your next favorite read is just a click away.
        </p>
        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/blogs">
            <BookOpen className="mr-2 h-5 w-5" /> Explore Blogs
          </Link>
        </Button>
      </section>
    </div>
  );
}
