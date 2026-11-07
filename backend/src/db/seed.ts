import bcrypt from 'bcryptjs';
import { db, poolConnection } from './index.js';
import { users, portfolios } from './schema.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding initial data...');

  // 1. Admin account
  const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      username: 'admin',
      passwordHash,
      role: 'admin',
    });
    console.log('Admin account created: admin / admin123');
  }

  // 2. Sample portfolio items
  const existingPortos = await db.select().from(portfolios);
  if (existingPortos.length === 0) {
    await db.insert(portfolios).values([
      {
        title: 'Cyberpunk Neon Street Illustration',
        slug: 'cyberpunk-neon-street',
        category: 'illustration',
        description: 'Detailed digital painting of a futuristic metropolis alley with dynamic neon reflections and rain effect.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
      },
      {
        title: 'Cinematic Travel Reel - Bali Odyssey',
        slug: 'cinematic-travel-reel-bali',
        category: 'video',
        description: 'Dynamic pacing, sound design, and color grading showcase for a tourism promotional campaign.',
        mediaType: 'embed',
        mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
      },
      {
        title: 'E-Commerce Analytics Executive Dashboard',
        slug: 'ecommerce-analytics-dashboard',
        category: 'dataviz',
        description: 'Interactive analytics dashboard displaying GMV, conversion funnel, retention cohorts, and sales velocity.',
        mediaType: 'link',
        mediaUrl: 'https://example.com/live-dashboard',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
        extraData: {
          metrics: [
            { label: 'Revenue Growth', value: '+34.2%' },
            { label: 'Active Users', value: '128.5K' },
            { label: 'Conversion Rate', value: '3.8%' },
          ],
        },
        isFeatured: true,
      },
    ]);
    console.log('Sample portfolio items seeded.');
  }

  console.log('Seeding finished successfully.');
  await poolConnection.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
