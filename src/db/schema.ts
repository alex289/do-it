import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// --- Main Schema --- //

export const task = sqliteTable('task', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  isCompleted: integer('isCompleted', {
    mode: 'boolean',
  }).notNull(),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  dueDate: integer('dueDate', {
    mode: 'timestamp',
  }),
  priority: text('priority').notNull(),
  size: text('size').notNull(),
});

// --- Better Auth Schema --- //

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', {
    mode: 'boolean',
  }).notNull(),
  image: text('image'),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', {
    mode: 'timestamp',
  }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', {
    mode: 'timestamp',
  }).notNull(),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }),
});

export const passkey = sqliteTable('passkey', {
  id: text('id').primaryKey(),
  name: text('name'),
  publicKey: text('publicKey').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  webauthnUserID: text('webauthnUserID').notNull(),
  counter: integer('counter').notNull(),
  deviceType: text('deviceType').notNull(),
  backedUp: integer('backedUp', {
    mode: 'boolean',
  }).notNull(),
  transports: text('transports'),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }),
});
