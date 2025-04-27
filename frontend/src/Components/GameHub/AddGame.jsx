import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, MenuItem, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddGame = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    questionText: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correctAnswer: '',
    category: '',
    level: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const response = await axios.post('http://localhost:8080/api/games', form);
      Swal.fire({
        title: 'Success!',
        text: 'Game added successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/games');
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding game');
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to add game',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Add New Game</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Question Text"
        name="questionText"
        value={form.questionText}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Answer 1"
        name="answer1"
        value={form.answer1}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Answer 2"
        name="answer2"
        value={form.answer2}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Answer 3"
        name="answer3"
        value={form.answer3}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Answer 4"
        name="answer4"
        value={form.answer4}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Correct Answer"
        name="correctAnswer"
        select
        value={form.correctAnswer}
        onChange={handleChange}
        margin="normal"
        required
        helperText="Select the correct answer"
      >
        {[form.answer1, form.answer2, form.answer3, form.answer4]
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
        value={form.category}
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
        value={form.level}
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
        onClick={handleSubmit}
        fullWidth
      >
        Add Game
      </Button>
    </Box>
  );
};

export default AddGame;
