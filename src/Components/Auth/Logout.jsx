import React from 'react';
import { app } from '../../Config/firebaseCfg';
import { getAuth, signOut } from 'firebase/auth';

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
    <form className="d-flex logout-form">
      <button className="btn btn-outline-danger fw-bold" type="button" onClick={logoutHandler}>
        Logout
      </button>
    </form>
  );
}
