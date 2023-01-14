import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Logout() {
  const { logoutHandler } = useAuth();

  return (
    <form className="d-flex logout-form">
      <button className="btn btn-outline-danger fw-bold" type="button" onClick={logoutHandler}>
        Logout
      </button>
    </form>
  );
}
