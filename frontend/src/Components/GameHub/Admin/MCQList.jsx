import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
  Paper,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
      const mcqGames = response.data.filter(game => game.type === 'MCQ');
      setMcqSets(mcqGames);
      setError('');
    } catch (err) {
      setError('Failed to fetch MCQ sets. Please try again.');
      console.error('Error fetching MCQ sets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (set) => {
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
        await axios.delete(`http://localhost:8080/api/games/${set.id}`);
        await fetchMCQSets();
        Swal.fire('Deleted!', 'MCQ set has been deleted.', 'success');
      }
    } catch (err) {
      console.error('Error deleting MCQ set:', err);
      Swal.fire('Error!', 'Failed to delete the MCQ set.', 'error');
    }
  };

  const handleEdit = (set) => {
    navigate(`/admin/edit-game/${set.id}`);
  };

  const handlePreview = (set) => {
    navigate(`/admin/preview-mcq/${set.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
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
            MCQ Questions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/add-mcq-set')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: 2
            }}
          >
            Add New MCQ Set
          </Button>
        </Box>

        {mcqSets.length === 0 ? (
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              No MCQ questions available. Create your first question set!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/admin/add-mcq-set')}
              sx={{
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Create New MCQ Set
            </Button>
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {mcqSets.map((set) => (
              <Grid item xs={12} key={set.id}>
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
                      {set.questionText}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={`Category: ${set.category || 'N/A'}`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip 
                        label={`Level: ${set.level || 'N/A'}`}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip 
                        label={`Timer: ${set.timer || 'N/A'} seconds`}
                        color="info"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      flexWrap: 'wrap',
                      '& .MuiChip-root': {
                        backgroundColor: '#e3f2fd'
                      }
                    }}>
                      <Chip label={set.answer1} size="small" />
                      <Chip label={set.answer2} size="small" />
                      <Chip label={set.answer3} size="small" />
                      <Chip label={set.answer4} size="small" />
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 1,
                        color: 'success.main',
                        fontWeight: 500
                      }}
                    >
                      Correct Answer: {set.correctAnswer}
                    </Typography>
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
                      onClick={() => handlePreview(set)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
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
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default MCQList;