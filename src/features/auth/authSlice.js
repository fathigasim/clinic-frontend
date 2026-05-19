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
      console.log('Register Data:', result);
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

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logoutApi(); // call FIRST while token still exists
    } catch (error) {
       tokenService.clearTokens();
   return rejectWithValue(extractError(error));
      // clear AFTER, always
    

  //  return null;
  }}
);
  
// export const logout = createAsyncThunk(
//   'auth/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       await authApi.logoutApi(); // call FIRST while token still exists
//     } catch (error) {
//       if (!error.response) {
//         console.error('Network error during logout:', error.message);
//       } else if (error.response.status === 401) {
//         console.warn('Token already invalid, proceeding with local logout');
//       } else {
//         console.log('Logout API call failed (ignored):', error.message);
//       }
//     } finally {
//       tokenService.clearTokens(); // clear AFTER, always
//     }

//     return null;
//   }
// );
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
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(register.fulfilled, (state,action) => {
       state.token=action.payload.accessToken
       

    
        state.loading = false;
        state.error = null;
      }).addCase(register.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      }) 
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(login.fulfilled, (state,action) => {
       state.token= action.payload.accessToken;
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
      }).addCase(refresh.fulfilled, (state,action) => {
       state.token= action.payload
         tokenService.setTokens(
          action.payload.accessToken
          
        );
        state.loading = false;
        state.error = null;
      }).addCase(refresh.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
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