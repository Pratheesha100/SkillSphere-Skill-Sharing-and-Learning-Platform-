import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, MenuItem, Alert } from '@mui/material';
import Swal from 'sweetalert2';

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState({
    questionText: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correctAnswer: '',
    category: '',
    level: '',
    paragraph: '',
    blanks: Array(5).fill(''),
    options: Array(5).fill(''),
    timer: 600 // Default 10 minutes
  });

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/games/${id}`);
        const gameData = response.data;
        
        // Initialize arrays if they don't exist
        const updatedGame = {
          ...gameData,
          blanks: gameData.blanks || Array(5).fill(''),
          options: gameData.options || Array(5).fill('')
        };
        
        setGame(updatedGame);
        setError('');
      } catch (error) {
        setError('Error fetching game details');
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch game details',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    setGame(prev => {
      const newArray = [...(prev[arrayName] || Array(5).fill(''))];
      newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
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
        navigate('/admin/mcq-list');
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Edit Game</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Question Text (MCQ Only)"
        name="questionText"
        value={game.questionText || ''}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Answer 1"
        name="answer1"
        value={game.answer1 || ''}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Answer 2"
        name="answer2"
        value={game.answer2 || ''}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Answer 3"
        name="answer3"
        value={game.answer3 || ''}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Answer 4"
        name="answer4"
        value={game.answer4 || ''}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Correct Answer"
        name="correctAnswer"
        select
        value={game.correctAnswer || ''}
        onChange={handleChange}
        margin="normal"
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
        value={game.category || ''}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="ICT">ICT</MenuItem>
        <MenuItem value="Math">Math</MenuItem>
        <MenuItem value="Science">Science</MenuItem>
        <MenuItem value="General Knowledge">General Knowledge</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Level"
        name="level"
        select
        value={game.level || ''}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="Easy">Easy</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Hard">Hard</MenuItem>
      </TextField>

      <Typography variant="h6" mt={4}>Memory Match Game</Typography>
      <TextField
        fullWidth
        label="Paragraph"
        name="paragraph"
        value={game.paragraph || ''}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
      />
      {(game.blanks || Array(5).fill('')).map((blank, index) => (
        <TextField
          key={index}
          fullWidth
          label={`Blank ${index + 1}`}
          value={blank || ''}
          onChange={(e) => handleArrayChange('blanks', index, e.target.value)}
          margin="normal"
        />
      ))}
      {(game.options || Array(5).fill('')).map((option, index) => (
        <TextField
          key={index}
          fullWidth
          label={`Option ${index + 1}`}
          value={option || ''}
          onChange={(e) => handleArrayChange('options', index, e.target.value)}
          margin="normal"
        />
      ))}

      <TextField
        fullWidth
        label="Timer (seconds)"
        name="timer"
        type="number"
        value={game.timer || 600}
        onChange={handleChange}
        margin="normal"
      />

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
