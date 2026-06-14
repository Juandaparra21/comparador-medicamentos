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
