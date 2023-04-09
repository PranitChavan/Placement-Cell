import StudentsTable from '../../UI/Tables/StudentsTable';
import { fetchLimitedStudents } from '../services';
import { useQuery } from '@tanstack/react-query';
import { TextField } from '@mui/material';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { searchStudents } from '../services';
import EnhancedTable from '../../UI/Tables/New';
import CircularColor from '../../UI/Progress';

export default function Students() {
  const [searchValue, setSearchValue] = useState('');

  const {
    data: limitedStudents,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['initialStudents'],
    queryFn: () => fetchLimitedStudents(),
    refetchOnWindowFocus: false,
  });

  const {
    data: searchedData,
    searchDataLoading,
    refetch,
  } = useQuery({
    queryKey: ['searchStudents'],
    queryFn: () => searchStudents(searchValue),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [searchValue]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  if (isLoading || isFetching) {
    return <CircularColor styles={{ display: 'flex', justifyContent: 'center' }} />;
  }

  return (
    <>
      <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          id="outlined-basic"
          label="Search for students"
          variant="outlined"
          type="search"
          name="students"
          margin="normal"
          value={searchValue}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <StudentsTable data={limitedStudents} searchData={limitedStudents} />
        {/* <EnhancedTable /> */}
      </Container>
    </>
  );
}
