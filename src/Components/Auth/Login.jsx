import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Config/supabase.client';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../../Config/firebaseCfg';
import { useAuth } from '../../Context/AuthContext';

const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);

export default function Login() {
  const { accountType } = useAuth();
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
  async function createUser(user) {
    const role = await accountType(user);

    if (role === 'Teacher') {
      const { error } = await supabase
        .from('Teachers')
        .insert({ teacher_id: user.uid, name: user.displayName, email: user.email, profile_picture: user.photoURL });
    } else {
      const { error } = await supabase
        .from('Students')
        .insert({ student_id: user.uid, name: user.displayName, email: user.email, profile_picture: user.photoURL });
    }
  }

  return (
    <form className="login-form">
      <button type="button" disabled={loading} className={`btn btn-outline-success`} onClick={signInWithGoogleAndSaveData}>
        Sign in with google
      </button>
    </form>
  );
}
