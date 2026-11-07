import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { portfolios } from '../db/schema.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AppEnv } from '../middleware/auth.js';

export const portfolioRoutes = new Hono<AppEnv>();

// GET all portfolios (with optional category filter)
portfolioRoutes.get('/', async (c) => {
  const category = c.req.query('category') as 'illustration' | 'video' | 'dataviz' | undefined;

  let query = db.select().from(portfolios).orderBy(desc(portfolios.createdAt));
  const results = category
    ? await db.select().from(portfolios).where(eq(portfolios.category, category)).orderBy(desc(portfolios.createdAt))
    : await query;

  return c.json({ data: results });
});

// GET portfolio by ID or Slug
portfolioRoutes.get('/:idOrSlug', async (c) => {
  const param = c.req.param('idOrSlug');
  const isNumeric = /^\d+$/.test(param);

  const [item] = isNumeric
    ? await db.select().from(portfolios).where(eq(portfolios.id, parseInt(param, 10))).limit(1)
    : await db.select().from(portfolios).where(eq(portfolios.slug, param)).limit(1);

  if (!item) {
    return c.json({ error: 'Portfolio item not found' }, 404);
  }

  return c.json({ data: item });
});

// Helper for slug generation
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-') + '-' + Date.now().toString().slice(-4);
}

// POST create portfolio (Admin only)
portfolioRoutes.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const { title, category, description, mediaType, mediaUrl, thumbnailUrl, extraData, isFeatured } = body;

  if (!title || !category || !mediaType || !mediaUrl) {
    return c.json({ error: 'Title, category, mediaType, and mediaUrl are required' }, 400);
  }

  const slug = body.slug ? body.slug : generateSlug(title);

  await db.insert(portfolios).values({
    title,
    slug,
    category,
    description: description || null,
    mediaType,
    mediaUrl,
    thumbnailUrl: thumbnailUrl || null,
    extraData: extraData || null,
    isFeatured: Boolean(isFeatured),
  });

  const [created] = await db.select().from(portfolios).where(eq(portfolios.slug, slug)).limit(1);
  return c.json({ message: 'Portfolio created successfully', data: created }, 201);
});

// PUT update portfolio (Admin only)
portfolioRoutes.put('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id') ?? '', 10);
  const body = await c.req.json();

  const [existing] = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: 'Portfolio item not found' }, 404);
  }

  const { title, category, description, mediaType, mediaUrl, thumbnailUrl, extraData, isFeatured } = body;

  await db.update(portfolios)
    .set({
      ...(title !== undefined && { title }),
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description }),
      ...(mediaType !== undefined && { mediaType }),
      ...(mediaUrl !== undefined && { mediaUrl }),
      ...(thumbnailUrl !== undefined && { thumbnailUrl }),
      ...(extraData !== undefined && { extraData }),
      ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
    })
    .where(eq(portfolios.id, id));

  const [updated] = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
  return c.json({ message: 'Portfolio updated successfully', data: updated });
});

// DELETE portfolio (Admin only)
portfolioRoutes.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id') ?? '', 10);

  const [existing] = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: 'Portfolio item not found' }, 404);
  }

  await db.delete(portfolios).where(eq(portfolios.id, id));
  return c.json({ message: 'Portfolio item deleted successfully' });
});
