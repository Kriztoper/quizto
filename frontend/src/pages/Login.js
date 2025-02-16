import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import { login, register } from '../services/api';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';

const Login = () => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'STUDENT',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await (tab === 0
        ? login({
            username: formData.username,
            password: formData.password,
          })
        : register({
            username: formData.username,
            password: formData.password,
            email: formData.email,
            role: formData.role,
          }));

      if (response.data && response.data.token) {
        dispatch(loginSuccess(response.data));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure('Invalid response from server'));
      }
    } catch (error) {
      console.error('Auth error:', error);
      dispatch(loginFailure(
        error.response?.data?.message ||
        error.message ||
        'Authentication failed'
      ));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          QuizTo
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />

          {tab === 1 && (
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
          )}

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          {tab === 1 && (
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              required
              SelectProps={{
                native: true,
              }}
            >
              <option value="STUDENT">Student</option>
              <option value="PROCTOR">Proctor</option>
            </TextField>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {tab === 0 ? 'Login' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
