import { supabase } from '../../../Config/supabase.client';
import { checkIfStudentHasAlreadyApplied } from '../../../Utils/helpers';

export async function deleteJobPost(currentUser, id) {
  const { data, error } = await supabase
    .from('Job_Posts')
    .update({ deleted_by: currentUser.uid })
    .eq('post_id', id)
    .select();

  if (error) {
    alert('Failed to delete, please try again!');
    throw new Error('Failed!');
  }

  await supabase.from('Student_Applications').delete().eq('post_id', id);

  await supabase.from('Placed_Students').delete().eq('job_id', id);

  await supabase.from('Job_Status').delete().eq('post_id', id);
}

export async function fetchData(currentUser, accountType, departmentData) {
  const depts = departmentData.map((dept) => dept.department_id);

  let { data, error } = await supabase.rpc('get_job_posts', {
    department_ids: depts,
  });

  if (error) throw new Error('Failed');

  if (accountType === 'Teacher') return data; // No need to check if students have already applied if account type is teacher

  const postsData = await checkIfStudentHasAlreadyApplied(data, currentUser);

  return postsData;
}

export function updatePostsOnUI(data, id) {
  return data.filter((d) => d.post_id !== id);
}

export function updateTagsOnPost(postsData, postId, operation) {
  const postIndex = postsData.findIndex((post) => post.post_id === postId);
  if (postIndex === -1) {
    return postsData;
  }

  const updatedPost = { ...postsData[postIndex], alreadyApplied: operation === 'APPLY' };
  const updated = [...postsData];
  updated[postIndex] = updatedPost;

  return updated;
}
