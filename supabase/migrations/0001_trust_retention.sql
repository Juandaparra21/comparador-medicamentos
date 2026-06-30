-- ============================================================
-- Migracion: confianza y retencion
-- Ejecuta este archivo en Supabase (SQL Editor) una sola vez.
-- Crea las tablas para:
--   1) estadisticas reales de busquedas (barra de prueba social)
--   2) alertas de bajada de precio (retencion)
-- Es idempotente: se puede correr varias veces sin romper nada.
-- ============================================================

-- Registro de cada busqueda realizada. Alimenta /api/stats (totalSearches).
CREATE TABLE IF NOT EXISTS search_events (
  id         BIGSERIAL   PRIMARY KEY,
  query      TEXT        NOT NULL,           -- normalizado: minusculas, sin acentos
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_events_created ON search_events (created_at);
CREATE INDEX IF NOT EXISTS idx_search_events_query   ON search_events (query);

-- Alertas de bajada de precio. El usuario deja UN canal (email o WhatsApp).
CREATE TABLE IF NOT EXISTS price_alerts (
  id            BIGSERIAL   PRIMARY KEY,
  query         TEXT        NOT NULL,        -- normalizado: minusculas, sin acentos
  label         TEXT        NOT NULL,        -- texto legible (consulta original)
  current_price INTEGER,                     -- COP, precio mas bajo al crear la alerta
  channel       TEXT        NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  contact       TEXT        NOT NULL,        -- email o numero de WhatsApp
  notified      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_pending
  ON price_alerts (query) WHERE notified = FALSE;

-- Privadas: solo el service role (rutas de servidor) escribe/lee.
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts  ENABLE ROW LEVEL SECURITY;
