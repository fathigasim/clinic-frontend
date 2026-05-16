import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from './AuthApi';
import { tokenService } from '../../services/tokenService';

export const login = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const result = await authApi.loginApi(loginData);
      console.log('Login Data:', result);
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

export const refresh = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authApi.refreshToken();
      console.log('refresh Data:', result);
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

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logoutApi(); // call FIRST while token still exists
    } catch (error) {
      if (!error.response) {
        console.error('Network error during logout:', error.message);
      } else if (error.response.status === 401) {
        console.warn('Token already invalid, proceeding with local logout');
      } else {
        console.log('Logout API call failed (ignored):', error.message);
      }
    } finally {
      tokenService.clearTokens(); // clear AFTER, always
    }

    return null;
  }
);
// Initial state
const initialState = {

  token:null,
  loading: false,
  error: null,
  
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
 reducers: {
    clearError: (state) => {
    state.error = null;  
    },
  },
  extraReducers: (builder) => {
    builder
   
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(login.fulfilled, (state,action) => {
       state.token= action.payload
         tokenService.setTokens(
          action.payload.accessToken
        );

    
        state.loading = false;
        state.error = null;
      }).addCase(login.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
      //refresh logic
       .addCase(refresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(refresh.fulfilled, (state,action) => {
       state.token= action.payload
         tokenService.setTokens(
          action.payload.accessToken
          
        );
        state.loading = false;
        state.error = null;
      }).addCase(refresh.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 

      //logout
      
       .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(logout.fulfilled, (state) => {
       
        state.loading = false;
        state.error = null;
      }).addCase(logout.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }) 
  },
});

export const { 
  clearError,
} = authSlice.actions;

//  Selectors
export const selectAuthLoading = (state) => state.auth.loading;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;


export default authSlice.reducer;