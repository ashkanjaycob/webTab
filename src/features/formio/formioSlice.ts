import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import formioService from './formioService';

export const fetchFormioAsync = createAsyncThunk('formio/fetchFormio', async () => {
  try {
    const response = await formioService();
    return response.data; 
    
  } catch (err) {
    console.error("Error in fetchFormioAsync:", err.message);
    throw new Error(err.response?.data?.message || "erroe while fetching data : ");
  }
});

const formioSlice = createSlice({
  name: 'formio',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormioAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormioAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(fetchFormioAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Action Error:", action.error);
      });
  },
});

export default formioSlice.reducer;
