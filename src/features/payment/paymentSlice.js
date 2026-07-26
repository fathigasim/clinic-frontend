import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { paymentApi } from "./paymentApi";
const initialState={
    message:null,
    error:null,
    data:0,
    loading:false,
     clientSecret: null
}
//daily payment sales thunk
export const dailySalesTotal = createAsyncThunk(
    'payment/dailySalesTotal',
    async (_, { rejectWithValue }) => {
        try {
            const response = await paymentApi.PaymentDailySalesApi( );
            return response;
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

      return rejectWithValue("Failed to add payment record");
     
        }
    }
);
//
export const addPayment = createAsyncThunk(
    'payment/addPayment',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await paymentApi.addPaymentApi( payload);
            return response;
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

      return rejectWithValue("Failed to add payment record");
     
        }
    }
);
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await paymentApi.PaymentIntentApi(invoiceData);
      return response; // { clientSecret: '...' }
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const confirmPayment = createAsyncThunk(
    'payment/confirmPayment',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await paymentApi.confirmPaymentApi( payload);
            return response;
        } catch (error) {
            console.error('Error response status:', error.response?.status);
            return rejectWithValue("Failed to confirm payment");
        }});
const paymentSlice=createSlice({
     name: 'payment',
  initialState,

 reducers: {
    clearError: (state) => {
      state.error = null;
      
    },
   clearMessge:(state)=>{
    state.message=null;
   }
  },
  extraReducers:(builder)=>{
    builder.addCase(addPayment.pending,(state)=>{
        state.loading=true;
        state.error=null;
    }).addCase(addPayment.fulfilled,(state)=>{
        state.loading=false;
        state.error=null
    }).addCase(addPayment.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload
    })
     builder.addCase(createPaymentIntent.pending,(state)=>{
        state.loading=true;
        state.error=null
    }).addCase(createPaymentIntent.fulfilled,(state,action)=>{
        state.loading=false;
        state.clientSecret=action.payload.clientSecret;
        state.error=null
    }).addCase(createPaymentIntent.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload
    })
    //daily sales report
    
    builder.addCase(dailySalesTotal.pending,(state)=>{
        state.loading=true;
        state.error=null
    }).addCase(dailySalesTotal.fulfilled,(state,action)=>{
        state.loading=false;
        state.data=action.payload;
        state.error=null
    }).addCase(dailySalesTotal.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload
    })
  }
})
export const {clearMessge,clearError}=paymentSlice.actions;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectClientSecret = (state) => state.payment.clientSecret;
export default paymentSlice.reducer;