// src/lib/api.ts
// Centralized API functions for authentication and blog CRUD

export async function signup(email: string, password: string) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Signup failed');
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
  return res.json();
}

export async function fetchBlogs() {
  const res = await fetch('/api/blogs');
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function fetchBlog(id: string) {
  const res = await fetch(`/api/blogs/${id}`);
  if (!res.ok) throw new Error('Blog not found');
  return res.json();
}

export async function createBlog(data: { title: string; content: string; authorId: string; authorEmail: string }) {
  const res = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create blog');
  return res.json();
}

export async function updateBlog(id: string, data: { title?: string; content?: string }) {
  const res = await fetch(`/api/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update blog');
  return res.json();
}

export async function deleteBlog(id: string) {
  const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete blog');
  return true;
}
