import { useContext, useEffect, useState, createContext } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../Config/firebaseCfg';

const AuthContext = createContext();
const auth = getAuth(app);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((currUser) => {
      console.log(currUser);
      setCurrentUser(currUser);
      setLoading(false);
    });

    return unSub;
  }, []);

  const value = {
    currentUser,
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
