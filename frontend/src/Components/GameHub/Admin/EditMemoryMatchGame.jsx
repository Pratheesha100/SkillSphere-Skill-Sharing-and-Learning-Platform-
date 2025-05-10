import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert,
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';
import axios from 'axios';

const EditMemoryMatchGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState({
    paragraph: '',
    category: '',
    level: '',
    options: [],
    timer: 300,
    type: 'MEMORY_MATCH'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/games/${id}`);
      setGame(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch game details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionsChange = (index, value) => {
    const newOptions = [...game.options];
    newOptions[index] = value;
    setGame(prev => ({
        ...prev,
        options: newOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/games/${id}`, game);
      setSuccess('Game updated successfully');
      setTimeout(() => {
        navigate('/admin/memory-match-list');
      }, 2000);
    } catch (err) {
      setError('Failed to update game');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Memory Match Game
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Paragraph"
            name="paragraph"
            value={game.paragraph}
            onChange={handleChange}
            sx={{ mb: 2 }}
            helperText="Use ___ for blanks in the text"
          />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={game.category}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="ICT">ICT</MenuItem>
                  <MenuItem value="Math">Math</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="General Knowledge">General Knowledge</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={game.level}
                  onChange={handleChange}
                  label="Level"
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
                <Typography variant="subtitle1">Options</Typography>
                {game.options.map((option, index) => (
                    <TextField
                        key={index}
                        fullWidth
                        label={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionsChange(index, e.target.value)}
                        sx={{ mb: 1 }}
                    />
                ))}
            </Grid>
          </Grid>

          <TextField
            fullWidth
            type="number"
            label="Timer (seconds)"
            name="timer"
            value={game.timer}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/memory-match-list')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Game
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditMemoryMatchGame;