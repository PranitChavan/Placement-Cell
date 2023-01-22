import { supabase } from '../Config/supabase.client';

export async function hasStudentFilledTheForm(currentUser) {
  const { data, error } = await supabase.from('Student_Details').select('name').eq('student_id', currentUser.uid);

  if (error) return 'ERROR';
  if (!data.length) return 'NOT_FILLED';
  if (data.length) return 'FILLED';
}

export async function getJobDetails(jobId) {
  const { data, error } = await supabase.from('Job_Posts').select('*').eq('post_id', jobId);
  return data;
}
