import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from './AuthApi';
import { tokenService } from '../../services/tokenService';

const extractError = (error) => {
  const data = error.response?.data;
  if (!data) return error.message ?? 'Something went wrong';
  if (Array.isArray(data)) return data;
  if (data.errors) return data.errors;
  if (data.message) return data.message;
  return 'Something went wrong';
};
export const login = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const result = await authApi.loginApi(loginData);
        tokenService.setTokens(result.accessToken);
      return result;
    } catch (error) {
       return rejectWithValue(extractError(error));
     
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (registerData, { rejectWithValue }) => {
    try {
      const result = await authApi.registerApi(registerData);
      // tokenService.setTokens(result.accessToken);
      return result;
    } catch (error) {
     return rejectWithValue(extractError(error));}}
);

export const confirmEmail = createAsyncThunk(
  'auth/confirm-email',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await authApi.confirmEmailApi(payload);
        console.log('confirm email Data:', result);
      return result;
    } catch (error) {
     return rejectWithValue(extractError(error));}}
);

export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await authApi.resetPasswordApi(payload);
        console.log('reset password Data:', result);
      return result;
    } catch (error) {
     return rejectWithValue(extractError(error));}}
);
export const refresh = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authApi.refreshToken();
       tokenService.setTokens(result.accessToken);
      console.log('refresh Data:', result);
      return result;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await authApi.forgotPasswordApi(payload);
     
      console.log('forgot password data:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error in forgot password:', error);
      return rejectWithValue(extractError(error));
    }
  }
);
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logoutApi();
      tokenService.clearTokens(); //  move here
    } catch (error) {
      tokenService.clearTokens(); // clear even on error
      return rejectWithValue(extractError(error));
    }
  }
);
const token = tokenService.getValidAccessToken();
// Initial state
const initialState = {
    isAuthenticated: !!token,
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
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(register.fulfilled, (state) => {
      //  state.token=action.payload.accessToken
        state.loading = false;
        state.error = null;
      }).addCase(register.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      }) 
      //confirm email
        .addCase(confirmEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(confirmEmail.fulfilled, (state) => {
      //  state.token=action.payload.accessToken
        state.loading = false;
        state.error = null;
      }).addCase(confirmEmail.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      }) 
      //forgot password
       .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(forgotPassword.fulfilled, (state) => {
      
        state.loading = false;
        state.error = null;
      }).addCase(forgotPassword.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      }) 
      //reset password
       .addCase(resetPassword.pending, (state) => {
        state.loading = true;})
        .addCase(resetPassword.fulfilled, (state) => {
      //  state.token=action.payload.accessToken
        state.loading = false;
        state.error = null;
      }).addCase(resetPassword.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      }) 
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(login.fulfilled, (state, action) => {
  state.token = action.payload.accessToken;
  state.isAuthenticated = true; //  add this
  state.loading = false;
  state.error = null;
}).addCase(login.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      }) 
      //refresh logic
       .addCase(refresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(refresh.fulfilled, (state, action) => {
  state.token = action.payload.accessToken; // not the whole payload
  state.isAuthenticated = true; // add this
  state.loading = false;
  state.error = null;
  // remove duplicate tokenService.setTokens call, already done in the thunk
})
  
     .addCase(refresh.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      }) 

      //logout
      
       .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null; // ✅ add this
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