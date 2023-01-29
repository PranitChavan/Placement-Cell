import { supabase } from '../Config/supabase.client';
import { hasStudentFilledTheForm } from './misc';

// TODOS
// If job post is deleted then student should not be able to apply

export async function applyHandler(postId, currentUser) {
  const formFilled = await hasStudentFilledTheForm(currentUser);

  if (formFilled === 'ERROR') {
    alert('Something went wrong! Please try again.');
    return;
  }

  if (formFilled === 'NOT_FILLED') {
    alert('Please fill the form before applying for this job!');
    return;
  }

  const { data: alreadyApplied, error: alreadyAppliedErr } = await supabase
    .from('Student_Applications')
    .select('student_id')
    .match({ student_id: currentUser.uid, post_id: postId, status: 'Active' });

  if (alreadyAppliedErr) {
    alert('Failed! Please try again!');
    return;
  }

  if (alreadyApplied && alreadyApplied.length > 0) {
    alert('You have already applied for this job!');
    return;
  }

  const { data, error } = await supabase
    .from('Student_Applications')
    .insert({ id: Date.now().toString(), student_id: currentUser.uid, post_id: postId, status: 'Active' });

  if (error) {
    alert('Not Applied! Please try again!');
    return;
  }

  alert('Your Application has been sent!');
}
