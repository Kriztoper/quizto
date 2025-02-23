import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const location = useLocation(); //get current route
  const isLoginPage = location.pathname === "/login"; //checks if login page

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' ,
            overflow: 'hidden', backgroundColor: 'inherit',
    }}>
      {!isLoginPage && (
      <AppBar position="static">
        <Toolbar 
          style={{display: 'flex', 
              justifyContent: 'space-between' , 
              alignItems: 'center',
              backgroundImage: 'linear-gradient(45deg, #008000, #800000)',
              color: 'white',
              }}>

          <img src="quizto.png" alt="My Image" style={{width: '70px'}}/>
          {!isLoginPage && isAuthenticated && <Navigation/>} 
        </Toolbar>
      </AppBar>
     )} 

      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' ,
                padding: isLoginPage ? 0 : '16px', //remove padding in login page
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </Container>
      <Box component="footer" 
            sx={{ 
              py: 2,
              width: '100%',
              textAlign: 'center',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: isLoginPage ? 'none' : 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '40px',
              bgcolor: 'transparent',
              background: isLoginPage ? 'transparent' : 'linear-gradient(to bottom, #7b1113, #1b5e20)'
       }}>


        <Container maxWidth="sm">
          <Typography variant="body2" align="center" fontWeight="bold" color= "white">
            © {new Date().getFullYear()} QuizTo. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
