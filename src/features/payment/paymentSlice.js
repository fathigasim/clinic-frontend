import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { paymentApi } from "./paymentApi";
const initialState={
    message:null,
    error:null,
    data:0,
    paymentslist:[],
    totalPages:0,
    loading:false,
     clientSecret: null
}

//Payments by date with both formats pdf&excel
const contentTypeMap = { pdf: 'application/pdf', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

export const getPaymentsByDateReport = createAsyncThunk(
  'payment/reports/getPaymentsByDateReport',
  async ({ date, format }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPaymentsReportApi(date, format);
      const blob = new Blob([response.data], { type: contentTypeMap[format] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payment-report-${date}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch report';
      return rejectWithValue(errorMessage);
    }
  }
);
//Payments by date
export const getPaymentsByDate = createAsyncThunk(
    'payment/reports/getPaymentsByDate',
    async (params, { rejectWithValue }) => {
        try {
            const response = await paymentApi.GetPaymentsByDateApi({date:params.date,page:params.page,pageSize:params.pageSize });
          console.log('thunk getPaymentsByDate result',response)
            if(!response.isSuccess){
               console.log('dispatching rejectWithValue with:', response.errorMessage);
              return rejectWithValue(response.errorMessage)
            }
            console.log(`thunk getPaymentsByDate response data sucess`,response.data);
            return response.data;
        } catch (error) {
         
      return rejectWithValue(error||"Failed to fetch payments list");
     
        }
    }
);
//PaymentsPdfReport
export const getPaymentsByDatePdf = createAsyncThunk(
  'payment/reports/getPaymentsByDatePdf',
  async (date, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPaymentsReportPdfApi(date);

      if (!response || !response.data) {
        throw new Error('No data received from API');
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payment-report-${date}.pdf`;
      // link.click();
      // window.URL.revokeObjectURL(url);

      document.body.appendChild(link);
link.click();
document.body.removeChild(link);
window.URL.revokeObjectURL(url);

      return true; // Return a serializable success value
    } catch (error) {
      // Extract a serializable string instead of passing the raw Error object
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch payments list';

      return rejectWithValue(errorMessage);
    }
  }
);

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
   },
 
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
    //Payments by date
    builder.addCase(getPaymentsByDate.pending,(state)=>{
        state.loading=true;
        state.error=null;
        state.totalPages=0;
        state.paymentslist=[];
    }).addCase(getPaymentsByDate.fulfilled,(state,action)=>{
      console.log(`success extra reduct result`,action.payload)
        state.loading=false;
        state.paymentslist=action.payload.items||[];
        state.totalPages=action.payload.totalPages;
        state.error=null
        console.log(`success extra reducer  state.payments result`, state.payments)
    }).addCase(getPaymentsByDate.rejected,(state,action)=>{
          console.log(`rejected extra reducer  getPaymentsByDate.rejected`, action.payload)  
      state.loading=false;
        state.error=action.payload;
       state.paymentslist=[];
        state.totalPages=0;
    })
    //
    builder.addCase(getPaymentsByDatePdf.pending,(state)=>{
        state.loading=true;
        state.error=null;
      
    }).addCase(getPaymentsByDatePdf.fulfilled,(state)=>{
   
        state.loading=false;
      
        state.error=null
        console.log(`success extra reducer  state.payments result`, state.payments)
    }).addCase(getPaymentsByDatePdf.rejected,(state)=>{
         
      state.loading=false;
        state.error=null;
      
    })
  }
})
export const {clearMessge,clearError}=paymentSlice.actions;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectClientSecret = (state) => state.payment.clientSecret;
export default paymentSlice.reducer;