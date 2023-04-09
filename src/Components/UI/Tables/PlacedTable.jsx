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

export default function PlacedTable(props) {
  const { data, isLoading } = props;

  const navigate = useNavigate();

  if (isLoading) {
    return <CircularColor styles={{ display: 'flex', justifyContent: 'center' }} />;
  }

  return (
    <Container>
      <TableContainer component={Paper} style={{ marginTop: '200px' }}>
        <Table sx={{ minWidth: 650, background: '#383838' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Company Name</TableCell>
              <TableCell align="center">Package</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Offer Letter&nbsp;</TableCell>
              <TableCell align="center">Photo&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                  No data available!
                </TableCell>
              </TableRow>
            )}

            {data.map((row, i) => (
              <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" align="center">
                  <Stack direction="row" display="flex" alignItems="center">
                    <Avatar
                      alt="Remy Sharp"
                      src={row.profile_picture}
                      referrerPolicy="noopener noreferrer"
                      style={{ marginRight: '10px' }}
                    >
                      {row.name?.split('')[0]}
                    </Avatar>
                    {row.name}
                  </Stack>
                </TableCell>
                <TableCell align="center">{row.company_name}</TableCell>
                <TableCell align="center">{row.package} LPA</TableCell>
                <TableCell align="center">{row.phone}</TableCell>

                <TableCell align="center">
                  <a href={row.offer_letter} rel="noopener noreferrer" target="_blank" style={{ color: 'blue' }}>
                    View
                  </a>
                </TableCell>
                <TableCell align="center">
                  <a href={row.photo_url} rel="noopener noreferrer" target="_blank" style={{ color: 'blue' }}>
                    View
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="header container" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
        <StandardButton operation={() => navigate('/Dashboard')}>Go Back</StandardButton>
      </div>
    </Container>
  );
}
