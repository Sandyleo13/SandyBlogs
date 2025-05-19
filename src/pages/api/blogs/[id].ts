import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

const blogsFile = path.join(process.cwd(), 'src', 'data', 'blogs.json');

function readBlogs() {
  if (!fs.existsSync(blogsFile)) return [];
  const data = fs.readFileSync(blogsFile, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeBlogs(blogs: any[]) {
  fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  const blogId = Array.isArray(id) ? id[0] : id;
  let blogs = readBlogs();

  if (method === 'GET') {
    const blog = blogs.find((b: any) => b.id === blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    return res.status(200).json(blog);
  }

  if (method === 'PUT') {
    const { title, content } = req.body;
    const blog = blogs.find((b: any) => b.id === blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    if (title) blog.title = title;
    if (content) blog.content = content;
    blog.updatedAt = new Date().toISOString();
    writeBlogs(blogs);
    return res.status(200).json(blog);
  }

  if (method === 'DELETE') {
    const index = blogs.findIndex((b: any) => b.id === blogId);
    if (index === -1) return res.status(404).json({ error: 'Blog not found' });
    blogs.splice(index, 1);
    writeBlogs(blogs);
    return res.status(204).end();
  }

  res.status(405).end();
}
