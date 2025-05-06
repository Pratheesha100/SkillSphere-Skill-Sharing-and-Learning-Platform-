import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMCQSet = () => {
  const navigate = useNavigate();
  const initialQuestionState = {
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: ''
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

  const handleCorrectAnswerChange = (index, value) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = {
        ...newQuestions[index],
        correctAnswer: value
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
          questionText: question.questionText,
          answer1: question.options[0],
          answer2: question.options[1],
          answer3: question.options[2],
          answer4: question.options[3],
          correctAnswer: question.correctAnswer,
          category: 'General Knowledge', // You can add a category selector if needed
          level: 'Medium' // You can add a level selector if needed
        };

        await axios.post('http://localhost:8080/api/games', gameDTO, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
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
    <Box sx={{ textAlign: 'center', mt: 5, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add New MCQ Set
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {questions.map((question, questionIndex) => (
        <Box key={questionIndex} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Question {questionIndex + 1}
          </Typography>
          
          <TextField
            fullWidth
            label="Question Text"
            value={question.questionText}
            onChange={(e) => handleQuestionTextChange(questionIndex, e.target.value)}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            {question.options.map((option, optionIndex) => (
              <Grid item xs={12} sm={6} key={optionIndex}>
                <TextField
                  fullWidth
                  label={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                />
              </Grid>
            ))}
          </Grid>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Correct Answer</InputLabel>
            <Select
              value={question.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(questionIndex, e.target.value)}
              label="Correct Answer"
            >
              {question.options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option || `Option ${index + 1}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            color="error"
            onClick={() => removeQuestion(questionIndex)}
            sx={{ mt: 2 }}
            disabled={questions.length === 1}
          >
            Remove Question
          </Button>
        </Box>
      ))}

      <Button
        variant="outlined"
        color="primary"
        onClick={addQuestion}
        sx={{ mr: 2 }}
      >
        Add Another Question
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Submit MCQ Set
      </Button>
    </Box>
  );
};

export default AddMCQSet;