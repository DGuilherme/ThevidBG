import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  smallint,
  real,
  date,
  primaryKey,
  unique,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  username: text('username').unique(),
  avatar_url: text('avatar_url'),
  is_premium: boolean('is_premium').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const games_collection = pgTable(
  'games_collection',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    bgg_id: integer('bgg_id').notNull(),
    title: text('title').notNull(),
    image_url: text('image_url'),
    thumbnail_url: text('thumbnail_url'),
    min_players: smallint('min_players'),
    max_players: smallint('max_players'),
    play_time: smallint('play_time'),
    year_published: smallint('year_published'),
    rating: real('rating'),
    bgg_rating: real('bgg_rating'),
    shelf_of_shame: boolean('shelf_of_shame').notNull().default(false),
    status: text('status', {
      enum: ['owned', 'previously_owned', 'for_trade', 'want_to_buy'],
    })
      .notNull()
      .default('owned'),
    added_at: timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_user_bgg_game').on(t.user_id, t.bgg_id)]
)

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  avatar_url: text('avatar_url'),
  is_anonymous: boolean('is_anonymous').notNull().default(false),
  linked_user_id: uuid('linked_user_id').references(() => users.id, { onDelete: 'set null' }),
  email: text('email'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const match_logs = pgTable('match_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  game_id: uuid('game_id')
    .notNull()
    .references(() => games_collection.id, { onDelete: 'restrict' }),
  date: date('date').notNull().defaultNow(),
  duration_minutes: smallint('duration_minutes'),
  notes: text('notes'),
  location: text('location'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const match_players = pgTable(
  'match_players',
  {
    match_id: uuid('match_id')
      .notNull()
      .references(() => match_logs.id, { onDelete: 'cascade' }),
    player_id: uuid('player_id')
      .notNull()
      .references(() => players.id, { onDelete: 'restrict' }),
    score: integer('score'),
    is_winner: boolean('is_winner').notNull().default(false),
    position: smallint('position'),
  },
  (t) => [primaryKey({ columns: [t.match_id, t.player_id] })]
)

export const wishlist = pgTable(
  'wishlist',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    bgg_id: integer('bgg_id').notNull(),
    title: text('title').notNull(),
    image_url: text('image_url'),
    thumbnail_url: text('thumbnail_url'),
    priority: smallint('priority').notNull().default(3),
    notes: text('notes'),
    added_at: timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('uq_user_bgg_wishlist').on(t.user_id, t.bgg_id)]
)

// Inferred types
export type User = Omit<typeof users.$inferSelect, 'password_hash'>
export type NewUser = typeof users.$inferInsert
export type GameCollection = typeof games_collection.$inferSelect
export type NewGameCollection = typeof games_collection.$inferInsert
export type Player = typeof players.$inferSelect
export type NewPlayer = typeof players.$inferInsert
export type MatchLog = typeof match_logs.$inferSelect
export type NewMatchLog = typeof match_logs.$inferInsert
export type MatchPlayer = typeof match_players.$inferSelect
export type NewMatchPlayer = typeof match_players.$inferInsert
export type WishlistItem = typeof wishlist.$inferSelect
export type NewWishlistItem = typeof wishlist.$inferInsert
