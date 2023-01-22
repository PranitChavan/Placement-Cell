import React, { useContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../Config/firebaseCfg';
import { supabase } from '../Config/supabase.client';

const AuthContext = React.createContext();
const auth = getAuth(app);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((currUser) => {
      setCurrentUser(currUser);
      setLoading(false);
    });

    return unSub;
  }, []);

  async function accountType(user) {
    const { data: isTeacher } = await supabase.from('Roles').select('id').eq('id', user.uid);
    return isTeacher?.length > 0 ? 'Teacher' : 'Student';
  }

  const value = {
    currentUser,
    accountType,
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
