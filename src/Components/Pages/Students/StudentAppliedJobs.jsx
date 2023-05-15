import { useQuery } from '@tanstack/react-query';
import Container from '@mui/material/Container';
import CircularColor from '../../UI/Progress';
import StudentAppliedJobsTable from '../../UI/Tables/Students/StudentAppliedJobsTable';
import { fetchJobsAppliedForEachStudent } from '../services';
import { useAuth } from '../../../Context/AuthContext';
import StandardButton from '../../UI/Buttons/Button';
import { useNavigate } from 'react-router-dom';

export default function StudentAppliedJobs() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    data: applicationsDataOfASpecificStudent,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['studentsJobApplicationData'],
    queryFn: () => fetchJobsAppliedForEachStudent(currentUser.uid),
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) {
    return <CircularColor styles={{ display: 'flex', justifyContent: 'center' }} />;
  }

  return (
    <>
      <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <StudentAppliedJobsTable data={applicationsDataOfASpecificStudent} />
      </Container>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <StandardButton operation={() => navigate('/Dashboard')}>Go Back</StandardButton>
      </div>
    </>
  );
}
