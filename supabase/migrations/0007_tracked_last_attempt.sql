-- Refresco de precios por lotes.
--
-- El cron de snapshot ahora corre varias veces al dia y cada ejecucion toma los
-- medicamentos "mas viejos" primero. last_snapshot_at solo se actualiza cuando la
-- consulta devuelve precios; si una consulta falla siempre (sin resultados), sin
-- esta columna quedaria de primera en la cola en cada ejecucion y bloquearia al
-- resto. last_attempt_at se marca ANTES de cada intento, exito o no, y es la
-- columna por la que se ordena la cola.
--
-- Cambio aditivo y compatible: el codigo anterior simplemente la ignora.

ALTER TABLE public.tracked_medications
  ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_tracked_medications_last_attempt
  ON public.tracked_medications (last_attempt_at NULLS FIRST);
