-- Pasteur y Farmacenter se agregaron como fuente hace dias pero nunca
-- tuvieron fila en pharmacies: sin ella, harvestDiscounts() no podia insertar
-- sus ofertas (violaria la FK products.pharmacy_id -> pharmacies.id), asi que
-- sus descuentos nunca entraban al pool destacado. Se agrega tambien
-- Drogueria Alemana (grupo Unidrogas), nueva fuente via VTEX.

INSERT INTO pharmacies (id, name, website) VALUES
  ('pasteur',     'Farmacia Pasteur',   'https://www.farmaciaspasteur.com.co'),
  ('farmacenter', 'Farmacenter',        'https://www.farmaexpress.com'),
  ('alemana',     'Drogueria Alemana',  'https://www.tudrogueriavirtual.com')
ON CONFLICT (id) DO NOTHING;
