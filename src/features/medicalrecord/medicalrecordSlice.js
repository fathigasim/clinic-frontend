import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


import { medicalRecordApi } from './medicalrecordApi';
// Async thunks



export const addmedical = createAsyncThunk(
  'medicalrecord/addMedicalRecord',
  async (medicalRecord, { rejectWithValue }) => {
    try {
      const result = await medicalRecordApi.addmedicalrecordApi(medicalRecord);
      console.log('Added Medical Record Data:', result);
      return result;
    } catch (error) {
      console.error('Error response status:', error.response?.status);
      if (error.response?.status === 409) {
      return  rejectWithValue({exceptionMessage:'record already exists'});
      }
        if (error.response?.status === 404) {
      return  rejectWithValue({exceptionMessage:'The requested item was not found'});
      }
      console.error('Error response data:', error.response?.data);
      //  Handle array of errors
      const errors = error?.response?.data;
  console.log("testing errors before reject with values",errors)
      if (Array.isArray(errors)) {
        // If it's an array, join into a string or return as-is
        return rejectWithValue(errors);
      }

      // If it's an object with errors property
      if (errors?.errors) {
        return rejectWithValue(errors.errors);
      }

      // If it's an object with message
      if (errors?.message) {
        return rejectWithValue(errors.message);
      }

      return rejectWithValue("Failed to add medical record");
     
    }
  }
);



// Initial state
const initialState = {


  loading: false,
  error: null,
  
};

//  Slice
const medicalRecordSlice = createSlice({
  name: 'medicalrecord',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      
    },
   clearMessge:(state)=>{
    state.message=null;
   }
  },
  extraReducers: (builder) => {
    builder
   
      .addCase(addmedical.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      }).addCase(addmedical.fulfilled, (state,action) => {
        console.log('fullfiled payload message ',action.payload.data);
    
        state.loading = false;
        state.error = null;
      }).addCase(addmedical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.errorMessage || "Failed to add medical record";
        state.message = null;
      }) 
      //
     
}} );

export const { 
  clearError, 
clearMessge
} = medicalRecordSlice.actions;

//  Selectors

export const selectMedicalRecordLoading = (state) => state.medicalrecord.loading;
export const selectMedicalRecordError = (state) => state.medicalrecord.error;


export default medicalRecordSlice.reducer;