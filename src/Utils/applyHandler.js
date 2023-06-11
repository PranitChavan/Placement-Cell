import { supabase } from '../Config/supabase.client';
import { hasStudentFilledTheForm } from './helpers';
import TopLoaderService from 'top-loader-service';
import 'top-loader-service/TopLoaderService.css';

// TODOS
// If job post is deleted then student should not be able to apply

function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

async function getPrevAppliedJobs(currentUser) {
  const { data, error } = await supabase.from('Student_Applications').select().eq('student_id', currentUser.uid);

  const filtered = data.filter((d) => {
    return dateDiffInDays(new Date(d.created_at), new Date()) > 2;
  });

  const jobsWhichStatusAreNotUpdated = [];

  filtered.forEach(async (d) => {
    const { data, error } = await supabase
      .from('Job_Status')
      .select()
      .eq('student_id', currentUser.uid)
      .eq('post_id', d.post_id);

    jobsWhichStatusAreNotUpdated.push(...data);
  });
}

export async function applyHandler(postId, currentUser) {
  TopLoaderService.start();
  const formFilled = await hasStudentFilledTheForm(currentUser);

  if (formFilled === 'ERROR') {
    alert('Something went wrong! Please try again.');
    TopLoaderService.end();
    throw new Error('Something went wrong! Please try again.');
  }

  if (formFilled === 'NOT_FILLED') {
    alert('Please fill the form before applying for this job!');
    TopLoaderService.end();
    throw new Error('Form not Filled!');
  }

  await getPrevAppliedJobs(currentUser);

  const { data, error } = await supabase
    .from('Student_Applications')
    .insert({ id: Date.now().toString(), student_id: currentUser.uid, post_id: postId, status: 'Active' });

  if (error) {
    alert('Not Applied! Please try again!');
    TopLoaderService.end();
    throw new Error('Not Applied! Please try again!');
  }

  TopLoaderService.end();

  // alert('Applied!');
}
