import AppliedJobsTable from '../../UI/Tables/Teachers/AppliedJobsOfASpecificStudentTable';
import Container from '@mui/material/Container';
import { fetchJobsAppliedForEachStudent } from '../services';
import CircularColor from '../../UI/Progress';

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function AppliedJobs() {
  const { studentId } = useParams();

  const {
    data: applicationsDataOfASpecificStudent,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['studentsJobApplicationData'],
    queryFn: () => fetchJobsAppliedForEachStudent(studentId),
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) {
    return <CircularColor styles={{ display: 'flex', justifyContent: 'center' }} />;
  }

  return (
    <>
      <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AppliedJobsTable data={applicationsDataOfASpecificStudent} isLoading={isLoading} />
      </Container>
    </>
  );
}
