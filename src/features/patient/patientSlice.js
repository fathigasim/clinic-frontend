import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


import { patientApi } from './patientApi';
// Async thunks

// export const fetchAllProducts = createAsyncThunk(
//   'product/fetchAllProducts',
//   async ({q,categoryId,pageNumber,pageSize}) => {

    

//     try {
//       console.log('Fetching Products');
//       const result = await patientApi.fetchProduct({q,categoryId,pageNumber,pageSize});
//       console.log('Products Data :', result);
//       return result;
//     } catch (error) {
//       console.error('Something went wrong:', error);
//      // return rejectWithValue(error.message);
//     }
//   }
// );

export const getTodaysPatients = createAsyncThunk(
  'product/fetchtodayspatients',
  async (_,{rejectWithValue}) => {
    try {
      
      const result = await patientApi.fetchTodaysPatientsApi();
      console.log('Thunk todays patients result => :', result);
      return result;
    } catch (error) {
      console.error('Thunk todays patient error message=>', error.response.data);
         if(!error.response){
      return rejectWithValue("Sever network error");
         }
            if(!error.response.data){
           
      return rejectWithValue("Patients not avaiable");
         }
             if(error.response.data){
           const errors=   error.response.data.errors
      return rejectWithValue(errors);
         }
    }
  }
);

export const addPatient = createAsyncThunk(
  'patient/addPatient',
  async (patient, { rejectWithValue }) => {
    try {
      const result = await patientApi.addPatientApi(patient);
      console.log('Added Patient Data:', result);
      return result;
    } catch (error) {
      console.error('Error response data:', error.response?.data);
        rejectWithValue(error.response?.data || error.message || "Failed to add patient");
      //  Handle array of errors
      const errors = error.response.data;
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

      return rejectWithValue("Failed to add product");
     
    }
  }
);



// Initial state
const initialState = {
  todayspatients:[],
  message:null,
  loading: false,
  error: null,
  
};

// ✅ Slice
const patientSlice = createSlice({
  name: 'patient',
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
   
      .addCase(addPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      }).addCase(addPatient.fulfilled, (state,action) => {
        console.log('fullfiled payload message ',action.payload.data);
       state.message=action.payload.data
        state.loading = false;
        state.error = null;
      }).addCase(addPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.errorMessage || "Failed to add patient";
        state.message = null;
      }) 
      //
       .addCase(getTodaysPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      }).addCase(getTodaysPatients.fulfilled, (state,action) => {
        console.log('fullfiled payload message ',action.payload.data);
       state.todayspatients=action.payload.data;
        state.message=action.payload.errorMessage;
        state.loading = false;
        state.error = null;
      }).addCase(getTodaysPatients.rejected, (state) => {
        state.loading = false;
        state.error = null;
        
      }) 
  },
});

export const { 
  clearError, 
clearMessge
} = patientSlice.actions;

//  Selectors
export const selectTodaysPatients = (state) => state.patient.todayspatients;
export const selectPatientMessage = (state) => state.patient.message;
export const selectPatientLoading = (state) => state.patient.loading;
export const selectPatientError = (state) => state.patient.error;


export default patientSlice.reducer;