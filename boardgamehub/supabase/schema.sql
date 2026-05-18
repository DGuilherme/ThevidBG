-- =============================================================================
-- BoardGameHub — Supabase PostgreSQL Schema
-- Run this script in the Supabase SQL Editor (Project > SQL Editor > New query)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

-- Users (extends Supabase auth.users; trigger creates row on signup)
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL UNIQUE,
  username    TEXT        UNIQUE,
  avatar_url  TEXT,
  is_premium  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Public profile data, linked 1-1 to auth.users';
COMMENT ON COLUMN public.users.is_premium IS 'Unlocks premium features; managed by webhook from payment provider';


-- Board games in a user''s owned collection
CREATE TABLE IF NOT EXISTS public.games_collection (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bgg_id          INTEGER     NOT NULL,
  title           TEXT        NOT NULL,
  image_url       TEXT,
  thumbnail_url   TEXT,
  min_players     SMALLINT,
  max_players     SMALLINT,
  play_time       SMALLINT,                -- in minutes (BGG "playingtime")
  year_published  SMALLINT,
  rating          NUMERIC(3,1),            -- user''s personal 1–10 rating
  bgg_rating      NUMERIC(4,2),            -- BGG community average at import time
  shelf_of_shame  BOOLEAN     NOT NULL DEFAULT FALSE,
  status          TEXT        NOT NULL DEFAULT 'owned'
                              CHECK (status IN ('owned', 'previously_owned', 'for_trade', 'want_to_buy')),
  added_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_user_bgg_game UNIQUE (user_id, bgg_id)
);

COMMENT ON COLUMN public.games_collection.shelf_of_shame IS 'TRUE when game is owned but has never been played';
COMMENT ON COLUMN public.games_collection.status         IS 'Ownership status of the physical copy';


-- People who play at the table (can include the owner themselves)
CREATE TABLE IF NOT EXISTS public.players (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  avatar_url   TEXT,
  is_anonymous BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN public.players.is_anonymous IS 'Quick "guest" player without a profile';


-- A single play-session of a game
CREATE TABLE IF NOT EXISTS public.match_logs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  game_id          UUID        NOT NULL REFERENCES public.games_collection(id) ON DELETE RESTRICT,
  date             DATE        NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes SMALLINT,
  notes            TEXT,
  location         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN public.match_logs.game_id IS 'RESTRICT prevents deleting a game that has play history';


-- Per-player result within a match
CREATE TABLE IF NOT EXISTS public.match_players (
  match_id   UUID     NOT NULL REFERENCES public.match_logs(id) ON DELETE CASCADE,
  player_id  UUID     NOT NULL REFERENCES public.players(id)    ON DELETE RESTRICT,
  score      INTEGER,
  is_winner  BOOLEAN  NOT NULL DEFAULT FALSE,
  position   SMALLINT,                       -- finishing rank (1 = 1st place)

  PRIMARY KEY (match_id, player_id)
);


-- Games the user wants to acquire
CREATE TABLE IF NOT EXISTS public.wishlist (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bgg_id        INTEGER     NOT NULL,
  title         TEXT        NOT NULL,
  image_url     TEXT,
  thumbnail_url TEXT,
  priority      SMALLINT    NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  notes         TEXT,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_user_bgg_wishlist UNIQUE (user_id, bgg_id)
);

COMMENT ON COLUMN public.wishlist.priority IS '1 = highest priority, 5 = lowest';


-- ---------------------------------------------------------------------------
-- INDEXES  (beyond primary keys; FKs are indexed automatically by Postgres on PK side)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_games_collection_user_id   ON public.games_collection (user_id);
CREATE INDEX IF NOT EXISTS idx_games_collection_bgg_id    ON public.games_collection (bgg_id);
CREATE INDEX IF NOT EXISTS idx_match_logs_user_id         ON public.match_logs       (user_id);
CREATE INDEX IF NOT EXISTS idx_match_logs_game_id         ON public.match_logs       (game_id);
CREATE INDEX IF NOT EXISTS idx_match_logs_date            ON public.match_logs       (date DESC);
CREATE INDEX IF NOT EXISTS idx_match_players_player_id    ON public.match_players    (player_id);
CREATE INDEX IF NOT EXISTS idx_players_user_id            ON public.players          (user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id           ON public.wishlist         (user_id);


-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------
ALTER TABLE public.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_players    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist         ENABLE ROW LEVEL SECURITY;

-- users: each user sees and edits only their own row
CREATE POLICY "users_select_own"  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"  ON public.users FOR UPDATE USING (auth.uid() = id);

-- games_collection
CREATE POLICY "collection_select_own" ON public.games_collection FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "collection_insert_own" ON public.games_collection FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "collection_update_own" ON public.games_collection FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "collection_delete_own" ON public.games_collection FOR DELETE USING (auth.uid() = user_id);

-- players
CREATE POLICY "players_select_own" ON public.players FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "players_insert_own" ON public.players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "players_update_own" ON public.players FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "players_delete_own" ON public.players FOR DELETE USING (auth.uid() = user_id);

-- match_logs
CREATE POLICY "matches_select_own" ON public.match_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "matches_insert_own" ON public.match_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "matches_update_own" ON public.match_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "matches_delete_own" ON public.match_logs FOR DELETE USING (auth.uid() = user_id);

-- match_players: access via the parent match_logs row
CREATE POLICY "match_players_select_own" ON public.match_players FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.match_logs ml WHERE ml.id = match_id AND ml.user_id = auth.uid()));
CREATE POLICY "match_players_insert_own" ON public.match_players FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.match_logs ml WHERE ml.id = match_id AND ml.user_id = auth.uid()));
CREATE POLICY "match_players_update_own" ON public.match_players FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.match_logs ml WHERE ml.id = match_id AND ml.user_id = auth.uid()));
CREATE POLICY "match_players_delete_own" ON public.match_players FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.match_logs ml WHERE ml.id = match_id AND ml.user_id = auth.uid()));

-- wishlist
CREATE POLICY "wishlist_select_own" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert_own" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_update_own" ON public.wishlist FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "wishlist_delete_own" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);


-- ---------------------------------------------------------------------------
-- TRIGGER: auto-create public.users row on auth.users signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ---------------------------------------------------------------------------
-- USEFUL VIEWS (read-only; safe under RLS)
-- ---------------------------------------------------------------------------

-- Shelf of shame: owned games with 0 plays
CREATE OR REPLACE VIEW public.v_shelf_of_shame AS
SELECT
  gc.*,
  0 AS total_plays
FROM public.games_collection gc
WHERE gc.shelf_of_shame = TRUE;

-- Per-player win stats
CREATE OR REPLACE VIEW public.v_player_stats AS
SELECT
  p.id                                                   AS player_id,
  p.user_id,
  p.name,
  COUNT(mp.match_id)                                     AS total_matches,
  COUNT(mp.match_id) FILTER (WHERE mp.is_winner = TRUE)  AS wins,
  ROUND(
    COUNT(mp.match_id) FILTER (WHERE mp.is_winner = TRUE)::NUMERIC
    / NULLIF(COUNT(mp.match_id), 0) * 100, 1
  )                                                      AS win_rate_pct
FROM public.players p
LEFT JOIN public.match_players mp ON mp.player_id = p.id
GROUP BY p.id;
