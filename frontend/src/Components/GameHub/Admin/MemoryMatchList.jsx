import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Alert, CircularProgress } from '@mui/material';
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Memory Match Games</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/add-memory-match-game')}
        >
          Add New Game
        </Button>
      </Box>

      {memoryMatchGames.length === 0 ? (
        <Alert severity="info">
          No memory match games available. Create your first game!
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/admin/add-memory-match-game')}
            >
              Create New Game
            </Button>
          </Box>
        </Alert>
      ) : (
        <List>
          {memoryMatchGames.map((game) => (
            <ListItem
              key={game.id}
              sx={{
                bgcolor: 'background.paper',
                mb: 2,
                borderRadius: 1,
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch'
              }}
            >
              <ListItemText
                primary={game.paragraph?.substring(0, 100) + '...'}
                secondary={`Category: ${game.category || 'N/A'} | Level: ${game.level || 'N/A'} | Timer: ${game.timer || 'N/A'} seconds`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handlePreview(game.id)}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleEdit(game.id)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(game.id)}
                >
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MemoryMatchList;