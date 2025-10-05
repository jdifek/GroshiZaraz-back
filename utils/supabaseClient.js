const { createClient } = require("@supabase/supabase-js");

// ⚠️ Эти переменные возьми из настроек Supabase (Project Settings → API)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Не заданы SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY в .env");
}

// Создаём клиент
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = { supabase };
