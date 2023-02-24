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

  if (applicationsForCurrentUser.length > 0) {
    return { ...post, alreadyApplied: true };
  } else {
    return { ...post, alreadyApplied: false };
  }
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

export async function deleteApplicant([studentId, postId, setConfirmDialog]) {
  setConfirmDialog({
    isOpen: false,
  });

  const { data, error } = await supabase
    .from('Student_Applications')
    .delete()
    .match({ student_id: studentId, post_id: postId });

  if (error) {
    alert('Something went wrong. Please try again!');
  }
}
