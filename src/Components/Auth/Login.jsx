import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Config/supabase.client';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../../Config/firebaseCfg';
import { useAccountType } from '../../Hooks/useAccountType';
import StandardButton from '../UI/Buttons/Button';
import { useAuth } from '../../Context/AuthContext';

const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);

export default function Login() {
  const { currentUser } = useAuth();
  const [accountType, isLoading] = useAccountType(currentUser);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signInWithGoogleAndSaveData() {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      navigate('/Dashboard');
      createUser(res.user);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  if (isLoading) {
    return <h1>Wait</h1>;
  }

  async function createUser(user) {
    if (accountType === 'Teacher') {
      const { error } = await supabase
        .from('Teachers')
        .insert({ teacher_id: user.uid, name: user.displayName, email: user.email, profile_picture: user.photoURL });

      if (error) alert('Failed to create user! Please logout and login again before performing any actions.');
    } else {
      const { error } = await supabase
        .from('Students')
        .insert({ student_id: user.uid, name: user.displayName, email: user.email, profile_picture: user.photoURL });

      if (error) alert('Failed to create user! Please logout and login again before performing any actions.');
    }
  }

  return (
    <StandardButton disabled={loading} operation={signInWithGoogleAndSaveData}>
      Login
    </StandardButton>
  );
}
