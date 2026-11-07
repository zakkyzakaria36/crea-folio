import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import 'dotenv/config';

import { authRoutes } from './routes/auth.js';
import { portfolioRoutes } from './routes/portfolio.js';
import { orderRoutes } from './routes/order.js';
import { uploadRoutes } from './routes/upload.js';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Serve uploaded files statically
app.use('/uploads/*', serveStatic({ root: './' }));

// Root & Health Check
app.get('/', (c) => c.json({
  name: 'CreaFolio API Server',
  status: 'running',
  frontendUrl: 'http://localhost:3000',
  documentation: {
    health: '/health',
    portfolios: '/api/portfolios',
    orders: '/api/orders',
  },
}));
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Mount Routes
app.route('/api/auth', authRoutes);
app.route('/api/portfolios', portfolioRoutes);
app.route('/api/orders', orderRoutes);
app.route('/api/upload', uploadRoutes);

const port = Number(process.env.PORT) || 5000;
console.log(`Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Crea-Folio API running at http://localhost:${info.port}`);
});
