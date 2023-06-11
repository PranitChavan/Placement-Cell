import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../../Config/firebaseCfg';
import StandardButton from '../UI/Buttons/Button';
import { createUser } from './authServices';
import { accountType } from '../../Utils/helpers';

const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signInWithGoogleAndSaveData() {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      navigate('/Dashboard');
      const userType = await accountType(res.user.uid);
      await createUser(res.user, userType);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <StandardButton disabled={loading} operation={signInWithGoogleAndSaveData}>
      Login
    </StandardButton>
  );
}
