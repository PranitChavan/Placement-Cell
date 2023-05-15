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
import StandardButton from '../../Buttons/Button';
import CircularColor from '../../Progress';
import timeAgo from '../../../../Utils/displayTimeSincePostCreated';
import { Typography } from '@mui/material';

export default function AppliedJobsTable(props) {
  const { data } = props;
  const navigate = useNavigate();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  }

  console.log(data);

  return (
    <>
      <TableContainer component={Paper} style={{ marginTop: '100px' }}>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle">
          {data.length > 0 ? `Jobs applied by ${data[0]?.name}` : null}
        </Typography>
        <Table sx={{ background: '#383838' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Company Name</TableCell>
              <TableCell align="center">Applied At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                  Student has not applied for a job yet
                </TableCell>
              </TableRow>
            )}

            {data.map((row, i) => (
              <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" align="center">
                  {row.company_name}
                </TableCell>

                <TableCell component="th" scope="row" align="center">
                  {formatDate(row.created_at)}
                </TableCell>

                <TableCell align="center">
                  <StandardButton
                    color={'success'}
                    operation={() => {
                      navigate(`/jobstatus/${row.post_id}/${row.student_id}`);
                    }}
                  >
                    View Status
                  </StandardButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="header container" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
        <StandardButton operation={() => navigate('/students')}>Go Back</StandardButton>
      </div>
    </>
  );
}
