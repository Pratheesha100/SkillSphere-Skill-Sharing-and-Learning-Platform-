import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Alert, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddMemoryMatchGame = () => {
  const navigate = useNavigate();
  const [paragraph, setParagraph] = useState('');
  const [options, setOptions] = useState(Array(5).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const exampleParagraph = `The _____ is the largest planet in our solar system. It has a famous _____ spot that is actually a giant storm. The planet is known for its beautiful _____ rings. Scientists believe it has at least _____ moons. The planet's atmosphere is mostly made up of _____ gas.`;

  const exampleOptions = [
    "Jupiter",
    "Great Red",
    "Saturn's",
    "79",
    "hydrogen"
  ];

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const loadExample = () => {
    setParagraph(exampleParagraph);
    setOptions(exampleOptions);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');

      // Validate inputs
      if (!paragraph.trim()) {
        setError('Please enter a paragraph');
        return;
      }

      if (!options.some(opt => opt.trim())) {
        setError('Please enter at least one option');
        return;
      }

      // Count the number of blanks in the paragraph
      const blankCount = (paragraph.match(/_____/g) || []).length;
      if (blankCount !== options.filter(opt => opt.trim()).length) {
        setError(`Number of blanks (${blankCount}) does not match number of options (${options.filter(opt => opt.trim()).length})`);
        return;
      }

      // Create game DTO
      const gameDTO = {
        type: 'MEMORY_MATCH',
        paragraph: paragraph,
        options: options.filter(opt => opt.trim()),
        blanks: Array(blankCount).fill(''), // Initialize blanks array
        category: 'General Knowledge',
        level: 'Medium',
        timer: 600,
        // Set other fields to null
        questionText: null,
        answer1: null,
        answer2: null,
        answer3: null,
        answer4: null,
        correctAnswer: null
      };

      console.log('Submitting game DTO:', gameDTO);

      // Submit to backend
      const response = await axios.post('http://localhost:8080/api/games/memory-match', gameDTO, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);

      setSuccess('Memory Match Game added successfully!');
      
      Swal.fire({
        title: 'Success!',
        text: 'Memory Match Game added successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/admin/memory-match-list');
      });
    } catch (err) {
      console.error('Error details:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error adding Memory Match Game. Please try again.';
      setError(errorMessage);
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 5, px: 2, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Add New Memory Match Game
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          How to Create a Memory Match Game
        </Typography>
        <Typography variant="body1" paragraph>
          1. Write a paragraph with blanks using '_____' for each blank
          2. Add options that match each blank
          3. Make sure the number of blanks matches the number of options
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={loadExample}
          sx={{ mb: 2 }}
        >
          Load Example
        </Button>
      </Paper>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Paragraph (use '_____' for blanks)"
        value={paragraph}
        onChange={(e) => setParagraph(e.target.value)}
        sx={{ mb: 3 }}
        helperText="Use '_____' to create blanks in your paragraph"
      />

      <Typography variant="h6" gutterBottom>
        Options (one for each blank)
      </Typography>

      <Grid container spacing={2}>
        {options.map((option, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              fullWidth
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              helperText={`This will fill blank #${index + 1}`}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => navigate('/admin/memory-match-list')}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddMemoryMatchGame;