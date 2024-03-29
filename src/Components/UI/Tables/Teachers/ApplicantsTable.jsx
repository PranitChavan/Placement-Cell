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
import { deleteApplicant } from '../../../../Utils/helpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import StandardButton from '../../Buttons/Button';
import { useNavigate } from 'react-router-dom';
import useNavigationStore from '../../../../Stores/navigationStore';

export default function ApplicantsTable(props) {
  const { data, postId } = props;
  const queryClient = useQueryClient();
  const setAndToggleConfirmationDialog = useNavigationStore((state) => state.setAndToggleConfirmationDialog);
  const navigate = useNavigate();

  const { mutate: deleteJobApplication } = useMutation({
    mutationFn: ([studentId, postId]) => {
      return deleteApplicant([studentId, postId]);
    },

    onSuccess: (_, [studentId]) => {
      queryClient.setQueryData(['applicants'], (oldData) => {
        return oldData.filter((post) => post.student_id !== studentId);
      });
    },
  });

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, background: '#383838' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Resume&nbsp;</TableCell>
              <TableCell align="center">Status&nbsp;</TableCell>
              <TableCell align="center">Actions&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                  No Students have applied yet!
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
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">
                  <a href={row.resume_url} rel="noopener noreferrer" target="_blank" style={{ color: 'white' }}>
                    View
                  </a>
                </TableCell>

                <TableCell align="center">
                  <StandardButton
                    color={'success'}
                    operation={() => {
                      navigate(`/jobstatus/${postId}/${row.student_id}`);
                    }}
                  >
                    View Status
                  </StandardButton>
                </TableCell>
                <TableCell align="center">
                  <StandardButton
                    color={'error'}
                    operation={() => {
                      setAndToggleConfirmationDialog({
                        isOpen: true,
                        title: 'Delete Student Application',
                        subTitle: `Are you sure that you would like to delete ${
                          row.name?.split(' ')[0]
                        }'s application ? They will need to apply again.`,
                        onConfirm: () => {
                          deleteJobApplication([row.student_id, postId]);
                        },
                      });
                    }}
                  >
                    Delete
                  </StandardButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
