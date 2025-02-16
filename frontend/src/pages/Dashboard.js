import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchExamsStart, fetchExamsSuccess, fetchExamsFailure } from '../store/slices/examSlice';
import apiService from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { exams, loading } = useSelector((state) => state.exam);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExams = async () => {
      dispatch(fetchExamsStart());
      try {
        const response = await apiService.getExams(user?.id);
        dispatch(fetchExamsSuccess(response.data));
        setError(null);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load exams';
        dispatch(fetchExamsFailure(errorMessage));
        setError(errorMessage);
      }
    };
    loadExams();
  }, [dispatch]);

  const isProctor = user?.role === 'PROCTOR';

  const handleDelete = async (examId) => {
    try {
      await apiService.deleteExam(examId);
      dispatch(fetchExamsSuccess(exams.filter(e => e.id !== examId)));
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete exam');
    }
  };

  return (
    <Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          {isProctor ? 'Manage Exams' : 'Available Exams'}
        </Typography>
        {isProctor && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-exam')}
          >
            Create New Exam
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {exams.map((exam) => (
          <Grid item xs={12} md={6} lg={4} key={exam.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {exam.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {exam.description}
                </Typography>
                <Typography variant="body2">
                  Duration: {exam.durationMinutes} minutes
                </Typography>
                <Typography variant="body2">
                  Questions: {exam.questions.length}
                </Typography>
                {!isProctor && (
                  <Typography variant="body2">
                    Score: {exam.score}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                {isProctor ? (
                  <>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/edit-exam/${exam.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(exam.id)}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/take-exam/${exam.id}`)}
                  >
                    Take Exam
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
