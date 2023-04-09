import Button from '@mui/material/Button';

export default function StandardButton({ operation, children, color, disabled, style }) {
  return (
    <Button
      variant="contained"
      disabled={disabled}
      onClick={operation}
      color={color}
      style={{ background: !color ? '#2ea44f' : '', ...style, textTransform: 'capitalize' }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
    </Button>
  );
}
