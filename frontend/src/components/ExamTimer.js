import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { submitExam } from '../store/slices/examSlice';

const ExamTimer = ({ duration, examId }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const dispatch = useDispatch();

  useEffect(() => {
    if (timeLeft <= 0) {
      dispatch(submitExam(examId));
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, dispatch, examId]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 70, 
      right: 20, 
      bgcolor: 'background.paper',
      p: 2,
      borderRadius: 1,
      boxShadow: 2
    }}>
      <Typography variant="h6" color={timeLeft < 300 ? 'error' : 'primary'}>
        Time Remaining: {formatTime(timeLeft)}
      </Typography>
    </Box>
  );
};

export default ExamTimer;
