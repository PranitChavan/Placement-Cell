import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signInWithGoogleAndSaveData } = useAuth();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signInHandler = async function () {
    try {
      setLoading(true);
      await signInWithGoogleAndSaveData();
      navigate('/Dashboard');
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };
  return (
    <form className="login-form">
      <button type="button" disabled={loading} className={`btn btn-outline-success`} onClick={signInHandler}>
        Sign in with google
      </button>
    </form>
  );
}
