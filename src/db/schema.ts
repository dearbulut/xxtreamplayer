import { pgTable, boolean, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  iptvUrl: varchar('iptv_url', { length: 255 }).notNull(),
  iptvUsername: varchar('iptv_username', { length: 255 }).notNull(),
  iptvPassword: varchar('iptv_password', { length: 255 }).notNull(),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;