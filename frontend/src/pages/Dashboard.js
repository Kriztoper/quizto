import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
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
      if (!user?.id) return;
  
      dispatch(fetchExamsStart());
      try {
        const response = await apiService.getExams(user.id);
        console.log("API Response:", response.data); // ✅ Check if submittedAt exists
        dispatch(fetchExamsSuccess(response.data));
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load exams';
        dispatch(fetchExamsFailure(errorMessage));
      }
    };
  
    loadExams();
  }, [dispatch, user?.id]);  


  useEffect(() => {
    const loadExams = async () => {
      if (!user?.id) return;
  
      dispatch(fetchExamsStart());
      try {
        const response = await apiService.getExams(user.id);
        console.log("API Response:", response.data); // ✅ Check if submittedAt exists
        dispatch(fetchExamsSuccess(response.data));
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load exams';
        dispatch(fetchExamsFailure(errorMessage));
      }
    };
  
    loadExams();
  }, [dispatch, user?.id]);

  const isProctor = user?.role === 'PROCTOR';

  const handleDelete = async (examId) => {
    try {
      await apiService.deleteExam(examId);
      dispatch(fetchExamsSuccess(exams.filter((e) => e.id !== examId)));
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete exam');
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (submittedAt) => {
    if (!submittedAt || isNaN(Date.parse(submittedAt))) {
      console.warn("Invalid submittedAt:", submittedAt); // ✅ Log invalid dates
      return 'Unknown time';
    }
  
    const submissionDate = new Date(submittedAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now - submissionDate) / 60000);
  
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };  

  return (
    <Box sx={{ width: '100%' }}>
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

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          {isProctor ? 'Manage Exams' : 'Available Exams'}
        </Typography>
        {isProctor && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create-exam')}>
            Create New Exam
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ width: '500px', backgroundColor: 'white' }}>
        {exams?.length > 0 ? (
          exams.map((exam) => (
            <Grid item xs={12} md={6} lg={6} key={exam.id}>
              <Card sx={{boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)'}}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: 30, fontWeight: 'bold' }}>
                    {exam.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: 18, marginBottom: '10px' }}>
                    {exam.description}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 14, color: 'black' }}>
                    Duration: {exam.durationMinutes} minutes
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 15, color: 'black' }}>
                    Questions: {exam.totalQuestions || 0}
                  </Typography>

                  {!isProctor && (
                    <>
                      <Typography variant="body2" sx={{ fontSize: 15, fontWeight: 'bold', marginTop: '8px' }}>
                        Score: {exam.score} / {exam.totalQuestions}
                      </Typography>
                      {exam.totalScore > 0 && (
                        <LinearProgress
                          variant="determinate"
                          value={(exam.score / exam.totalQuestions) * 100}
                          sx={{ height: 8, borderRadius: 4, marginTop: '4px' }}
                        />
                      )}
                      <Box
                        sx={{
                          backgroundColor: '#e3f2fd',
                          padding: '10px',
                          borderRadius: '8px',
                          marginTop: '10px',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontSize: '12px', color: '#1976d2' }}>
                          Took the {exam.title} exam {getTimeAgo(exam.submittedAt)}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: 16, marginTop: '5px', color: 'black' }}>
                          Your score is: <strong>{exam.score} / {exam.totalQuestions}</strong>
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>

                <CardActions>
                  {isProctor ? (
                    <>
                      <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/edit-exam/${exam.id}`)}>
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
                      color={exam.isFinished ? 'secondary' : 'primary'}
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to retake ${exam.title}?`)) {
                          navigate(`/take-exam/${exam.id}`);
                        }
                      }}
                    >
                      {exam.isFinished ? 'Retake Exam' : 'Take Exam'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', mt: 3 }}>
            No exams available.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
