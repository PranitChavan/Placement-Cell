import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import StandardButton from '../Buttons/Button';
import CircularColor from '../Progress';

export default function StudentsTable(props) {
  const { data, searchData } = props;
  const navigate = useNavigate();

  return (
    <>
      <TableContainer component={Paper} style={{ marginTop: '100px' }}>
        <Table sx={{ background: '#383838' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchData?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                  Search to view students
                </TableCell>
              </TableRow>
            )}

            {searchData?.map((row, i) => (
              <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" align="center" style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    alt="Remy Sharp"
                    src={row.profile_picture}
                    referrerPolicy="noopener noreferrer"
                    style={{ marginRight: '10px' }}
                  >
                    {row.name?.split('')[0]}
                  </Avatar>

                  {row.name}
                </TableCell>

                {/* <TableCell align="center">
                  <StandardButton
                    color={'success'}
                    operation={() => {
                      return null;
                    }}
                  >
                    View Applied Jobs
                  </StandardButton>
                </TableCell> */}

                <TableCell align="center">
                  <StandardButton
                    color={'success'}
                    operation={() => {
                      navigate(`/students/jobsApplied/${row.student_id}`);
                    }}
                  >
                    View Applied Jobs
                  </StandardButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="header container" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
        <StandardButton operation={() => navigate('/Dashboard')}>Go Back</StandardButton>
      </div>
    </>
  );
}
