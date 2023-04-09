import { supabase } from '../../Config/supabase.client';

export async function fetchLimitedStudents() {
  const { data, error } = await supabase.from('Students').select();
  if (error) throw new Error('Failed');

  return data;
}

export async function searchStudents(search_text) {
  if (search_text === '') return [];
  let { data, error } = await supabase.rpc('search_students', {
    search_text,
  });

  if (error) throw new Error('Failed');

  return data;
}

export async function fetchJobsAppliedForEachStudent(studentId) {
  let { data, error } = await supabase.rpc('getspecificstudentapplications', {
    p_student_id: studentId,
  });

  if (error) throw new Error('Failed');

  return data;
}
