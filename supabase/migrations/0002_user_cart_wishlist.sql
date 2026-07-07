-- ============================================================
-- Migracion: carrito y lista de deseos por cuenta
-- Ejecuta este archivo en Supabase (SQL Editor) una sola vez.
-- Crea las tablas para que el carrito y los deseados queden enlazados
-- a la cuenta del usuario y lo sigan en cualquier dispositivo.
-- Es idempotente: se puede correr varias veces sin romper nada.
-- ============================================================

-- Lista de deseos (deseados). Una fila por producto guardado por usuario.
CREATE TABLE IF NOT EXISTS wishlists (
  id                BIGSERIAL   PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id        TEXT        NOT NULL,
  product_name      TEXT        NOT NULL,
  active_ingredient TEXT,
  concentration     TEXT,
  pharmacy          TEXT,
  price             INTEGER     NOT NULL,   -- COP, sin decimales
  reference_price   INTEGER,                -- precio antes de descuento
  type              TEXT,                   -- 'generic' | 'brand'
  url               TEXT,
  image_url         TEXT,
  added_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- Carrito de compra. Misma forma que wishlists.
CREATE TABLE IF NOT EXISTS carts (
  id                BIGSERIAL   PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id        TEXT        NOT NULL,
  product_name      TEXT        NOT NULL,
  active_ingredient TEXT,
  concentration     TEXT,
  pharmacy          TEXT,
  price             INTEGER     NOT NULL,
  reference_price   INTEGER,
  type              TEXT,
  url               TEXT,
  image_url         TEXT,
  added_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists (user_id, added_at DESC);
CREATE INDEX IF NOT EXISTS idx_carts_user     ON carts     (user_id, added_at DESC);

-- ============================================================
-- Seguridad por usuario (RLS): cada quien solo ve y modifica lo suyo.
-- El cliente del navegador usa la anon key; RLS garantiza que un usuario
-- nunca lea ni borre el carrito/lista de otro. Datos personales protegidos.
-- ============================================================

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts     ENABLE ROW LEVEL SECURITY;

-- wishlists: dueno = auth.uid()
DROP POLICY IF EXISTS "own wishlist select" ON wishlists;
CREATE POLICY "own wishlist select" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own wishlist insert" ON wishlists;
CREATE POLICY "own wishlist insert" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own wishlist update" ON wishlists;
CREATE POLICY "own wishlist update" ON wishlists
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own wishlist delete" ON wishlists;
CREATE POLICY "own wishlist delete" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- carts: dueno = auth.uid()
DROP POLICY IF EXISTS "own cart select" ON carts;
CREATE POLICY "own cart select" ON carts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own cart insert" ON carts;
CREATE POLICY "own cart insert" ON carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own cart update" ON carts;
CREATE POLICY "own cart update" ON carts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own cart delete" ON carts;
CREATE POLICY "own cart delete" ON carts
  FOR DELETE USING (auth.uid() = user_id);
