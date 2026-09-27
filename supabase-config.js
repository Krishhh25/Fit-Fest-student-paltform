const SUPABASE_URL =
  "https://ajhqiqigrmntcjtgqtip.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_W-ixsfTGLb6-bhMhnkqH1A_lfiEdI8g";

const scoutSupabase =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );