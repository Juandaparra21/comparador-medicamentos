// Public Supabase config — anon key is intentionally safe to expose in client code.
// Override via NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel env vars.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://rcjidvjbybbtutfeerzk.supabase.co'

export const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjamlkdmpieWJidHV0ZmVlcnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzOTAyODAsImV4cCI6MjA5Njk2NjI4MH0.GtLLcTGS3zMvf7nhGkosUuiia0D_WjV-UjOEI_FmNYE'
