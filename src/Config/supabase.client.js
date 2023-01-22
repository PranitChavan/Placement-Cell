import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://ujeiwlvvlzxwdiaiupvj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZWl3bHZ2bHp4d2RpYWl1cHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM2MTU3MTUsImV4cCI6MTk4OTE5MTcxNX0.bTsEQ7tQcuv3jKgYSo77GIePcjny3onerI6loBd6d8s'
);
