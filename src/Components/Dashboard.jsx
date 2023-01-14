import { React, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Post from './Post';
import FormModal from './FormModal';
import Button from './Button';
import Navbar from './Navbar';

export default function Dashboard() {
  const { currentUser, getSpecificUserDataById, accountType } = useAuth();
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [jobPost, setJobPost] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isApiSubscribed = true;

    async function getLoggedInUserData() {
      if (isApiSubscribed) {
        const res = await getSpecificUserDataById(currentUser);
        setLoggedInUserData(res);
      }
    }

    getLoggedInUserData();

    return () => {
      isApiSubscribed = false;
    };
  }, []);

  function updateFormHandler() {
    navigate('/StudentForm');
  }

  return (
    <>
      <Navbar loggedInOrNot={currentUser} />
      <div className="container">
        <section className="heading">
          <h1></h1>
        </section>

        <header>
          <Button onClick={updateFormHandler} className={accountType(currentUser) === 'Teacher' ? 'hideDashBoardBtns' : ''}>
            {loggedInUserData && loggedInUserData.isFormFilled ? 'Update form' : 'Fill form'}
          </Button>

          <Button
            onClick={() => setModalShow(true)}
            className={accountType(currentUser) === 'Student' ? 'hideDashBoardBtns' : ''}
          >
            Create Post
          </Button>
        </header>

        <Post loggedInUser={loggedInUserData} post={jobPost} />
        <FormModal show={modalShow} getPostDetail={setJobPost} onHide={() => setModalShow(false)} />
      </div>
    </>
  );
}
