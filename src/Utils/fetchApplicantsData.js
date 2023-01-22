import { supabase } from '../Config/supabase.client';

export async function fetchApplicantsData(jobid) {
  let { data, error } = await supabase.rpc('getapplicants', {
    jobid,
  });

  if (error) return [];
  return data;
}
