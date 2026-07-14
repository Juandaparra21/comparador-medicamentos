-- Estado interno de la app (clave/valor). Primer uso: candado antiduplicados
-- de la historia diaria de Instagram (key = 'ig_story_last_seed').
-- Solo la escribe el servidor con service role; RLS activo sin politicas
-- bloquea cualquier acceso con la anon key.

CREATE TABLE IF NOT EXISTS app_state (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;
