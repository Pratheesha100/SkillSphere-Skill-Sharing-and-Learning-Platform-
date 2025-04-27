import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, TextField, Stack, Switch, FormControlLabel, Card, CardContent, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setError('');
      const res = await axios.get('http://localhost:8080/api/games');
      setGames(res.data);
    } catch (error) {
      setError('Error fetching games');
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch games',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this game!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      background: darkMode ? '#1e1e1e' : '#fff',
      color: darkMode ? '#fff' : '#000',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/games/${id}`);
          await fetchGames();
          Swal.fire({
            title: 'Deleted!',
            text: 'Game has been deleted.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } catch (error) {
          setError('Error deleting game');
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete game',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  };

  const filteredGames = games.filter(
    (game) =>
      (game.questionText?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (game.category?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (game.level?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const bgColor = darkMode ? '#121212' : '#f5f5f5';
  const cardColor = darkMode ? '#1e1e1e' : '#fff';
  const textColor = darkMode ? '#fff' : '#000';

  return (
    <Box sx={{ p: 4, bgcolor: bgColor, minHeight: '100vh', color: textColor }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Game Hub</Typography>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
          label="Dark Mode"
        />
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Search and Add Button */}
      <Stack direction="row" spacing={2} mb={4}>
        <TextField
          label="Search Games"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            input: { color: textColor }, 
            label: { color: textColor },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)' },
              '&:hover fieldset': { borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' },
            }
          }}
        />
        <Button 
          variant="contained" 
          onClick={() => navigate('/add-game')}
          sx={{ 
            bgcolor: '#6200ea',
            '&:hover': { bgcolor: '#5000ca' }
          }}
        >
          Add New Game
        </Button>
      </Stack>

      {/* Game Cards */}
      <Grid container spacing={3}>
        {filteredGames.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card sx={{ 
                bgcolor: cardColor, 
                color: textColor,
                boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{game.questionText}</Typography>
                  <Typography variant="subtitle2" color="gray" gutterBottom>
                    {game.category} - {game.level}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Answers:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ pl: 2 }}>
                    1. {game.answer1}
                  </Typography>
                  <Typography variant="body2" sx={{ pl: 2 }}>
                    2. {game.answer2}
                  </Typography>
                  <Typography variant="body2" sx={{ pl: 2 }}>
                    3. {game.answer3}
                  </Typography>
                  <Typography variant="body2" sx={{ pl: 2 }}>
                    4. {game.answer4}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mt: 2, color: '#4caf50' }}>
                    <strong>Correct Answer:</strong> {game.correctAnswer}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/edit-game/${game.id}`)}
                      sx={{ 
                        borderColor: '#6200ea', 
                        color: textColor,
                        '&:hover': { 
                          borderColor: '#5000ca',
                          bgcolor: darkMode ? 'rgba(98, 0, 234, 0.1)' : 'rgba(98, 0, 234, 0.05)'
                        }
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(game.id)}
                      sx={{ 
                        bgcolor: '#f44336',
                        '&:hover': { bgcolor: '#d32f2f' }
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GameList;
