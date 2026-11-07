import { mysqlTable, int, varchar, text, json, boolean, timestamp, mysqlEnum, date } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin']).default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portfolios = mysqlTable('portfolios', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  category: mysqlEnum('category', ['illustration', 'video', 'dataviz']).notNull(),
  description: text('description'),
  mediaType: mysqlEnum('media_type', ['image', 'video', 'pdf', 'link', 'embed']).notNull(),
  mediaUrl: text('media_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  extraData: json('extra_data'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  orderCode: varchar('order_code', { length: 30 }).notNull().unique(),
  clientName: varchar('client_name', { length: 150 }).notNull(),
  clientEmail: varchar('client_email', { length: 150 }).notNull(),
  clientPhone: varchar('client_phone', { length: 50 }),
  serviceCategory: mysqlEnum('service_category', ['illustration', 'video', 'dataviz', 'other']).notNull(),
  projectTitle: varchar('project_title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  referenceFileUrl: text('reference_file_url'),
  budgetRange: varchar('budget_range', { length: 100 }),
  deadline: date('deadline'),
  status: mysqlEnum('status', ['pending', 'reviewed', 'in_progress', 'completed', 'rejected']).default('pending').notNull(),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type Order = typeof orders.$inferSelect;
