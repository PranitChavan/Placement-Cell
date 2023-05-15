import { supabase } from '../Config/supabase.client';

export async function hasStudentFilledTheForm(currentUser) {
  const { data, error } = await supabase.from('Student_Details').select('name').eq('student_id', currentUser.uid);

  if (error) throw new Error('Error!');
  if (!data.length) return 'NOT_FILLED';
  if (data.length) return 'FILLED';
}

export async function getJobDetails(jobId) {
  const { data, error } = await supabase.from('Job_Posts').select('*').eq('post_id', jobId);
  if (error) return [];
  return data;
}

export const modifyDataIfStudentAlreadyApplied = async (post, currentUser, studentApplications) => {
  const applicationsForCurrentUser = studentApplications.filter(
    (application) => application.student_id === currentUser.uid && application.post_id === post.post_id
  );

  return { ...post, alreadyApplied: applicationsForCurrentUser.length > 0 };
};

export const getAppliedJobsOfASpecificStudent = async (currentUser) => {
  const { data, error } = await supabase.from('Student_Applications').select().match({ student_id: currentUser.uid });

  if (error) return null;

  return data;
};

export const checkIfStudentHasAlreadyApplied = async (postsData, currentUser) => {
  const data = await getAppliedJobsOfASpecificStudent(currentUser);

  if (!data) return postsData;

  const modifiedData = await Promise.all(
    postsData.map((post) => modifyDataIfStudentAlreadyApplied(post, currentUser, data))
  );

  return modifiedData;
};

export async function deleteApplicant([studentId, postId]) {
  const { data, error } = await supabase
    .from('Student_Applications')
    .delete()
    .match({ student_id: studentId, post_id: postId });

  if (error) {
    alert('Something went wrong. Please try again!');
    throw new Error('Failed');
  }
}

export async function accountType(user) {
  const { data: isTeacher, error } = await supabase.from('Roles').select('id').eq('id', user?.uid);

  if (error) throw new Error('Failed!');
  return isTeacher?.length > 0 ? 'Teacher' : 'Student';
}
