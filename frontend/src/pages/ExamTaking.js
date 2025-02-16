import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExam, submitExam } from '../store/slices/examSlice';
import ExamTimer from '../components/ExamTimer';

const ExamTaking = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const exam = useSelector((state) => state.exam.currentExam);
  const [answers, setAnswers] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchExam(examId));
  }, [dispatch, examId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: parseInt(value),
    });
  };

  const handleSubmit = () => {
    setShowConfirmDialog(true);
  };

  const confirmSubmit = () => {
    dispatch(submitExam({ examId, answers }));
    setShowConfirmDialog(false);
    setSnackbar({
      open: true,
      message: 'Exam submitted successfully!',
      severity: 'success'
    });
    navigate('/dashboard');
    window.location.reload();
  };

  if (!exam) {
    return <Typography>Loading exam...</Typography>;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <ExamTimer duration={exam.durationMinutes} examId={examId} />
      
      <Typography variant="h4" gutterBottom>
        {exam.title}
      </Typography>
      
      {exam.questions.map((question, index) => (
        <Paper key={question.id} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Question {index + 1}
          </Typography>
          <Typography paragraph>{question.questionText}</Typography>
          
          <RadioGroup
            value={answers[question.id]?.toString() || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          >
            {question.choices.map((choice, choiceIndex) => (
              <FormControlLabel
                key={choiceIndex}
                value={choiceIndex.toString()}
                control={<Radio />}
                label={choice}
              />
            ))}
          </RadioGroup>
        </Paper>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== exam.questions.length}
        >
          Submit Exam
        </Button>
      </Box>

      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          Are you sure you want to submit your exam? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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

export default ExamTaking;
