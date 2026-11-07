import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';
import { db } from '../db/index.js';
import { orders } from '../db/schema.js';
import { authMiddleware } from '../middleware/auth.js';

export const orderRoutes = new Hono();

// Generate unique order code: CF-YYYYMMDD-XXXX
function generateOrderCode(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `CF-${dateStr}-${randomStr}`;
}

// POST create commission order (Public)
orderRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const { clientName, clientEmail, clientPhone, serviceCategory, projectTitle, description, referenceFileUrl, budgetRange, deadline } = body;

  if (!clientName || !clientEmail || !serviceCategory || !projectTitle || !description) {
    return c.json({ error: 'clientName, clientEmail, serviceCategory, projectTitle, and description are required' }, 400);
  }

  const orderCode = generateOrderCode();

  await db.insert(orders).values({
    orderCode,
    clientName,
    clientEmail,
    clientPhone: clientPhone || null,
    serviceCategory,
    projectTitle,
    description,
    referenceFileUrl: referenceFileUrl || null,
    budgetRange: budgetRange || null,
    deadline: deadline ? new Date(deadline) : null,
    status: 'pending',
  });

  const [created] = await db.select().from(orders).where(eq(orders.orderCode, orderCode)).limit(1);

  return c.json({
    message: 'Commission order submitted successfully',
    orderCode,
    data: created,
  }, 201);
});

// GET track order by orderCode (Public)
orderRoutes.get('/track/:code', async (c) => {
  const code = c.req.param('code').trim().toUpperCase();
  const [order] = await db.select({
    orderCode: orders.orderCode,
    clientName: orders.clientName,
    serviceCategory: orders.serviceCategory,
    projectTitle: orders.projectTitle,
    status: orders.status,
    createdAt: orders.createdAt,
    updatedAt: orders.updatedAt,
  }).from(orders).where(eq(orders.orderCode, code)).limit(1);

  if (!order) {
    return c.json({ error: 'Order not found with the provided code' }, 404);
  }

  return c.json({ data: order });
});

// GET list all orders (Admin only)
orderRoutes.get('/', authMiddleware, async (c) => {
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return c.json({ data: allOrders });
});

// PATCH update order status & admin notes (Admin only)
orderRoutes.patch('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const { status, adminNotes } = await c.req.json();

  const [existing] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: 'Order not found' }, 404);
  }

  await db.update(orders)
    .set({
      ...(status && { status }),
      ...(adminNotes !== undefined && { adminNotes }),
    })
    .where(eq(orders.id, id));

  const [updated] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return c.json({ message: 'Order updated successfully', data: updated });
});

// DELETE order (Admin only)
orderRoutes.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  const [existing] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: 'Order not found' }, 404);
  }

  await db.delete(orders).where(eq(orders.id, id));
  return c.json({ message: 'Order deleted successfully' });
});
