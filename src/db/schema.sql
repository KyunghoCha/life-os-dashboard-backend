PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  tier TEXT NOT NULL,
  level INTEGER NOT NULL,
  xp INTEGER NOT NULL,
  xp_target INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bugs (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'med', 'low')),
  status TEXT NOT NULL CHECK (status IN ('open', 'resolved')),
  created_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('self', 'partner')),
  label TEXT NOT NULL,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS xp_events (
  id TEXT PRIMARY KEY,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('bug', 'goal', 'manual')),
  source_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_advice (
  topic TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  is_static INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vault_items (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS coop_profiles (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  tier TEXT NOT NULL,
  anniversary TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
