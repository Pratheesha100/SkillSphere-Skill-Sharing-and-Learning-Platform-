import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MCQList = () => {
  const [mcqSets, setMcqSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMCQSets();
  }, []);

  const fetchMCQSets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/games');
      // Filter only MCQ games (those with questionText)
      const mcqGames = response.data.filter(game => game.questionText);
      setMcqSets(mcqGames);
      setError('');
    } catch (err) {
      setError('Failed to fetch MCQ sets. Please try again.');
      console.error('Error fetching MCQ sets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (set) => {
    // Navigate to preview page with the set data
    navigate('/admin/preview-mcq', { state: { mcqSet: set } });
  };

  const handleEdit = (set) => {
    // Navigate to edit page with the set data
    navigate(`/admin/edit-game/${set.id}`, { state: { mcqSet: set } });
  };

  const handleDelete = async (set) => {
    if (window.confirm('Are you sure you want to delete this MCQ set?')) {
      try {
        await axios.delete(`http://localhost:8080/api/games/${set.id}`);
        // Refresh the list after deletion
        fetchMCQSets();
      } catch (err) {
        setError('Failed to delete MCQ set. Please try again.');
        console.error('Error deleting MCQ set:', err);
      }
    }
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
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!mcqSets || mcqSets.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          MCQ Sets
        </Typography>
        <Alert severity="info">No MCQ sets available</Alert>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/admin/add-mcq-set')}
        >
          Add New MCQ Set
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        MCQ Sets
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => navigate('/admin/add-mcq-set')}
      >
        Add New MCQ Set
      </Button>
      <List>
        {mcqSets.map((set) => (
          <ListItem key={set.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText
              primary={`${set.category || 'Uncategorized'} - ${set.level || 'No Level'}`}
              secondary={set.questionText}
            />
            <Box>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mr: 1 }}
                onClick={() => handlePreview(set)}
              >
                Preview
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 1 }}
                onClick={() => handleEdit(set)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(set)}
              >
                Delete
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MCQList;