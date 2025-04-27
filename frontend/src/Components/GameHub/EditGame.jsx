import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, MenuItem, Alert } from '@mui/material';
import Swal from 'sweetalert2';

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [game, setGame] = useState({
    questionText: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correctAnswer: '',
    category: '',
    level: ''
  });

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/games/${id}`);
        setGame(response.data);
      } catch (error) {
        setError('Error fetching game details');
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch game details',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };
    fetchGame();
  }, [id]);

  const handleChange = (e) => {
    setGame({ ...game, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setError('');
      await axios.put(`http://localhost:8080/api/games/${id}`, game);
      Swal.fire({
        title: 'Success!',
        text: 'Game updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/gamehub');
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating game');
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update game',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Edit Game</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Question Text"
        name="questionText"
        value={game.questionText}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Answer 1"
        name="answer1"
        value={game.answer1}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Answer 2"
        name="answer2"
        value={game.answer2}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Answer 3"
        name="answer3"
        value={game.answer3}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Answer 4"
        name="answer4"
        value={game.answer4}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Correct Answer"
        name="correctAnswer"
        select
        value={game.correctAnswer}
        onChange={handleChange}
        margin="normal"
        required
        helperText="Select the correct answer"
      >
        {[game.answer1, game.answer2, game.answer3, game.answer4]
          .filter(opt => opt)
          .map((opt, i) => (
            <MenuItem key={i} value={opt}>
              {opt}
            </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Category"
        name="category"
        select
        value={game.category}
        onChange={handleChange}
        margin="normal"
        required
      >
        <MenuItem value="ICT">ICT</MenuItem>
        <MenuItem value="Math">Math</MenuItem>
        <MenuItem value="Science">Science</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Level"
        name="level"
        select
        value={game.level}
        onChange={handleChange}
        margin="normal"
        required
      >
        <MenuItem value="Easy">Easy</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Hard">Hard</MenuItem>
      </TextField>

      <Button 
        variant="contained" 
        sx={{ mt: 3 }} 
        onClick={handleUpdate}
        fullWidth
      >
        Update Game
      </Button>
    </Box>
  );
};

export default EditGame;
