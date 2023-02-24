import { useContext, useEffect, useState, createContext } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../Config/firebaseCfg';
import { supabase } from '../Config/supabase.client';

const AuthContext = createContext();
const auth = getAuth(app);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((currUser) => {
      setCurrentUser(currUser);
      setLoading(false);
    });

    return unSub;
  }, []);

  async function accountType(user) {
    const { data: isTeacher, error } = await supabase.from('Roles').select('id').eq('id', user?.uid);

    if (error) throw new Error('Failed!');
    return isTeacher?.length > 0 ? 'Teacher' : 'Student';
  }

  const value = {
    currentUser,
    accountType,
    modalShow,
    setModalShow,
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
