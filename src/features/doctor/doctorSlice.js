import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorApi } from './doctorApi';




export const getAllDoctors = createAsyncThunk(
  'doctor/getAllDoctors',
  async () => {
    try {
      const result = await doctorApi.getAllDoctorsApi();
      console.log('All Doctors Data:', result);
      return result.data;
    } catch (error) {
      console.error('Error response data:', error.response?.data);
      throw error;
    }
  }
);

export const getDoctorsSchedule = createAsyncThunk(
  'doctor/getDoctorsSchedule',
  async () => {
    try {
      const result = await doctorApi.getDoctorsScheduleApi();
      console.log('Doctors Schedule Data:', result);
      return result;
    } catch (error) {
      console.error('Error response data:', error.response?.data);
      throw error;
    }
  }
);



export const getDoctorsAvailableSlots = createAsyncThunk(
  'doctor/getDoctorsAvailableSlots',
  async ({doctorId,dayOfWeek}) => {
    try {
      const result = await doctorApi.getDoctorsAvailableSlotsApi(doctorId,dayOfWeek);
      console.log('Available Slots Data:', result);
      return result;
    } catch (error) {
      console.error('Error response data:', error.response?.data);
      throw error;
    }
  }
);



export const addDoctor = createAsyncThunk(
  'doctor/addDoctor',
  async (doctor, { rejectWithValue }) => {
    try {
      const result = await doctorApi.addDoctorApi(doctor);
      console.log('Added Doctor Data:', result);
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

      return rejectWithValue("Failed to add doctor");
     
    }
  }
);

export const addDoctorSchedule = createAsyncThunk(
  'doctor/doctorSchedule',
  async (schedule, { rejectWithValue }) => {
    try {
      const result = await doctorApi.addDoctorScheduleApi(schedule);
      console.log('Added Doctor Schedule Data:', result);
      return result;
    } catch (error) {
      // console.error('Error response data:', error.response?.data);
      //   rejectWithValue(error.response?.data || error.message || "Failed to add patient");
      //  Handle array of errors
      const errors = error.response.data;
if (error.response?.status === 400) {
  const data = error.response?.data;
  
  const errorMessage = 
    data?.errors?.[""] ?.[0]      // FluentValidation model-level error
    ?? data?.message               // custom { message } response
    ?? data?.title                 // fallback to "ValidationError"
    ?? "Failed to add schedule. Please check your input and try again.";

  return rejectWithValue({ message: errorMessage });
}
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

      return rejectWithValue("Failed to add doctor");
     
    }
  }
);
// Initial state
const initialState = {

  doctors: [],
  doctorSchedule: [],
  data: null,
  loading: false,
  error: null,
  availableSlots: [],
};

// ✅ Slice
const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctorsSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(getDoctorsSchedule.fulfilled, (state,action) => {
        console.log("getDoctorsSchedule.fulfilled result",action.payload)
       state.doctorSchedule=action.payload
        state.loading = false;
        state.error = null;
      }).addCase(getDoctorsSchedule.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
    .addCase(getAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(getAllDoctors.fulfilled, (state,action) => {
        console.log("getAllDoctors.fulfilled result",action.payload)
       state.doctors=action.payload.items
        state.loading = false;
        state.error = null;
      }).addCase(getAllDoctors.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 

       .addCase(getDoctorsAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(getDoctorsAvailableSlots.fulfilled, (state,action) => {
        console.log("getDoctorsAvailableSlots.fulfilled =>",action.payload)
       state.availableSlots=action.payload
        state.loading = false;
        state.error = null;
      }).addCase(getDoctorsAvailableSlots.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
      .addCase(addDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(addDoctor.fulfilled, (state,action) => {
       state.data=action.payload
        state.loading = false;
        state.error = null;
      }).addCase(addDoctor.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
      .addCase(addDoctorSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(addDoctorSchedule.fulfilled, (state,action) => {
       state.data=action.payload
        state.loading = false;
        state.error = null;
      }).addCase(addDoctorSchedule.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
  },
});

export const { 
  clearError, 

} = doctorSlice.actions;

//  Selectors
export const selectAllDoctors = (state) => state.doctor.doctors;
export const selectAvailableSlots = (state) => state.doctor.availableSlots;
export const selectDoctorLoading = (state) => state.doctor.loading;
export const selectDoctorError = (state) => state.doctor.error;
export const selectDoctorSchedule = (state) => state.doctor.doctorSchedule;

export default doctorSlice.reducer;