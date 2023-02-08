import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAccountType } from '../../Hooks/useAccountType';
import Post from '../UI/Post/Post';
import FormModal from '../Form/FormModal';
import Button from '../UI/Button';
import './Dashboard.css';
import { hasStudentFilledTheForm } from '../../Utils/helpers';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const [jobPost, setJobPost] = useState([]);
  const accountType = useAccountType(currentUser);
  const [isFormFilled, setIsFormFilled] = useState(false);

  useEffect(() => {
    let isApiSubscribed = true;

    const fn = async () => {
      if (isApiSubscribed) {
        const res = await hasStudentFilledTheForm(currentUser);
        setIsFormFilled(res === 'FILLED' ? true : false);
      }
    };

    fn();

    return () => {
      isApiSubscribed = false;
    };
  }, []);

  const navigate = useNavigate();

  function updateFormHandler() {
    navigate('/StudentDetails');
  }

  return (
    <>
      <div className="container">
        <section className="heading">
          <h1></h1>
        </section>

        <header>
          {accountType && accountType === 'Teacher' ? (
            <Button onClick={() => setModalShow(true)}>Create Post</Button>
          ) : (
            <Button onClick={updateFormHandler}>{isFormFilled ? 'Update Form' : 'Fill Form'}</Button>
          )}
        </header>

        <Post post={jobPost} />
        <FormModal show={modalShow} getPostDetail={setJobPost} onHide={() => setModalShow(false)} />
      </div>
    </>
  );
}
