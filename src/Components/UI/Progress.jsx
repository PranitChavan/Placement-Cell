import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularColor({ styles, size }) {
  return (
    <Stack
      sx={{
        color: 'grey.500',
      }}
      spacing={2}
      direction="row"
      style={styles}
    >
      <CircularProgress size="3.5rem" color="success" style={{ color: 'white' }} />
    </Stack>
  );
}
