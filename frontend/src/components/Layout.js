import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar 
          style={{display: 'flex', 
              justifyContent: 'space-between' , 
              alignItems: 'center',
              backgroundImage: 'linear-gradient(45deg, #008000, #800000)',
              color: 'white',}}>
          <img src="quizto.png" alt="My Image" style={{width: '70px'}}/>
          {isAuthenticated && <Navigation/>} 
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </Container>
      <Box component="footer" sx={{ py: 2, bgcolor: 'maroon' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="white" align="center" fontWeight="bold">
            © {new Date().getFullYear()} QuizTo. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
