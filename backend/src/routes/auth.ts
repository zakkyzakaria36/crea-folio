import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AppEnv } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'creafolio_super_secret_jwt_key_2026';

export const authRoutes = new Hono<AppEnv>();

authRoutes.post('/login', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return c.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

authRoutes.get('/me', authMiddleware, async (c) => {
  const currentUser = c.get('user');
  return c.json({ user: currentUser });
});

// POST change password (Admin only)
authRoutes.post('/change-password', authMiddleware, async (c) => {
  const currentUser = c.get('user');
  const { currentPassword, newPassword } = await c.req.json();

  if (!currentPassword || !newPassword) {
    return c.json({ error: 'Password lama dan password baru wajib diisi' }, 400);
  }

  if (newPassword.length < 6) {
    return c.json({ error: 'Password baru minimal terdiri dari 6 karakter' }, 400);
  }

  const [user] = await db.select().from(users).where(eq(users.id, currentUser.id)).limit(1);
  if (!user) {
    return c.json({ error: 'Pengguna tidak ditemukan' }, 404);
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return c.json({ error: 'Password lama tidak sesuai' }, 400);
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));

  return c.json({ message: 'Password berhasil diubah!' });
});
