import type { Context, Next } from 'hono';

export type AppEnv = {
  Variables: {
    user: AuthUser;
  };
};
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'creafolio_super_secret_jwt_key_2026';

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export async function authMiddleware(c: Context<AppEnv>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    (c as any).set('user', decoded);
    await next();
  } catch {
    return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401);
  }
}
