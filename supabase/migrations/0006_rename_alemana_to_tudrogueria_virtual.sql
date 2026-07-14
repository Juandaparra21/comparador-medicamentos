-- Correccion: tudrogueriavirtual.com NO es la tienda propia de Drogueria
-- Alemana. Es el portal compartido de UNIDROGAS S.A.S, que agrupa varias
-- droguerias aliadas (Alemana, Andina, Botica, Drogueria Inglesa, Ahorro
-- Droguerias...). Mostrar sus precios como si fueran solo de "Drogueria
-- Alemana" era inexacto (el usuario que compra termina en un checkout que se
-- identifica como "Tu Drogueria Virtual", no como Alemana). Se renombra la
-- fuente para reflejar quien es en realidad.

INSERT INTO pharmacies (id, name, website) VALUES
  ('tudrogueria-virtual', 'Tu Drogueria Virtual', 'https://www.tudrogueriavirtual.com')
ON CONFLICT (id) DO NOTHING;

UPDATE products SET pharmacy_id = 'tudrogueria-virtual' WHERE pharmacy_id = 'alemana';

DELETE FROM pharmacies WHERE id = 'alemana';
