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
export const getPatients = createAsyncThunk(
  'patients/getpatients',
  async (payload,{rejectWithValue}) => {
    try {
      
      const result = await patientApi.fetchPatientsApi(payload);
      console.log('Thunk get patients result => :', result);
      return result.data;
    } catch (error) {
      console.error('Thunk get patients error message=>', error.response.data);
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

export const getPatientById = createAsyncThunk(
  'patients/getpatientById',
  async (id,{rejectWithValue}) => {
    try {
      
      const result = await patientApi.fetchPatientByIdApi(id);
      console.log('Thunk get patient by Id result => :', result);
      return result;
    } catch (error) {
      console.error('Thunk get patients error message=>', error.response.data);
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

export const getTodaysPatients = createAsyncThunk(
  'patients/gettodayspatients',
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
  'patients/addPatient',
  async (patient, { rejectWithValue }) => {
    try {
      const result = await patientApi.addPatientApi(patient);
      console.log('Added Patient Data:', result);
      return result;
    } catch (error) {
       const status = error.response?.status;
      const data = error.response?.data;
    
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

      return rejectWithValue({ message: "Failed to update patient." });
     
    }
  }
);


export const UpdatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({id,patient}, { rejectWithValue }) => {
    try {
      const result = await patientApi.updatePatient(id,patient);
      console.log(' Patient update data:', result);
      return result;
    } catch (error) {
          const status = error.response?.status;
      const data = error.response?.data;
    
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

      return rejectWithValue({ message: "Failed to update patient." });
     
    }
  }
);



// Initial state
const initialState = {
  todayspatients:[],
  patientsResult:null,
  patient:null,
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
   
      .addCase(getPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      }).addCase(getPatients.fulfilled, (state,action) => {
        console.log('fullfiled payload message ',action.payload);
       state.patientsResult=action.payload;
        state.loading = false;
        state.error = null;
      }).addCase(getPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.errorMessage || "Failed to get patients";
        state.message = null;
      }) 
      
      .addCase(getPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      }).addCase(getPatientById.fulfilled, (state,action) => {
        console.log('fullfiled payload message ',action.payload);
       state.patient=action.payload;
        state.loading = false;
        state.error = null;
      }).addCase(getPatientById.rejected, (state) => {
        state.loading = false;
        state.error = null;//action.payload.errorMessage || "Failed to get patients";
        state.message = null;
      }) 
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
      .addCase(UpdatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      }).addCase(UpdatePatient.fulfilled, (state,action) => {
        console.log('fullfiled payload message ',action.payload.data);
       state.message=action.payload;
        state.loading = false;
        state.error = null;
      }).addCase(UpdatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.errorMessage || "Failed to add patient";
        state.message = null;
      }) 
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
export const selectPatientsResult = (state) => state.patient.patientsResult;
export const selectTodaysPatients = (state) => state.patient.todayspatients;
export const selectPatientMessage = (state) => state.patient.message;
export const selectPatientLoading = (state) => state.patient.loading;
export const selectPatientError = (state) => state.patient.error;


export default patientSlice.reducer;