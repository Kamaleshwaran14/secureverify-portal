import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db', 'data.json');

type Role = 'Admin' | 'General User';

interface AppUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  accessLevel: string;
  status: string;
}

interface VerificationRecord {
  id: number;
  employeeName: string;
  verificationType: string;
  status: string;
  accessLevel: Role;
}

interface Database {
  users: AppUser[];
  records: VerificationRecord[];
}

function readDb(): Database {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

function writeDb(data: Database): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function getDelay(req: express.Request): number {
  const delay = Number(req.query.delay || 0);
  return Number.isNaN(delay) ? 0 : delay;
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SecureVerify API',
  });
});

app.post('/api/login', (req, res) => {
  const { userId, password, role } = req.body;

  const db = readDb();

  const user = db.users.find(
    (item) =>
      item.email === userId &&
      item.password === password &&
      item.role === role
  );

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessLevel: user.accessLevel,
    status: user.status,
  };

  return res.json(session);
});

app.get('/api/records', (req, res) => {
  const role = req.query.role as Role;
  const delay = getDelay(req);

  const db = readDb();

  const records =
    role === 'Admin'
      ? db.records
      : db.records.filter(
          (record) => record.accessLevel === 'General User'
        );

  setTimeout(() => {
    res.json(records);
  }, delay);
});

app.get('/api/users', (req, res) => {
  const delay = getDelay(req);
  const db = readDb();

  const users = db.users.map(({ password, ...user }) => user);

  setTimeout(() => {
    res.json(users);
  }, delay);
});

app.post('/api/users', (req, res) => {
  const db = readDb();

  const newUser: AppUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    password: 'password123',
    role: req.body.role,
    accessLevel:
      req.body.role === 'Admin'
        ? 'Full Access'
        : 'Read Only',
    status: 'Active',
  };

  db.users.push(newUser);
  writeDb(db);

  const { password, ...safeUser } = newUser;

  res.status(201).json(safeUser);
});

app.delete('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = readDb();

  db.users = db.users.filter((user) => user.id !== id);
  writeDb(db);

  res.json({
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`SecureVerify API running on http://localhost:${PORT}`);
});