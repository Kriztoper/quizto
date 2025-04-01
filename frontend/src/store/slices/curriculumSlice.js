import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    curriculums: [],
    loading: false,
    error: null,
};

export const curriculumSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        fetchCurriculumsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCurriculumsSuccess: (state, action) => {
            state.loading = false;
            state.curriculums = action.payload;
        },
        fetchCurriculumsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchCurriculumsStart,
    fetchCurriculumsSuccess,
    fetchCurriculumsFailure,
} = curriculumSlice.actions;

export default curriculumSlice.reducer;
