import { pgTable as table, pgEnum } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('roles', ['artist', 'dj']);

export const users = table(
  'users',
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    first_name: t.varchar(),
    last_name: t.varchar(),
    email: t.varchar().notNull(),
    password: t.varchar().unique().notNull(),
    role: rolesEnum().default('artist'),
    created_at: t.timestamp('createdAt').defaultNow().notNull(),
    updated_at: t
      .timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deleted_at: t.timestamp(),
  },
  (table) => {
    return {
      emailIndex: t.uniqueIndex('email_idx').on(table.email),
    };
  },
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserWithoutPassword = Omit<User, 'password'>;
