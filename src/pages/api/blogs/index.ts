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
  if (req.method === 'GET') {
    const blogs = readBlogs();
    return res.status(200).json(blogs);
  }
  if (req.method === 'POST') {
    const { title, content, authorId, authorEmail } = req.body;
    if (!title || !content || !authorId || !authorEmail) {
      return res.status(400).json({ error: 'Title, content, authorId, and authorEmail are required.' });
    }
    const blogs = readBlogs();
    const newBlog = {
      id: Date.now().toString(),
      title,
      content,
      authorId,
      authorEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    blogs.unshift(newBlog);
    writeBlogs(blogs);
    return res.status(201).json(newBlog);
  }
  res.status(405).end();
}
