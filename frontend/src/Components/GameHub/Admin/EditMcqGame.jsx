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
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';

const EditMcqGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState({
    questionText: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correctAnswer: '',
    category: '',
    level: '',
    type: 'MCQ',
    timer: 60
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/games/${id}`, game);
      setSuccess('MCQ game updated successfully');
      setTimeout(() => {
        navigate('/admin/mcq-list');
      }, 2000);
    } catch (err) {
      setError('Failed to update MCQ game');
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
        Edit MCQ Game
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Question"
            name="questionText"
            value={game.questionText}
            onChange={handleChange}
            sx={{ mb: 3 }}
            required
          />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Option 1"
                name="answer1"
                value={game.answer1}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Option 2"
                name="answer2"
                value={game.answer2}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Option 3"
                name="answer3"
                value={game.answer3}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Option 4"
                name="answer4"
                value={game.answer4}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Correct Answer
            </Typography>
            <RadioGroup
              row
              name="correctAnswer"
              value={game.correctAnswer}
              onChange={handleChange}
            >
              <FormControlLabel value={game.answer1} control={<Radio />} label="Option 1" />
              <FormControlLabel value={game.answer2} control={<Radio />} label="Option 2" />
              <FormControlLabel value={game.answer3} control={<Radio />} label="Option 3" />
              <FormControlLabel value={game.answer4} control={<Radio />} label="Option 4" />
            </RadioGroup>
          </FormControl>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={game.category}
                  onChange={handleChange}
                  label="Category"
                  required
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
                  required
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
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
              onClick={() => navigate('/admin/mcq-list')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Update MCQ
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditMcqGame;