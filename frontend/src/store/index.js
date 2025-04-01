import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import examReducer from './slices/examSlice';
import curriculumReducer from './slices/curriculumSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    curriculum: curriculumReducer,
  },
});

export default store;
