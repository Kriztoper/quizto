import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Box, Typography } from '@mui/material';
import { logout } from '../store/slices/authSlice';

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const isProctor = user?.role === 'PROCTOR';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {isAuthenticated ? (
        <>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          {isProctor && (
            <Button color="inherit" onClick={() => navigate('/create-exam')}>
              Create Exam
            </Button>
          )}
          <Typography variant="body1" sx={{ ml: 2 }}>
            Welcome, {user?.username}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <Button color="inherit" onClick={() => navigate('/login')}>
          Login
        </Button>
      )}
    </Box>
  );
};

export default Navigation;
