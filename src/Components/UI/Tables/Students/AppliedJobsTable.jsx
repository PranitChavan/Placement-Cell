import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import StandardButton from '../../Buttons/Button';
import Confirmation from '../../ConfirmationDialog';
import timeAgo from '../../../../Utils/displayTimeSincePostCreated';
import { useNavigate } from 'react-router-dom';

export default function StudentAppliedJobsTable(props) {
  const { data } = props;

  const navigate = useNavigate();

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, background: '#383838' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Company Name</TableCell>
              <TableCell align="center">Applied on</TableCell>
              <TableCell align="center">Last status updated on</TableCell>
              <TableCell align="center">Update Job Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                  You have not applied for any jobs yet!
                </TableCell>
              </TableRow>
            )}

            {data.map((row, i) => (
              <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" align="center">
                  {row.company_name}
                </TableCell>
                <TableCell align="center">
                  {new Date(row.created_at).toLocaleDateString('en-GB').replace('GMT', '')}
                </TableCell>

                <TableCell align="center">
                  {row.status_created_at ? timeAgo(row.status_created_at) : 'Not Updated yet'}
                </TableCell>
                <TableCell align="center">
                  <StandardButton
                    color={'success'}
                    operation={() => {
                      navigate(`/jobstatus/${row.post_id}/${row.student_id}`);
                    }}
                  >
                    Update Status
                  </StandardButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Confirmation />
    </Container>
  );
}
