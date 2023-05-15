import { lazy, Suspense } from 'react';
import Post from '../UI/Post/Post';
import './Dashboard.css';

const FormModal = lazy(() => import('../Forms/FormModal'));
const Confirmation = lazy(() => import('../UI/ConfirmationDialog'));

export default function Dashboard() {
  return (
    <>
      <div className="container">
        <Post />
        <Suspense>
          <FormModal />
          <Confirmation />
        </Suspense>
      </div>
    </>
  );
}
