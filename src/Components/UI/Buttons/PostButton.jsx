import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Postbutton() {
  return (
    <Stack direction="row" spacing={2} style={{ marginTop: '10px' }}>
      <Button size="small" color="success" disableElevation>
        Apply
      </Button>
    </Stack>
  );
}
