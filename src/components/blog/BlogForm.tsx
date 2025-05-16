
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost } from "@/lib/types";
import { Save, Loader2 } from "lucide-react";
import { useState } from "react";

const blogFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100, { message: "Title must be 100 characters or less."}),
  content: z.string().min(20, { message: "Content must be at least 20 characters." }),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: BlogFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export default function BlogForm({ 
  initialData, 
  onSubmit, 
  isSubmitting: externalIsSubmitting, 
  submitButtonText = "Save Post" 
}: BlogFormProps) {
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  const isActuallySubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : isSubmittingInternal;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
    },
  });

  const handleSubmit = async (values: BlogFormValues) => {
    if (externalIsSubmitting === undefined) {
      setIsSubmittingInternal(true);
    }
    await onSubmit(values);
    if (externalIsSubmitting === undefined) {
      setIsSubmittingInternal(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your blog post title" {...field} className="text-base py-2 px-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog post content here..."
                  {...field}
                  rows={15}
                  className="text-base py-2 px-3 min-h-[300px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]" disabled={isActuallySubmitting}>
          {isActuallySubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isActuallySubmitting ? "Saving..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
