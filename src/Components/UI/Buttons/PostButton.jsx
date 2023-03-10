import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

export default function Postbutton({ state }) {
  const { alreadyApplied, accountType, operation, post_id: postId } = state;
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={2} style={{ marginTop: '10px' }}>
      <Button
        size="medium"
        disabled={alreadyApplied}
        disableElevation
        onClick={() =>
          accountType === 'Teacher' ? navigate(`/Applicants/${postId}`, { state: { postId } }) : operation(postId)
        }
      >
        {accountType === 'Teacher' ? 'View Applicants' : alreadyApplied ? 'Already Applied' : 'Apply'}
      </Button>
    </Stack>
  );
}
