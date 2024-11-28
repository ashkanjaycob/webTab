
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchBpmnData from './bpmnService';

export const fetchBpmnAsync = createAsyncThunk('bpmn/fetchBpmn', async () => {
  try {
    const response = await fetchBpmnData();
    // console.log(response.data.data);
    return response.data; 
  } catch (err) {
    console.error("Error in fetchBpmnAsync:", err.message);
    throw new Error("Failed to fetch BPMN data.");
  }
});

const bpmnSlice = createSlice({
  name: 'bpmn',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBpmnAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBpmnAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(fetchBpmnAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bpmnSlice.reducer;
