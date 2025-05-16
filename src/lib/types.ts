
export interface User {
  id: string;
  email: string;
  // Add other user properties if needed, e.g., name
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorEmail?: string; // For display purposes
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
