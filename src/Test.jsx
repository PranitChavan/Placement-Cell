import React, { useState } from 'react';

import { Box, Slider, TextField, Typography, Select, Grid } from '@mui/material';

function SearchRoomsDetails(props) {
  const { RoomPrice } = props;

  const [price, setPrice] = useState(600);

  const aa = [
    { label: 'Single', value: 'single' },
    { label: 'Double', value: 'Double' },
    { label: 'Family', value: 'family' },
    { label: 'Presidential', value: 'presidential' },
  ];
  const bb = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '10', value: 10 },
  ];

  return (
    <>
      <Box style={{ marginTop: '200px' }}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Grid item xs={6} style={{ background: 'yellow' }}>
            1
          </Grid>
          <Grid item xs={6} style={{ background: 'red' }}>
            2
          </Grid>
          <Grid item xs={6} style={{ background: 'green' }}>
            3
          </Grid>
          <Grid item xs={6} style={{ background: 'blue' }}>
            4
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default SearchRoomsDetails;
