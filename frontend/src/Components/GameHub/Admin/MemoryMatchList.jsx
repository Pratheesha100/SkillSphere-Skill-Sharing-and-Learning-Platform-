import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Alert, 
  CircularProgress,
  Paper,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const MemoryMatchList = () => {
  const navigate = useNavigate();
  const [memoryMatchGames, setMemoryMatchGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMemoryMatchGames();
  }, []);

  const fetchMemoryMatchGames = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching games...');
      const response = await axios.get('http://localhost:8080/api/games');
      console.log('API Response:', response.data);
      
      // Filter only memory match games
      const memoryGames = response.data.filter(game => game.type === 'MEMORY_MATCH');
      
      console.log('Filtered memory games:', memoryGames);
      setMemoryMatchGames(memoryGames);
    } catch (err) {
      console.error('Error fetching memory match games:', err);
      setError('Failed to load memory match games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8080/api/games/${id}`);
        await fetchMemoryMatchGames(); // Refresh the list
        Swal.fire('Deleted!', 'Memory match game has been deleted.', 'success');
      }
    } catch (err) {
      console.error('Error deleting game:', err);
      Swal.fire('Error!', 'Failed to delete the game.', 'error');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-memory-match/${id}`);
  };

  const handlePreview = (id) => {
    navigate(`/admin/preview-memory-match/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: 3,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            color: '#1a237e'
          }}>
            Memory Match Games
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/add-memory-match-game')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: 2
            }}
          >
            Add New Game
          </Button>
        </Box>

        {memoryMatchGames.length === 0 ? (
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              No memory match games available. Create your first game!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/admin/add-memory-match-game')}
              sx={{
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Create New Game
            </Button>
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {memoryMatchGames.map((game) => (
              <Grid item xs={12} key={game.id}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#1a237e',
                        mb: 1,
                        fontWeight: 500
                      }}
                    >
                      {game.paragraph?.substring(0, 100)}
                      {game.paragraph?.length > 100 ? '...' : ''}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={`Category: ${game.category || 'N/A'}`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip 
                        label={`Level: ${game.level || 'N/A'}`}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip 
                        label={`Timer: ${game.timer || 'N/A'} seconds`}
                        color="info"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 1,
                    '& .MuiButton-root': {
                      borderRadius: 2,
                      textTransform: 'none'
                    }
                  }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handlePreview(game.id)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEdit(game.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(game.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default MemoryMatchList;