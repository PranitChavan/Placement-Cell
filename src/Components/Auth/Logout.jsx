import React from 'react';
import { app } from '../../Config/firebaseCfg';
import { getAuth, signOut } from 'firebase/auth';
import StandardButton from '../UI/Buttons/Button';

const auth = getAuth(app);

export default function Logout() {
  async function logoutHandler() {
    try {
      return await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <StandardButton color={'error'} operation={() => logoutHandler()}>
      Sign out
    </StandardButton>
  );
}
