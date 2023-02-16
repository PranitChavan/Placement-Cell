import { useState, lazy, suspense, Suspense } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAccountType } from '../../Hooks/useAccountType';
import Post from '../UI/Post/Post';
import Button from '../UI/Button';
import './Dashboard.css';
import { hasStudentFilledTheForm } from '../../Utils/helpers';
import { useQuery } from '@tanstack/react-query';

const FormModal = lazy(() => import('../Form/FormModal'));

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const [type, isLoading] = useAccountType(currentUser);
  const navigate = useNavigate();

  const { data: formStatus, isLoading: isFormStatusLoading } = useQuery({
    queryKey: ['formStatus'],
    queryFn: () => hasStudentFilledTheForm(currentUser),
    refetchOnWindowFocus: false,
    enabled: type === 'Student',
  });

  return (
    <>
      <div className="container">
        <section className="heading">
          <h1></h1>
        </section>

        <header>
          {!isLoading && type === 'Teacher' && <Button onClick={() => setModalShow(true)}>Create Post</Button>}

          {!isLoading && type === 'Student' && !isFormStatusLoading && (
            <Button onClick={() => navigate('/StudentDetails')}>
              {formStatus === 'FILLED' ? 'Update Form' : 'Fill Form'}
            </Button>
          )}
        </header>

        <Post />
        <Suspense>
          <FormModal show={modalShow} onHide={() => setModalShow(false)} />
        </Suspense>
      </div>
    </>
  );
}
