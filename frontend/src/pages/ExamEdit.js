import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
import apiService from '../services/api';

const ExamEdit = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    questions: [{ questionText: '', choices: ['', '', '', ''], correctChoiceIndex: 0 }]
  });

  useEffect(() => {
    const loadExam = async () => {
      try {
        const response = await apiService.getExam(examId);
        // Ensure each question has a correctChoiceIndex
        const questions = response.data.questions.map(q => ({
          ...q,
          correctChoiceIndex: q.correctChoiceIndex || 0
        }));
        setExamData({ ...response.data, questions });
        setLoading(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to load exam',
          severity: 'error'
        });
        setLoading(false);
      }
    };
    loadExam();
  }, [examId]);

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
    setSaving(true);
    try {
      await apiService.updateExam(examId, examData);
      setSnackbar({
        open: true,
        message: 'Exam updated successfully!',
        severity: 'success'
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update exam:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update exam',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Exam
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
        disabled={saving}
      >
        {saving ? <CircularProgress size={24} /> : 'Save Changes'}
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

export default ExamEdit;
