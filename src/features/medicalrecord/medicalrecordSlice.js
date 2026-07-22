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
      const status = error.response?.status;
      const data = error.response?.data;
      
      //  if (status === 400) {
      //   // FluentValidation errors: { "": [...], "DoctorId": [...] }
      //   // OR general error: { message: "..." }
      //   return rejectWithValue(data?.errors ?? data);
      // }
      if (status === 400) {
        console.log(`Checking console fluent api errors`,data?.errors);
  return rejectWithValue({ 
    fieldErrors: data?.errors ?? null, 
    message: data?.message ?? "Validation failed." 
  });

  
}

      if (status === 404) {
        return rejectWithValue({ message: "Resource not found." });
      }
if (status === 422) {
       return rejectWithValue({ message: data?.detail ?? "Unable to process request." });
   }
      if (status === 500) {
        return rejectWithValue({ message: "Server error, please try again later." });
      }

      return rejectWithValue({ message: "Failed to add doctor schedule." });
     
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