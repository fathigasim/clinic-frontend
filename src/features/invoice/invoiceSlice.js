import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { invoiceApi } from "./invoiceApi";
export const getInvoicesByDate = createAsyncThunk(
    'invoice/getInvoicesByDate',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.getInvoicesByDateApi(payload);
            console.log('Printing thunk get Invoices by date response',response)
            return response.data; // already .data from the API layer
        } catch (error) {
            return rejectWithValue(error?.response?.data || "Failed to fetch daily invoices");
        }
    }
);
export const getDailyInvoices = createAsyncThunk(
    'invoice/getDailyInvoices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.getDailyInvoicesApi();
            console.log('Printing thunk getDailyInvoices response',response)
            return response.data; // already .data from the API layer
        } catch (error) {
            return rejectWithValue(error?.response?.data || "Failed to fetch daily invoices");
        }
    }
);
export const getWeeklyInvoices = createAsyncThunk(
    'invoice/getWeeklyInvoices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.getWeeklyInvoicesApi();
            return response.data; // already .data from the API layer
        } catch (error) {
            return rejectWithValue(error?.response?.data || "Failed to fetch monthly invoices");
        }
    }
);
export const getMonthlyInvoices = createAsyncThunk(
    'invoice/getMonthlyInvoices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.getMonthlyInvoicesApi();
            return response.data; // already .data from the API layer
        } catch (error) {
            return rejectWithValue(error?.response?.data || "Failed to fetch monthly invoices");
        }
    }
);
export const getAllInvoices = createAsyncThunk(
    'invoice/getAllInvoice',
    async (_, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.getAllInvoicesApi();
            return response.data; // already .data from the API layer
        } catch (error) {
            return rejectWithValue(error?.response?.data || "Failed to fetch all invoices");
        }
    }
);

export const addInvoice = createAsyncThunk(
    'invoice/addInvoice',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.addInvoiceApi( {
      AppointmentNo: payload.appointmentNumber,  //
      TotalAmount: payload.totalAmount,
    });
    console.log(`Add Invoice Thunk API response: ${response.data}`);
            return response;
        } catch (error) {
           console.error('Error response status:', error.response?.status);
      if (error.response?.status === 409) {
      return  rejectWithValue('record already exists');
      }
        if (error.response?.status === 404) {
      return  rejectWithValue('The requested item was not found');
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

export const getInvoiceByInvoiceNo = createAsyncThunk(
    'invoice/invoiceByInvoiceNo',
    async (invoiceNo, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.getInvoiceByInvoiceNoApi( invoiceNo );
            return response; // already .data from the API layer
        } catch (error) {
            return rejectWithValue(error?.response?.data || "Failed to get invoice by invoice no");
        }
    }
);
export const getPendingInvoices = createAsyncThunk(
    'invoice/pendingInvoices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.getLatestPendingInvoices();
            console.log('Printing thunk response',response)
            return response.data;

        } catch (error) {
            console.error('Error response status:', error.response?.status);

      return rejectWithValue(error?.response?.data||"Failed to get pending invoices");
     
        }
    }
);


const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {
        invoice:null,
        monthlyInvoices:[],
        monthlyStatus: 'idle',
        weeklyInvoices:[],
        weeklyStatus: 'idle',
        dailyInvoices:[],
        dailyStatus: 'idle',
        allInvoices:[],
        invoicesByDate:null,
      invoices:[],  
     loading: false,
     error: null,
     message: null,
    },
    reducers: {
    clearError: (state) => {
        state.error = null;
    },
      resetInvoice: (state) => {
            state.invoice = null; // or {}
        }
},
    extraReducers: (builder) => {
        builder
        .addCase(getInvoicesByDate.pending, (state) => {
                
                state.loading=true;
                state.error=null;
            })
            .addCase(getInvoicesByDate.fulfilled, (state, action) => {
                // Handle successful invoice addition, e.g., update state with new invoice
             
                state.invoicesByDate=action.payload;
                  state.loading=false;
         
                state.error=null;
            })
            .addCase(getInvoicesByDate.rejected, (state) => {
             
                state.loading=false;
                state.error=null;
            })
          .addCase(getDailyInvoices.pending, (state) => {
                    state.dailyStatus = 'loading';
                state.loading=true;
                state.error=null;
            })
            .addCase(getDailyInvoices.fulfilled, (state, action) => {
                // Handle successful invoice addition, e.g., update state with new invoice
             
                state.dailyInvoices=action.payload;
                  state.loading=false;
                   state.dailyStatus = 'succeeded';
                state.error=null;
            })
            .addCase(getDailyInvoices.rejected, (state) => {
                 state.dailyStatus = 'failed';
                state.loading=false;
                state.error=null;
            })
         .addCase(getWeeklyInvoices.pending, (state) => {
                    state.weeklyStatus = 'loading';
                state.loading=true;
                state.error=null;
            })
            .addCase(getWeeklyInvoices.fulfilled, (state, action) => {
                // Handle successful invoice addition, e.g., update state with new invoice
             
                state.weeklyInvoices=action.payload;
                state.weeklyStatus = 'succeeded';
                  state.loading=false;
                state.error=null;
            })
            .addCase(getWeeklyInvoices.rejected, (state) => {
                 state.weeklyStatus = 'failed';
                state.loading=false;
                state.error=null;
            })
          .addCase(getMonthlyInvoices.pending, (state) => {
                state.monthlyStatus = 'loading';
                state.loading=true;
                state.error=null;
            })
            .addCase(getMonthlyInvoices.fulfilled, (state, action) => {
                // Handle successful invoice addition, e.g., update state with new invoice
             
                state.monthlyInvoices=action.payload;
                state.monthlyStatus = 'succeeded';
                  state.loading=false;
                state.error=null;
            })
            .addCase(getMonthlyInvoices.rejected, (state) => {
                state.monthlyStatus = 'failed';
                state.loading=false;
                state.error=null;
            })
           .addCase(getAllInvoices.pending, (state) => {
                state.loading=true;
                state.error=null;
            })
            .addCase(getAllInvoices.fulfilled, (state, action) => {
                // Handle successful invoice addition, e.g., update state with new invoice
             
                state.allInvoices=action.payload;
                  state.loading=false;
                state.error=null;
            })
            .addCase(getAllInvoices.rejected, (state) => {
                
                state.loading=false;
                state.error=null;
            })
            .addCase(addInvoice.pending, (state) => {
                state.loading=true;
                state.error=null;
            })
            .addCase(addInvoice.fulfilled, (state, action) => {
                // Handle successful invoice addition, e.g., update state with new invoice
             
                state.message=action.payload.errorMessage;
                  state.loading=false;
                state.error=null;
            })
            .addCase(addInvoice.rejected, (state,action) => {
                console.log('Checking result for rejection thunk',action.payload)
                state.loading=false;
                state.error=null;
            })  .addCase(getInvoiceByInvoiceNo.pending, (state) => {
   state.loading=true;
                state.error=null;

            })
            .addCase(getInvoiceByInvoiceNo.fulfilled, (state,action) => {
                // Handle successful invoice addition, e.g., update state with new invoice
                state.invoice=action.payload.data;
                state.loading=false;
                state.error=null;
            })
            .addCase(getInvoiceByInvoiceNo.rejected, (state, action) => {
                state.loading=false;
                state.error=action.payload;
                // Handle error case, e.g., set an error message in state
            })
            
            .addCase(getPendingInvoices.pending, (state) => {
   state.loading=true;
                state.error=null;

            })
            .addCase(getPendingInvoices.fulfilled, (state,action) => {
                // Handle successful invoice addition, e.g., update state with new invoice
                state.invoices=action.payload;
                state.loading=false;
                state.error=null;
            })
            .addCase(getPendingInvoices.rejected, (state, action) => {
                state.loading=false;
                state.error=action.payload;
                // Handle error case, e.g., set an error message in state
            });
        }
});
// export const  { clearError } = invoiceSlice.actions;
export const { resetInvoice } = invoiceSlice.actions;
export const selectInvoicesByDate=(state)=>state.invoice.invoicesByDate;
export const selectInvoice=(state) => state.invoice.invoice;
export const selectDailyInvoices=(state) => state.invoice.dailyInvoices;
export const selectDailyInvoicesStatus = (state) => state.invoice.dailyStatus;
export const selectWeeklyInvoices=(state) => state.invoice.weeklyInvoices;
export const selectWeeklyInvoicesStatus = (state) => state.invoice.weeklyStatus;
export const selectMonthlyInvoices=(state) => state.invoice.monthlyInvoices;
export const selectMonthlyInvoicesStatus = (state) => state.invoice.monthlyStatus;
export const selectAllInvoices=(state) => state.invoice.allInvoices;
export const selectLatestInvoices=(state) => state.invoice.invoices;
export const selectLoadingInvoices=(state) => state.invoice.loading;
export const selectErrorInvoices=(state) => state.invoice.error;
export default invoiceSlice.reducer;