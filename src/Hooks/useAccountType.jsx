import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';

// THIS HOOK RETURNS TYPE OF THE CURRENT ACCOUNT : TEACHER/ STUDENT

export function useAccountType(currentUser) {
  const [accountType, setAccountType] = useState(null);
  const { accountType: accountTypeFunc } = useAuth();

  useEffect(() => {
    async function fetchData() {
      const type = await accountTypeFunc(currentUser);
      setAccountType(type);
    }
    fetchData();
  }, [accountTypeFunc, currentUser]);

  return accountType;
}
