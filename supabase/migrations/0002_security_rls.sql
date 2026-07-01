-- ============================================================
-- 0002 — Corrige los ERRORES del linter de seguridad de Supabase
-- ============================================================
-- Problemas reportados:
--   1) rls_disabled_in_public: pharmacies, products, price_history no tienen RLS.
--   2) security_definer_view: la vista search_results corre como SECURITY DEFINER.
--
-- Estas tablas y la vista son del diseno inicial y hoy NO las consulta la app
-- (la busqueda usa los scrapers en vivo). Aun asi las aseguramos para dejar el
-- linter limpio, siguiendo el mismo patron ya usado en price_snapshots:
-- datos publicos de precio -> lectura para todos, escritura solo via service role
-- (rutas de servidor), que ignora RLS.

-- 1) Activar RLS + permitir SOLO lectura publica en las tablas de catalogo/precio.
ALTER TABLE public.pharmacies    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read pharmacies" ON public.pharmacies;
CREATE POLICY "public read pharmacies" ON public.pharmacies FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read products" ON public.products;
CREATE POLICY "public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "public read price_history" ON public.price_history;
CREATE POLICY "public read price_history" ON public.price_history FOR SELECT USING (true);

-- 2) La vista debe correr con los permisos de QUIEN consulta, no de quien la creo,
--    para que respete las politicas RLS de arriba (Postgres 15+).
ALTER VIEW public.search_results SET (security_invoker = on);
