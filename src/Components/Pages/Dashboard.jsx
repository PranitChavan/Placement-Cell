import { useState, lazy, Suspense } from 'react';
import { useAuth } from '../../Context/AuthContext';

import Post from '../UI/Post/Post';

import './Dashboard.css';

const FormModal = lazy(() => import('../Form/FormModal'));

export default function Dashboard() {
  const { currentUser, modalShow, setModalShow } = useAuth();

  return (
    <>
      <div className="container">
        <Post />
        <Suspense>
          <FormModal show={modalShow} onHide={() => setModalShow(false)} />
        </Suspense>
      </div>
    </>
  );
}
