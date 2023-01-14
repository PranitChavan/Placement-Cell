import Navbar from './Navbar';
import Slides from './Slides';
import { useAuth } from '../contexts/AuthContext';

function Landing() {
  const { currentUser } = useAuth();

  return (
    <>
      <Navbar loggedInOrNot={currentUser} />
      <Slides />
    </>
  );
}

export default Landing;
