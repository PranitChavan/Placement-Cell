import { lazy, Suspense } from 'react';
import Post from '../UI/Post/Post';
import './Dashboard.css';
import GroupedSelect from './Testing';
import { useQuery } from '@tanstack/react-query';
import { fetchDepartmentDetails } from './services';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreatePost = lazy(() => import('../Forms/CreatePostForm'));
const Confirmation = lazy(() => import('../UI/ConfirmationDialog'));

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { data, isFetching, isError } = useQuery({
    queryKey: ['departmentDetails'],
    queryFn: () => fetchDepartmentDetails(currentUser.uid),
    refetchOnWindowFocus: false,
  });

  if (!isFetching && !isError && data.length === 0) {
    navigate('/profile');
    return <></>;
  }

  return (
    <>
      <div className="container">
        <Post />
        <Suspense>
          <CreatePost />
          <Confirmation />
        </Suspense>
      </div>
    </>
  );
}
