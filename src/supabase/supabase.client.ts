import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://fqzfpraipzltfkjbadwi.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseKey) {
  // In production you should fail fast or log an error; keep simple warning here
  console.warn('SUPABASE_KEY is not set. Set SUPABASE_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
