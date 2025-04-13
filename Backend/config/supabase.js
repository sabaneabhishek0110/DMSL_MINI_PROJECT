// backend/config/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Verify environment variables exist
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error(
    'Supabase URL and Key must be defined in .env file'
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false // Important for server-side usage
    }
  }
);

module.exports = supabase;