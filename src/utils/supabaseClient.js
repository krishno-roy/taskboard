// src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pvzinsisdgunlvqzacfs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2emluc2lzZGd1bmx2cXphY2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjE4MjAsImV4cCI6MjA2MTA5NzgyMH0.Jac2iFRXQlRjG-vheSwoxOTBwRQU7UM0Og6JdpFps2s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
