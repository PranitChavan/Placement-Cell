import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function Tags({ items }) {
  const handleClick = () => {};

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {items.map((item, i) => {
        return (
          <Stack direction="row" spacing={1} mt={2} key={i}>
            <Chip label={item} onClick={handleClick} />
          </Stack>
        );
      })}
    </div>
  );
}
