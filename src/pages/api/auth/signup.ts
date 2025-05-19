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

function writeUsers(users: any[]) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const users = readUsers();
    if (users.find((u: any) => u.email === email)) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    const id = Date.now().toString();
    const newUser = { id, email, password };
    users.push(newUser);
    writeUsers(users);
    return res.status(201).json({ id, email });
  }
  res.status(405).end();
}
