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
import { lightGreen } from '@mui/material/colors';

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
                dispatch(fetchExamsSuccess(response.data));
                setError(null);
              } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'Failed to load exams';
                dispatch(fetchExamsFailure(errorMessage));
                setError(errorMessage);
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

          return (
            <Box sx={{width: '100%'}}>
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

      <div style={{ mb: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center',}}>
        <Typography variant="h4">
          {isProctor ? 'Manage Exams' : 'Available Exams'}
        </Typography>
        {isProctor && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create-exam')}>
            Create New Exam
          </Button>
        )}
      </div>

      <Grid container spacing={2} sx={{width: '500px', backgroundImage: '#f1f8e9en'}}>
        {exams?.length > 0 ? (
          exams.map((exam) => (
            <Grid item xs={12} md={6} lg={6} key={exam.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: 30, fontWeight: 'bold' }}>
                    {exam.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{ fontSize: 18, marginBottom: '10px' }}
                  >
                    {exam.description}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 14, color: 'black' }}>
                    Duration: {exam.durationMinutes} minutes
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 15, color: 'black' }}>
                    Questions: {exam.questions.length}
                  </Typography>

                  {!isProctor && (
                    <>
                      <Typography variant="body2" sx={{ fontSize: 15, fontWeight: 'bold', marginTop: '8px' }}>
                        Score: {exam.score} / {exam.totalScore}
                      </Typography>
                      {exam.totalScore > 0 && (
                        <LinearProgress
                          variant="determinate"
                          value={(exam.score / exam.totalScore) * 100}
                          sx={{ height: 8, borderRadius: 4, marginTop: '4px' }}
                        />
                      )}
                      {(
                        <Box
                          sx={{
                            backgroundColor: '#e3f2fd',
                            padding: '10px',
                            borderRadius: '8px',
                            marginTop: '10px',
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                               You have finished taking the exam in {exam.title}!
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: 16, marginTop: '5px', color: 'black' }}>
                            Your score is: <strong>{exam.score} / {exam.totalScore}</strong>
                          </Typography>
                        </Box>
                      )}
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
                        if (true) {
                          if (window.confirm(`Are you sure you want to retake ${exam.title}?`)) {
                            navigate(`/take-exam/${exam.id}`);
                          }
                        } else {
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
