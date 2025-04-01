import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import apiService from "../services/api";
import {fetchCurriculumsFailure, fetchCurriculumsStart, fetchCurriculumsSuccess} from "../store/slices/curriculumSlice";

const Curriculums = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { curriculums, loading } = useSelector((state) => state.curriculum);

  useEffect(() => {
    const loadCurriculums = async () => {
      if (!user?.id) return;

      dispatch(fetchCurriculumsStart());
      try {
        const response = await apiService.getCurriculums();
        console.log("API Response:", response.data);
        dispatch(fetchCurriculumsSuccess(response.data));
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load curriculums';
        dispatch(fetchCurriculumsFailure(errorMessage));
      }
    };

    loadCurriculums();
  }, [dispatch, user?.id]);

  return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
        )}

        <Grid container spacing={2}
              sx={{ backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center' }}>
          {curriculums?.length > 0 ? (
              curriculums.map((curriculum) => (
                  <Grid item sx={{ maxWidth: '100%' }} xs={12} md={6} lg={6} key={curriculum.id}>
                    <Card sx={{boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)'}}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: 30, fontWeight: 'bold' }}>
                          {curriculum.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: 18, marginBottom: '10px' }}>
                          {curriculum.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
              ))
          ) : (
              <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', mt: 3 }}>
                No curriculums available.
              </Typography>
          )}
        </Grid>
      </Box>
  );
};

export default Curriculums;
