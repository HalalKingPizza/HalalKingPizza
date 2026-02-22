import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !url.startsWith("http")) {
  throw new Error("Missing/invalid VITE_SUPABASE_URL in .env (must start with https://)");
}
if (!anon) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(url, anon);
console.log("✅ Supabase client ready:", url);
