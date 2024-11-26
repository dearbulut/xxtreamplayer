import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

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
  iptvUsername: varchar('iptv_username', { length: 255 }).notNull(),
  iptvPassword: varchar('iptv_password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});