import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppointmentApi } from './AppointmentApi';
export const addAppointment = createAsyncThunk(
  'appointment/addAppointment',
  async (payload,{rejectWithValue}) => {
    try {
      const result = await AppointmentApi.addAppointmentApi(payload);
      console.log('Added Appointment Data:', result);
      return result;
    } catch (error) {
  //      console.error('Error response data:', error.response?.data);
  //  return     rejectWithValue(error.response?.data || error.message || "Failed to add patient");
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

export const getDoctorShiftToday = createAsyncThunk(
  'appointment/getDoctorShift',
  async (_,{rejectWithValue}) => {
    try {
      const result = await AppointmentApi.getDoctorsTodayShiftApi();
      console.log('Doctors todays shift:', result);
      return result;
    } catch (error) {
      console.error('Error response data:', error.response?.data);
      return rejectWithValue(error.response?.data || 'Not available.');
    }
  }
);


const initialState = {
  doctorsavailable:[],
  appointments: [],
  data: null,
  loading: false,
  error: null,
  
};

// ✅ Slice
const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      
    },

  },
  extraReducers: (builder) => {
    builder
   
      .addCase(addAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(addAppointment.fulfilled, (state,action) => {
       state.data=action.payload
        state.loading = false;
        state.error = null;
      }).addCase(addAppointment.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 

       .addCase(getDoctorShiftToday.pending, (state) => {
        
        state.loading = true;
        state.error = null;
      }).addCase(getDoctorShiftToday.fulfilled, (state,action) => {
        state.doctorsavailable=action.payload.data;
        state.loading = false;
        state.error = null;
      }).addCase(getDoctorShiftToday.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
  },
});

export const { 
  clearError, 

} = appointmentSlice.actions;

//  Selectors
export const selectTodaysAvailableDoctors = (state) => state.appointment.doctorsavailable;
export const selectAllAppointments = (state) => state.appointment.appointments;
export const selectAppointmentLoading = (state) => state.appointment.loading;
export const selectAppointmentError = (state) => state.appointment.error;


export default appointmentSlice.reducer;