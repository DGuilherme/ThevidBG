-- =============================================================================
-- BoardGameHub — PostgreSQL Schema (Coolify self-hosted)
-- Run against the Coolify PostgreSQL instance before first deploy.
-- Generate fresh migration files with: npx drizzle-kit generate
-- Push directly to DB with: npx drizzle-kit push
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "users" (
  "id"            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "email"         TEXT        NOT NULL UNIQUE,
  "password_hash" TEXT        NOT NULL,
  "username"      TEXT        UNIQUE,
  "avatar_url"    TEXT,
  "is_premium"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "games_collection" (
  "id"             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"        UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "bgg_id"         INTEGER     NOT NULL,
  "title"          TEXT        NOT NULL,
  "image_url"      TEXT,
  "thumbnail_url"  TEXT,
  "min_players"    SMALLINT,
  "max_players"    SMALLINT,
  "play_time"      SMALLINT,
  "year_published" SMALLINT,
  "rating"         REAL,
  "bgg_rating"     REAL,
  "shelf_of_shame" BOOLEAN     NOT NULL DEFAULT FALSE,
  "status"         TEXT        NOT NULL DEFAULT 'owned'
                               CHECK ("status" IN ('owned', 'previously_owned', 'for_trade', 'want_to_buy')),
  "added_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "uq_user_bgg_game" UNIQUE ("user_id", "bgg_id")
);

CREATE TABLE IF NOT EXISTS "players" (
  "id"           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"      UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name"         TEXT        NOT NULL,
  "avatar_url"   TEXT,
  "is_anonymous" BOOLEAN     NOT NULL DEFAULT FALSE,
  "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "match_logs" (
  "id"               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"          UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "game_id"          UUID        NOT NULL REFERENCES "games_collection"("id") ON DELETE RESTRICT,
  "date"             DATE        NOT NULL DEFAULT CURRENT_DATE,
  "duration_minutes" SMALLINT,
  "notes"            TEXT,
  "location"         TEXT,
  "created_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "match_players" (
  "match_id"  UUID     NOT NULL REFERENCES "match_logs"("id")  ON DELETE CASCADE,
  "player_id" UUID     NOT NULL REFERENCES "players"("id")     ON DELETE RESTRICT,
  "score"     INTEGER,
  "is_winner" BOOLEAN  NOT NULL DEFAULT FALSE,
  "position"  SMALLINT,

  PRIMARY KEY ("match_id", "player_id")
);

CREATE TABLE IF NOT EXISTS "wishlist" (
  "id"            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"       UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "bgg_id"        INTEGER     NOT NULL,
  "title"         TEXT        NOT NULL,
  "image_url"     TEXT,
  "thumbnail_url" TEXT,
  "priority"      SMALLINT    NOT NULL DEFAULT 3 CHECK ("priority" BETWEEN 1 AND 5),
  "notes"         TEXT,
  "added_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "uq_user_bgg_wishlist" UNIQUE ("user_id", "bgg_id")
);

-- =============================================================================
-- Migration 001 — 2026-05-28: link players to user accounts
-- Run on existing Coolify PostgreSQL instance.
-- =============================================================================
ALTER TABLE "players" ADD COLUMN IF NOT EXISTS "linked_user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE "players" ADD COLUMN IF NOT EXISTS "email" TEXT;
CREATE INDEX IF NOT EXISTS "idx_players_email" ON "players" ("email");

-- Indexes
CREATE INDEX IF NOT EXISTS "idx_games_collection_user_id" ON "games_collection" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_games_collection_bgg_id"  ON "games_collection" ("bgg_id");
CREATE INDEX IF NOT EXISTS "idx_match_logs_user_id"       ON "match_logs"       ("user_id");
CREATE INDEX IF NOT EXISTS "idx_match_logs_game_id"       ON "match_logs"       ("game_id");
CREATE INDEX IF NOT EXISTS "idx_match_logs_date"          ON "match_logs"       ("date" DESC);
CREATE INDEX IF NOT EXISTS "idx_match_players_player_id"  ON "match_players"    ("player_id");
CREATE INDEX IF NOT EXISTS "idx_players_user_id"          ON "players"          ("user_id");
CREATE INDEX IF NOT EXISTS "idx_wishlist_user_id"         ON "wishlist"         ("user_id");

-- Views
CREATE OR REPLACE VIEW "v_player_stats" AS
SELECT
  p."id"                                                    AS player_id,
  p."user_id",
  p."name",
  COUNT(mp."match_id")                                      AS total_matches,
  COUNT(mp."match_id") FILTER (WHERE mp."is_winner" = TRUE) AS wins,
  ROUND(
    COUNT(mp."match_id") FILTER (WHERE mp."is_winner" = TRUE)::NUMERIC
    / NULLIF(COUNT(mp."match_id"), 0) * 100, 1
  )                                                         AS win_rate_pct
FROM "players" p
LEFT JOIN "match_players" mp ON mp."player_id" = p."id"
GROUP BY p."id";
