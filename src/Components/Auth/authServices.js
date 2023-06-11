import { supabase } from '../../Config/supabase.client';

export async function createUser(user, accountType) {
  if (accountType === 'Teacher') {
    const { error } = await supabase
      .from('Teachers')
      .insert({ teacher_id: user.uid, name: user.displayName, email: user.email, profile_picture: user.photoURL });

    if (error && error.code !== '23505')
      alert('Failed to create user! Please logout and login again before performing any actions.');
  } else {
    const { error } = await supabase
      .from('Students')
      .insert({ student_id: user.uid, name: user.displayName, email: user.email, profile_picture: user.photoURL });

    if (error && error.code !== '23505')
      alert('Failed to create user! Please logout and login again before performing any actions.');
  }
}
