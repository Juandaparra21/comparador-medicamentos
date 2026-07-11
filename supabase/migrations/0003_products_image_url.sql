-- Agrega la foto real del producto a la tabla products y la expone en la vista
-- search_results, para que "Descuentos destacados" muestre la imagen real en
-- lugar de la ilustracion generica de respaldo.

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE OR REPLACE VIEW search_results WITH (security_invoker = on) AS
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
  p.last_updated        AS "lastUpdated",
  p.image_url           AS "imageUrl"
FROM products p
JOIN pharmacies ph ON ph.id = p.pharmacy_id;
