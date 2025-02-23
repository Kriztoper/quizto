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
        //position: 'fixed',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #7b1113, #1b5e20)',
        overflow: 'hidden',
      }}
    >

      <Paper 
        elevation={10}
        
        sx={{ p: 5, width: '90%', maxWidth: 400, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 3, 
              textAlign: 'center', boxShadow: '0px 10px 30px rgba (0, 0, 0, 0, 0.2)', flexDirection: 'column',
        }}>

        <Typography variant="h4" align="center" gutterBottom
          sx={{color: 'white', fontWeight: 'bold', mb: 2}}
        >
          
          QuizTo
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} indicatorColor='primary' textColor='inherit' centered sx={{ mb: 3,
          '& .MuiTab-indicator': { backgroundColor: 'green'},
          '& .MuiTab-root': {color: 'white', fontWeightL: 'bold'}, //{ color: '#1b5e20', fontWeight: 'bold'},
          '& .Mui-selected': {color: '#FFC107', borderBottom: '2px solid #FFC107'}, //color: '#7b1113', borderBottom: '2px solid #7b1113'},
         }}>

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
            InputProps={{
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.3)'}
              }
            }}
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
              inputProps={{
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.3)'}
                }
              }}
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
            InputProps={{
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                '&hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)'}
              }
            }}
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
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid #7b1113',  
                borderRadius: 2,
                color: 'black',
                fontWeight: 'bold',
                '& .MuiInputBase-root': { 
                  fontSize: '16px',
                  color: '##E8E4C9',
                  fontWeight: 'bold',
                },
                '& .MuiSelect-select': { 
                  padding: '10px',
                },
                '&:hover': { 
                  backgroundColor: '#E8E4C9',
                }}
              }
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
            sx={{ mt: 3,
              py: 1.5,
              fontSize: '16px', 
              borderRadius: 3,
              backgroundColor: '#FFC107',
              color: '#7b1113',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#FFD54F' },
            }}
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
