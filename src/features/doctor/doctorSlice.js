import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorApi } from './doctorApi';


export const getDoctorScheduleById = createAsyncThunk(
  'doctor/getDoctorScheduleById',
  async (id) => {
    try {
      const result = await doctorApi.getDoctorScheduleByIdApi(id);
      console.log(' Doctor Schedule By id Data:', result);
      return result;
    } catch (error) {
      console.error('Error response data:', error.response?.data);
      throw error;
    }
  }
);

export const getScheduledDoctors = createAsyncThunk(
  'doctor/getListedScheduledDoctors',
  async () => {
    try {
      const result = await doctorApi.getListedScheduledDoctorsApi();
      console.log('All  listed scheduled Doctors Data:', result);
      return result;
    } catch (error) {
      console.error('Error response data:', error.response?.data);
      throw error;
    }
  }
);
export const getAllDoctors = createAsyncThunk(
  'doctor/getAllDoctors',
  async () => {
    try {
      const result = await doctorApi.getAllDoctorsApi();
      console.log('All Doctors Data:', result);
      return result;
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

export const getDoctorsAvailableSlotsByDate = createAsyncThunk(
  'doctor/getDoctorsAvailableSlotsByDate',
  async ({doctorId,date}) => {
    try {
      const result = await doctorApi.getDoctorsAvailableSlotsByDateApi(doctorId,date);
      console.log('Available Slots By Date:', result);
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
       const status = error.response?.status;
      const data = error.response?.data;
      
      //  if (status === 400) {
      //   // FluentValidation errors: { "": [...], "DoctorId": [...] }
      //   // OR general error: { message: "..." }
      //   return rejectWithValue(data?.errors ?? data);
      // }
      if (status === 400) {
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
//edit doctor
export const EditDoctorSchedule = createAsyncThunk(
  'doctor/editDoctor',
  async ({id,payload}, { rejectWithValue }) => {
    try {
      const result = await doctorApi.editDoctorScheduleApi(id,payload);
      console.log('Added Doctor Data:', result);
      return result;
    } catch (error) {
       const status = error.response?.status;
      const data = error.response?.data;
      
      if (status === 400) {
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
//Add schedule to doctor
export const addDoctorSchedule = createAsyncThunk(
  'doctor/doctorSchedule',
  async (schedule, { rejectWithValue }) => {
    try {
      const result = await doctorApi.addDoctorScheduleApi(schedule);
      return result;
    } catch (error) {
          console.log("full error:", error);
    console.log("status:", error.response?.status);
    console.log("data:", error.response?.data)
      const status = error.response?.status;
      const data = error.response?.data;


      if (status === 400) {
  return rejectWithValue({ 
    fieldErrors: data?.errors ?? null, 
    message: data?.message ?? "Validation failed." 
  });
}
      // if (status === 400) {
      //   // FluentValidation errors: { "": [...], "DoctorId": [...] }
      //   // OR general error: { message: "..." }
      //   return rejectWithValue(data?.errors ?? data);
      // }

      if (status === 404) {
        return rejectWithValue({ message: "Resource not found." });
      }
if (status === 422) {
    return rejectWithValue({ message: data?.message }); // business rule errors
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
  scheduledDoctors:[],
  doctors: [],
  doctorSchedule:null,
  data: null,
  loading: false,
  error: null,
  availableSlots: [],
    availableSlotsByDate: []
};

// Slice
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
       state.doctors=action.payload.data.items||[];
        state.loading = false;
        state.error = null;
      }).addCase(getAllDoctors.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
  .addCase(getScheduledDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(getScheduledDoctors.fulfilled, (state,action) => {
        console.log("getScheduledDoctors.fulfilled result",action.payload)
       state.scheduledDoctors=action.payload;
        state.loading = false;
        state.error = null;
      }).addCase(getScheduledDoctors.rejected, (state) => {
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
       .addCase(getDoctorsAvailableSlotsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(getDoctorsAvailableSlotsByDate.fulfilled, (state,action) => {
        console.log("getDoctorsAvailableSlotsByDate.fulfilled =>",action.payload)
       state.availableSlots=action.payload
        state.loading = false;
        state.error = null;
      }).addCase(getDoctorsAvailableSlotsByDate.rejected, (state) => {
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
      //add doctor schedule
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
      //edit doctor schedule
       .addCase(EditDoctorSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(EditDoctorSchedule.fulfilled, (state,action) => {
       state.data=action.payload
        state.loading = false;
        state.error = null;
      }).addCase(EditDoctorSchedule.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
       .addCase(getDoctorScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(getDoctorScheduleById.fulfilled, (state,action) => {
       state.data=action.payload
        state.loading = false;
        state.error = null;
      }).addCase(getDoctorScheduleById.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
  },
});

export const { 
  clearError, 

} = doctorSlice.actions;

//  Selectors

export const selectScheduledDoctors = (state) => state.doctor.scheduledDoctors;
export const selectAllDoctors = (state) => state.doctor.doctors;
export const selectAvailableSlots = (state) => state.doctor.availableSlots;
export const selectavailableSlotsByDate= (state) => state.doctor.availableSlotsByDate;
export const selectDoctorLoading = (state) => state.doctor.loading;
export const selectDoctorError = (state) => state.doctor.error;
export const selectDoctorSchedule = (state) => state.doctor.doctorSchedule;

export default doctorSlice.reducer;