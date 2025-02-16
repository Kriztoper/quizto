import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QuizTo
          </Typography>
          {isAuthenticated && <Navigation />}
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
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} QuizTo. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
