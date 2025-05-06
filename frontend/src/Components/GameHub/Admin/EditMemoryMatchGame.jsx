import React from 'react';
import { Box, Typography } from '@mui/material';

const EditMemoryMatchGame = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Edit Memory Match Game
      </Typography>
      <Typography variant="body1">
        This is the Edit Memory Match Game page for the Admin.
      </Typography>
    </Box>
  );
};

export default EditMemoryMatchGame;