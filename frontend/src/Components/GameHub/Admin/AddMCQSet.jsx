import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMCQSet = () => {
  const navigate = useNavigate();
  const initialQuestionState = {
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    category: 'General Knowledge',
    level: 'Medium',
    timer: 60,
    type: 'MCQ'
  };

  const [questions, setQuestions] = useState([{ ...initialQuestionState }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleQuestionTextChange = (index, value) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = {
        ...newQuestions[index],
        questionText: value
      };
      return newQuestions;
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      const newOptions = [...newQuestions[questionIndex].options];
      newOptions[optionIndex] = value;
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: newOptions
      };
      return newQuestions;
    });
  };

  const handleFieldChange = (index, field, value) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value
      };
      return newQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions(prevQuestions => [...prevQuestions, { ...initialQuestionState }]);
  };

  const removeQuestion = (index) => {
    setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');

      // Validate questions
      const validQuestions = questions.filter(q => 
        q.questionText.trim() !== '' && 
        q.options.every(opt => opt.trim() !== '') && 
        q.correctAnswer.trim() !== ''
      );

      if (validQuestions.length === 0) {
        setError('Please fill in at least one complete question');
        return;
      }

      // Submit each question
      for (const question of validQuestions) {
        const gameDTO = {
          type: 'MCQ',
          questionText: question.questionText,
          answer1: question.options[0],
          answer2: question.options[1],
          answer3: question.options[2],
          answer4: question.options[3],
          correctAnswer: question.correctAnswer,
          category: question.category,
          level: question.level,
          timer: question.timer
        };

        await axios.post('http://localhost:8080/api/games', gameDTO);
      }

      setSuccess('MCQ set added successfully!');
      // Reset form after 2 seconds and navigate back
      setTimeout(() => {
        navigate('/admin/mcq-list');
      }, 2000);
    } catch (err) {
      console.error('Error details:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Error adding MCQ set. Please try again.'
      );
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: 3,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh' 
    }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ 
          mb: 3,
          fontWeight: 600,
          color: '#1a237e'
        }}>
          Add New MCQ Set
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
            {success}
          </Alert>
        )}

        {questions.map((question, questionIndex) => (
          <Paper 
            key={questionIndex} 
            elevation={1} 
            sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2 
            }}>
              <Typography variant="h6" sx={{ color: '#1a237e' }}>
                Question {questionIndex + 1}
              </Typography>
              <Tooltip title="Remove Question">
                <IconButton 
                  color="error" 
                  onClick={() => removeQuestion(questionIndex)}
                  disabled={questions.length === 1}
                  sx={{ opacity: questions.length === 1 ? 0.5 : 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Question Text"
              value={question.questionText}
              onChange={(e) => handleQuestionTextChange(questionIndex, e.target.value)}
              sx={{ mb: 3 }}
              required
              variant="outlined"
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {question.options.map((option, optionIndex) => (
                <Grid item xs={12} sm={6} key={optionIndex}>
                  <TextField
                    fullWidth
                    label={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Correct Answer</InputLabel>
                  <Select
                    value={question.correctAnswer}
                    onChange={(e) => handleFieldChange(questionIndex, 'correctAnswer', e.target.value)}
                    label="Correct Answer"
                    required
                  >
                    {question.options.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option || `Option ${index + 1}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={question.category}
                    onChange={(e) => handleFieldChange(questionIndex, 'category', e.target.value)}
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
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={question.level}
                    onChange={(e) => handleFieldChange(questionIndex, 'level', e.target.value)}
                    label="Level"
                    required
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Timer (seconds)"
                  value={question.timer}
                  onChange={(e) => handleFieldChange(questionIndex, 'timer', e.target.value)}
                  InputProps={{ 
                    inputProps: { min: 10, max: 300 }
                  }}
                  required
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center', 
          mt: 4,
          mb: 2 
        }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={addQuestion}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Add Another Question
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 4
            }}
          >
            Submit MCQ Set
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddMCQSet;