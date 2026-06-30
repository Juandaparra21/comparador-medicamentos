-- ============================================================
-- MediCompara — Schema Supabase
-- ============================================================

-- Farmacias soportadas
CREATE TABLE IF NOT EXISTS pharmacies (
  id   TEXT PRIMARY KEY,   -- 'cruz-verde', 'la-rebaja', etc.
  name TEXT NOT NULL,
  website TEXT
);

INSERT INTO pharmacies (id, name, website) VALUES
  ('cruz-verde',    'Cruz Verde',         'https://www.cruzverde.com.co'),
  ('la-rebaja',     'Drogas La Rebaja',   'https://www.drogueriaslacosta.com.co'),
  ('colsubsidio',   'Colsubsidio',        'https://www.colsubsidio.com'),
  ('cafam',         'Cafam',              'https://www.cafam.com.co'),
  ('farmatodo',     'Farmatodo',          'https://www.farmatodo.com.co'),
  ('olimpica',      'Olimpica Drogueria', 'https://www.olimpica.com')
ON CONFLICT (id) DO NOTHING;

-- Productos tal como los reporta cada farmacia
CREATE TABLE IF NOT EXISTS products (
  id              BIGSERIAL PRIMARY KEY,
  pharmacy_id     TEXT        NOT NULL REFERENCES pharmacies(id),
  product_name    TEXT        NOT NULL,
  type            TEXT        NOT NULL CHECK (type IN ('brand', 'generic')),
  active_ingredient TEXT      NOT NULL,
  concentration   TEXT,
  presentation    TEXT,
  quantity        INTEGER,
  price           INTEGER     NOT NULL,   -- COP, sin decimales
  price_per_unit  INTEGER,
  reference_price INTEGER,                -- precio antes de descuento
  discount_pct    INTEGER,                -- % de descuento
  availability    TEXT        NOT NULL DEFAULT 'available'
                              CHECK (availability IN ('available', 'limited', 'unavailable')),
  url             TEXT,
  last_updated    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pharmacy_id, product_name, concentration)
);

-- Historial de precios para grafica de evolucion
CREATE TABLE IF NOT EXISTS price_history (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price       INTEGER     NOT NULL,
  scraped_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices para busqueda rapida
CREATE INDEX IF NOT EXISTS idx_products_ingredient
  ON products (lower(active_ingredient));

CREATE INDEX IF NOT EXISTS idx_products_pharmacy
  ON products (pharmacy_id);

CREATE INDEX IF NOT EXISTS idx_price_history_product
  ON price_history (product_id, scraped_at DESC);

-- ============================================================
-- Rastreo de precios (historial real construido dia a dia)
-- ============================================================

-- Medicamentos que un usuario pidio rastrear. Alimenta el cron diario.
CREATE TABLE IF NOT EXISTS tracked_medications (
  query            TEXT PRIMARY KEY,           -- normalizado: minusculas, sin acentos
  label            TEXT NOT NULL,              -- texto legible (consulta original)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_snapshot_at TIMESTAMPTZ
);

-- Un precio real por farmacia, por medicamento rastreado, por dia.
-- Es el repositorio de datos que construimos nosotros (sin precios simulados).
CREATE TABLE IF NOT EXISTS price_snapshots (
  id           BIGSERIAL PRIMARY KEY,
  query        TEXT    NOT NULL REFERENCES tracked_medications(query) ON DELETE CASCADE,
  pharmacy     TEXT    NOT NULL,
  product_name TEXT,
  price        INTEGER NOT NULL,
  day          DATE    NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (query, pharmacy, day)
);

CREATE INDEX IF NOT EXISTS idx_price_snapshots_query_day
  ON price_snapshots (query, day);

-- Datos publicos de precio: lectura para todos; escritura solo via service key
-- (rutas de servidor) que ignora RLS.
ALTER TABLE tracked_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_snapshots     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read tracked_medications" ON tracked_medications;
CREATE POLICY "public read tracked_medications" ON tracked_medications FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read price_snapshots" ON price_snapshots;
CREATE POLICY "public read price_snapshots" ON price_snapshots FOR SELECT USING (true);

-- Vista util para el API de busqueda (reemplaza MOCK_DATA)
CREATE OR REPLACE VIEW search_results AS
SELECT
  p.id::TEXT            AS id,
  ph.name               AS pharmacy,
  p.product_name        AS "productName",
  p.type,
  p.active_ingredient   AS "activeIngredient",
  p.concentration,
  p.presentation,
  p.quantity,
  p.price,
  p.price_per_unit      AS "pricePerUnit",
  p.reference_price     AS "referencePrice",
  p.discount_pct        AS discount,
  p.availability,
  p.url,
  p.last_updated        AS "lastUpdated"
FROM products p
JOIN pharmacies ph ON ph.id = p.pharmacy_id;

-- ============================================================
-- Confianza y retencion (busquedas reales + alertas de precio)
-- ============================================================

-- Registro de cada busqueda realizada. Alimenta la barra de estadisticas
-- reales (numero de busquedas). Sin datos personales: solo el termino y la fecha.
CREATE TABLE IF NOT EXISTS search_events (
  id         BIGSERIAL   PRIMARY KEY,
  query      TEXT        NOT NULL,           -- normalizado: minusculas, sin acentos
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_events_created ON search_events (created_at);
CREATE INDEX IF NOT EXISTS idx_search_events_query   ON search_events (query);

-- Alertas de bajada de precio. El usuario deja UN canal (email o WhatsApp).
-- Guardamos el precio actual para comparar contra futuros snapshots y avisar.
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

-- Alertas pendientes por medicamento (las que aun no se han avisado).
CREATE INDEX IF NOT EXISTS idx_price_alerts_pending
  ON price_alerts (query) WHERE notified = FALSE;

-- Ambas tablas son privadas: solo el service role (rutas de servidor) escribe/lee.
-- Sin politicas publicas => el cliente anon no puede leer datos de contacto.
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts  ENABLE ROW LEVEL SECURITY;
