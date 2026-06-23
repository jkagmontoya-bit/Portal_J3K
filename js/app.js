const SUPABASE_URL = "https://ssbsfqpujqjowrkbyntv.supabase.co";

const SUPABASE_KEY = "sb_publishable_HSEG5YV7SPPmtePuHkx_Pw_56b9Ukw-";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Cliente Supabase listo");