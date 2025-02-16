import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { createExam } from '../store/slices/examSlice';

const ExamCreation = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    questions: [{ 
      questionText: '', 
      choices: ['', '', '', ''], 
      correctChoiceIndex: 0 
    }]
  });

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...examData.questions];
    if (field === 'choices') {
      newQuestions[index].choices = value;
    } else {
      newQuestions[index][field] = value;
    }
    setExamData({ ...examData, questions: newQuestions });
  };

  const addQuestion = () => {
    setExamData({
      ...examData,
      questions: [
        ...examData.questions,
        { questionText: '', choices: ['', '', '', ''], correctChoiceIndex: 0 }
      ]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = examData.questions.filter((_, i) => i !== index);
    setExamData({ ...examData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(createExam(examData)).unwrap();
      setSnackbar({
        open: true,
        message: 'Exam created successfully!',
        severity: 'success'
      });
      // Reset form
      setExamData({
        title: '',
        description: '',
        durationMinutes: 60,
        questions: [{ questionText: '', choices: ['', '', '', ''], correctChoiceIndex: 0 }]
      });
    } catch (error) {
      console.error('Failed to create exam:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create exam. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Exam
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Exam Title"
              value={examData.title}
              onChange={(e) => setExamData({ ...examData, title: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={examData.description}
              onChange={(e) => setExamData({ ...examData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              label="Duration (minutes)"
              value={examData.durationMinutes}
              onChange={(e) => setExamData({ ...examData, durationMinutes: parseInt(e.target.value) })}
              required
            />
          </Grid>
        </Grid>
      </Paper>

      {examData.questions.map((question, qIndex) => (
        <Paper key={qIndex} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Question {qIndex + 1}</Typography>
            <IconButton 
              color="error" 
              onClick={() => removeQuestion(qIndex)}
              disabled={examData.questions.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question Text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                required
              />
            </Grid>
            
            {question.choices.map((choice, cIndex) => (
              <Grid item xs={12} key={cIndex}>
                <TextField
                  fullWidth
                  label={`Choice ${cIndex + 1}`}
                  value={choice}
                  onChange={(e) => {
                    const newChoices = [...question.choices];
                    newChoices[cIndex] = e.target.value;
                    handleQuestionChange(qIndex, 'choices', newChoices);
                  }}
                  required
                />
              </Grid>
            ))}
            
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Correct Answer"
                value={question.correctChoiceIndex}
                onChange={(e) => handleQuestionChange(qIndex, 'correctChoiceIndex', parseInt(e.target.value))}
                SelectProps={{ native: true }}
                required
              >
                {question.choices.map((_, index) => (
                  <option key={index} value={index}>
                    Choice {index + 1}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={addQuestion}
          variant="outlined"
          fullWidth
        >
          Add Question
        </Button>
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Exam'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExamCreation;
