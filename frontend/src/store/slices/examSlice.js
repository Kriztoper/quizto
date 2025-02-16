import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createExam as apiCreateExam,
  getExam as apiGetExam,
  submitExam as apiSubmitExam,
  getLastSubmission as apiGetLastSubmission
} from '../../services/api';

const initialState = {
  exams: [],
  currentExam: null,
  loading: false,
  error: null,
  timeRemaining: null,
  lastSubmission: null,
};

export const fetchExam = createAsyncThunk(
  'exam/fetchExam',
  async (examId, { rejectWithValue }) => {
    try {
      const response = await apiGetExam(examId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch exam'
      );
    }
  }
);

export const createExam = createAsyncThunk(
  'exam/createExam',
  async (examData, { rejectWithValue }) => {
    try {
      const response = await apiCreateExam(examData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to create exam'
      );
    }
  }
);

export const submitExam = createAsyncThunk(
  'exam/submitExam',
  async ({ examId, answers }, { rejectWithValue }) => {
    try {
      const response = await apiSubmitExam(examId, answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to submit exam'
      );
    }
  }
);

export const fetchLastSubmission = createAsyncThunk(
  'exam/fetchLastSubmission',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetLastSubmission();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch last submission'
      );
    }
  }
);

export const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    fetchExamsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchExamsSuccess: (state, action) => {
      state.loading = false;
      state.exams = action.payload;
    },
    fetchExamsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentExam: (state, action) => {
      state.currentExam = action.payload;
    },
    createExamSuccess: (state, action) => {
      state.exams.push(action.payload);
    },
    updateExamSuccess: (state, action) => {
      const index = state.exams.findIndex(exam => exam.id === action.payload.id);
      if (index !== -1) {
        state.exams[index] = action.payload;
      }
    },
    deleteExamSuccess: (state, action) => {
      state.exams = state.exams.filter(exam => exam.id !== action.payload);
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setLastSubmission: (state, action) => {
      state.lastSubmission = action.payload;
    },
  },
  extraReducers: (builder) => {
    // submitExam
    builder
      .addCase(submitExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSubmission = action.payload;
      })
      .addCase(submitExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchLastSubmission
    builder
      .addCase(fetchLastSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLastSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSubmission = action.payload;
      })
      .addCase(fetchLastSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchExam
    builder
      .addCase(fetchExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExam.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExam = action.payload;
      })
      .addCase(fetchExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // createExam
      .addCase(createExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exams.push(action.payload);
      })
      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  fetchExamsStart,
  fetchExamsSuccess,
  fetchExamsFailure,
  setCurrentExam,
  createExamSuccess,
  updateExamSuccess,
  deleteExamSuccess,
  setTimeRemaining,
} = examSlice.actions;

export default examSlice.reducer;
