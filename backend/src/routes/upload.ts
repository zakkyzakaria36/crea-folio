import { Hono } from 'hono';
import fs from 'fs/promises';
import path from 'path';

export const uploadRoutes = new Hono();

uploadRoutes.post('/', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'];

  if (!file || !(file instanceof File)) {
    return c.json({ error: 'No valid file uploaded' }, 400);
  }

  const uploadDir = path.resolve(process.cwd(), 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || '';
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${Date.now()}_${sanitizedName}`;
  const filepath = path.join(uploadDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(arrayBuffer));

  const fileUrl = `/uploads/${filename}`;

  return c.json({
    message: 'File uploaded successfully',
    filename,
    url: fileUrl,
    size: file.size,
    type: file.type,
  });
});
