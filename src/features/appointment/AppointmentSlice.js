import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppointmentApi } from './AppointmentApi';

export const getTodaysAppointments = createAsyncThunk(
  'appointment/getTodaysappointments',
  async (payload,{rejectWithValue}) => {
    try {
      const result = await AppointmentApi.getTodaysAppointmentsApi({page:payload.page,pageSize:payload.pageSize});
      console.log('Todays appointments thunk result =>:', result);
      return result.data;
    } catch (error) {
      console.error('Error response data:', error.response?.data);
      return rejectWithValue(error.response?.data || 'Not available.');
    }
  }
);

export const getNotInvoicedAppointments = createAsyncThunk(
  'appointment/getnotinvoicedappointments',
  async (_,{rejectWithValue}) => {
    try {
      const result = await AppointmentApi.getNotInvoicedAppointmentsApi();
      console.log('Not invoiced appointments =>:', result);
      return result.data;
    } catch (error) {
      console.error('Error response data:', error.response?.data);
      return rejectWithValue(error.response?.data || 'Not available.');
    }
  }
);

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
  notInvoicedAppointments:[],
  todaysAppointments:[],
  totalPages:0,
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
    .addCase(getTodaysAppointments.pending, (state) => {
        
        state.loading = true;
        state.error = null;
      }).addCase(getTodaysAppointments.fulfilled, (state,action) => {
        state.todaysAppointments=action.payload.items;
        state.totalPages=action.payload.totalPages;
        state.loading = false;
        state.error = null;
      }).addCase(getTodaysAppointments.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
        .addCase(getNotInvoicedAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(getNotInvoicedAppointments.fulfilled, (state,action) => {
        state.notInvoicedAppointments=action.payload;
        state.loading = false;
        state.error = null;
      }).addCase(getNotInvoicedAppointments.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
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
export const selectTodaysAppointments = (state) => state.appointment.todaysAppointments;
export const selectTotalpages = (state) => state.appointment.totalPages;
export const selectNotInvoicedAppointments = (state) => state.appointment.notInvoicedAppointments;
export const selectTodaysAvailableDoctors = (state) => state.appointment.doctorsavailable;
export const selectAllAppointments = (state) => state.appointment.appointments;
export const selectAppointmentLoading = (state) => state.appointment.loading;
export const selectAppointmentError = (state) => state.appointment.error;


export default appointmentSlice.reducer;