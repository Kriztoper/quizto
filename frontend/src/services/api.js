import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiService = {
  // Auth methods
  login: (credentials) => {
    const { username, password } = credentials;
    return api.post('/auth/login', { username, password });
  },

  register: (userData) => {
    const { username, password, email, role } = userData;
    return api.post('/auth/register', { username, password, email, role: role.toUpperCase() });
  },

  // Exam methods
  createExam: (examData) => {
    return api.post('/exam', examData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  getExams: (userId) => api.get(`/exam/user/${userId}`),
  getExam: (id) => api.get(`/exam/${id}`),
  updateExam: (id, examData) => api.put(`/exam/${id}`, examData),
  submitExam: (id, answers) => api.post(`/exam/${id}/submit`, {'answers': answers}),
  deleteExam: (id) => api.delete(`/exam/${id}`),
  getLastSubmission: (id) => api.get(`/exam/${id}/last-submission`)
};

export const { login, register, createExam, getExams, getExam, submitExam, deleteExam, updateExam, getLastSubmission } = apiService;

export default apiService;
