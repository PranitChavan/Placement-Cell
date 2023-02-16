import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deleteApplicant } from '../../Utils/helpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Confirmation from './ConfirmationDialog';
import { useAuth } from '../../Context/AuthContext';

export default function ApplicantsTable(props) {
  const { data, postId } = props;
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const { currentUser } = useAuth();

  const { mutate: deleteJobApplication } = useMutation({
    mutationFn: ([studentId, postId]) => {
      return deleteApplicant([studentId, postId, setConfirmDialog]);
    },

    onSuccess: (_, [studentId, postId]) => {
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
                  {' '}
                  <Button
                    color="error"
                    variant="contained"
                    style={{ fontWeight: '5' }}
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Delete Student Application',
                        subTitle: `Are you sure that you would like to delete ${
                          currentUser.displayName.split(' ')[0]
                        }'s application ? They will need to apply again.`,
                        onConfirm: () => {
                          deleteJobApplication([row.student_id, postId]);
                        },
                      });
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Confirmation confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </Container>
  );
}
