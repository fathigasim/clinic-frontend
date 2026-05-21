import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { invoiceApi } from "./invoiceApi";



export const addInvoice = createAsyncThunk(
    'invoice/addInvoice',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.addInvoiceApi( {
      AppointmentNo: payload.appointmentNumber,  // ← map here
      TotalAmount: payload.totalAmount,
    });
    console.log(`Add Invoice Thunk API response: ${response.data}`);
            return response.data;
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
            .addCase(addInvoice.pending, (state) => {
                state.loading=true;
                state.error=null;
            })
            .addCase(addInvoice.fulfilled, (state, action) => {
                // Handle successful invoice addition, e.g., update state with new invoice
                state.message=action.payload;
                  state.loading=false;
                state.error=null;
            })
            .addCase(addInvoice.rejected, (state, action) => {
                state.loading=false;
                state.error=action.payload;
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

export const selectInvoice=(state) => state.invoice.invoice;
export const selectLatestInvoices=(state) => state.invoice.invoices;
export const selectLoadingInvoices=(state) => state.invoice.loading;
export const selectErrorInvoices=(state) => state.invoice.error;
export default invoiceSlice.reducer;