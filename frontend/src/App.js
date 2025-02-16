import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import theme from './theme';
import store from './store';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExamCreation from './pages/ExamCreation';
import ExamTaking from './pages/ExamTaking';
import ExamEdit from './pages/ExamEdit';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-exam"
                element={
                  <PrivateRoute roles={['PROCTOR']}>
                    <ExamCreation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/take-exam/:examId"
                element={
                  <PrivateRoute roles={['STUDENT']}>
                    <ExamTaking />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-exam/:examId"
                element={
                  <PrivateRoute roles={['PROCTOR']}>
                    <ExamEdit />
                  </PrivateRoute>
                }
              />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
