import { supabase } from '../../Config/supabase.client';
import TopLoaderService from 'top-loader-service';
import 'top-loader-service/TopLoaderService.css';

export async function createPostRecord([formData, currentUser]) {
  TopLoaderService.start();
  let { description, company_name, job_title, location, skills_required, post_id: id, department_id } = formData;

  const { data, error } = await supabase
    .from('Job_Posts')
    .insert({
      post_id: id,
      teacher_id: currentUser.uid,
      description,
      company_name,
      job_title,
      location,
      skills_required,
      department_id,
    })
    .select();

  if (error) {
    TopLoaderService.end();
    alert('Failed to create post... please re-login and try again.');
    throw new Error('Failed to create post!');
  }

  TopLoaderService.end();

  return data;
}
