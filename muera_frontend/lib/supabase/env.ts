export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Either name works; Supabase now calls the anon key the "publishable" key.
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
