import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

const usersFile = path.join(process.cwd(), 'src', 'data', 'users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const users = readUsers();
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    return res.status(200).json({ id: user.id, email: user.email });
  }
  res.status(405).end();
}
