// // src/services/supabaseClient.js
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// HARD FAIL if env is missing (prevents silent bugs)
if (!url || !url.startsWith("http")) {
  throw new Error("Missing/invalid VITE_SUPABASE_URL in .env (must start with https://)");
}
if (!anon) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(url, anon);

// debug (you SHOULD see this in console on refresh)
console.log("✅ Supabase client ready:", url);
