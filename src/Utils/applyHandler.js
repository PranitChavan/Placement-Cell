import { supabase } from '../Config/supabase.client';
import { hasStudentFilledTheForm } from './helpers';
import TopLoaderService from 'top-loader-service';
import 'top-loader-service/TopLoaderService.css';

// TODOS
// If job post is deleted then student should not be able to apply

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
