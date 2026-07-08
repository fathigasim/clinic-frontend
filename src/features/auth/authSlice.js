import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from './AuthApi';
import { tokenService } from '../../services/tokenService';

// const extractError = (error) => {
//   const data = error.response?.data;
//   if (!data) return error.message ?? 'Something went wrong';
//   if (Array.isArray(data)) return data;
//   if (data.errors) return data.errors;
//   if (data.message) return data.message;
//   return 'Something went wrong';
// };
// export const login = createAsyncThunk(
//   'auth/login',
//   async (loginData, { rejectWithValue }) => {
//     try {
//       const result = await authApi.loginApi(loginData);
//       if (result.accessToken) {
//         tokenService.setTokens(result.accessToken);
//       }
//       return result;
//     } catch (error) {
//       console.log('Login thunk error response',error)
//       if(error.response?.status===401)
//       return rejectWithValue(error.response?.data?.message || 'Login failed');
//     }
//   }
// );
export const login = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const result = await authApi.loginApi(loginData);
      if (result.accessToken) {
        tokenService.setTokens(result.accessToken);
      }
      return result;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
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
     return rejectWithValue(error);}}
);

export const confirmEmail = createAsyncThunk(
  'auth/confirm-email',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await authApi.confirmEmailApi(payload);
        console.log('confirm email Data:', result);
      return result;
    } catch (error) {
     return rejectWithValue(error);}}
);

export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await authApi.resetPasswordApi(payload);
        console.log('reset password Data:', result);
      return result;
    } catch (error) {
     return rejectWithValue(error);}}
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
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to request password reset');
    }
  }
);
export const setupMfa = createAsyncThunk(
  'auth/mfa/setup',
  async ( _,{ rejectWithValue }) => {
    try {
      const result = await authApi.setupMfaApi();
     
      console.log('setup mfa data:', result.data);
      return result;
    } catch (error) {
   //   console.error('Error in forgot password:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to request password reset');
    }
  }
);
export const enableMfa = createAsyncThunk(
  'auth/mfa/enable',
  async (enableCode, { rejectWithValue }) => {
    try {
      const result = await authApi.enableMfaApi(enableCode);
     
      console.log('enable mfa data:', result);
      return result;
    } catch (error) {
   //   console.error('Error in forgot password:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to request password reset');
    }
  }
);
export const disableMfa = createAsyncThunk(
  'auth/mfa/disable',
  async (password, { rejectWithValue }) => {
    try {
     // const result =
       await authApi.disableMfaApi(password);
     
   //   console.log('forgot password data:', result.data);
  //    return result;
    } catch (error) {
   //   console.error('Error in forgot password:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to request password reset');
    }
  }
);
export const  statusMfa = createAsyncThunk(
  'auth/mfa/status',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authApi.statusMfaApi();
     
      console.log('mfa stauts data:', result);
      return result;
    } catch (error) {
   //   console.error('Error in forgot password:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to request password reset');
    }
  }
);
export const verifyMfa = createAsyncThunk(
  'auth/login/mfa',
  async ({ mfaToken, code }, { rejectWithValue }) => {
    try {
      const result = await authApi.verifyMfaApi({ mfaToken, code });
      tokenService.setTokens(result.accessToken);
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid code');
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
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);
const token = tokenService.getValidAccessToken();
// Initial state
const initialState = {
  isAuthenticated: false,  // don't trust the token yet
  loading: true,           // block PrivateRoute until we verify
   mfaLoading: false,     //  new — for setup/enable/disable/status
  token: null,
  
  error: null,
  sharedKey:"",
  authenticatorUri:""
};
//  authSlice
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch }) => {
    const token = tokenService.getValidAccessToken();
    if (token) {
      return { accessToken: token }; // already valid, no refresh needed
    }
    // expired or missing → try refresh (uses httpOnly cookie)
    await dispatch(refresh());
  }
);
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
    .addCase(initializeAuth.pending, (state) => {
  state.loading = true;
})
.addCase(initializeAuth.fulfilled, (state, action) => {
  // only set if it returned a token directly (valid token path)
  if (action.payload?.accessToken) {
    state.isAuthenticated = true;
    state.token = action.payload.accessToken;
  }
  state.loading = false;
})
.addCase(initializeAuth.rejected, (state) => {
  state.isAuthenticated = false;
  state.token = null;
  state.loading = false;
})
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
  if (action.payload.accessToken) {
    state.token = action.payload.accessToken;
    state.isAuthenticated = true;
  }
  // if mfaRequired: true, leave isAuthenticated as-is (false)
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
  .addCase(verifyMfa.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(verifyMfa.fulfilled, (state, action) => {
  if (action.payload.accessToken) {
    state.token = action.payload.accessToken;
    state.isAuthenticated = true;
  }
  // if mfaRequired: true, leave isAuthenticated as-is (false)
  state.loading = false;
  state.error = null;
}).addCase(verifyMfa.rejected, (state,action) => {
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
      //enable mfa
         .addCase(enableMfa.pending, (state) => {
        state.mfaLoading = true;
        state.error = null;
      }).addCase(enableMfa.fulfilled, (state) => {
       // state.isAuthenticated = false;
     //   state.token = null; // ✅ add this
         state.mfaLoading = false;
        state.error = null;
        }).addCase(enableMfa.rejected, (state) => {
        state.mfaLoading = false;
        state.error = null;
      }) 
      //disable mfa
       .addCase(disableMfa.pending, (state) => {
        state.mfaLoading = true;
        state.error = null;
      }).addCase(disableMfa.fulfilled, (state) => {
       // state.isAuthenticated = false;
     //   state.token = null; // ✅ add this
         state.mfaLoading = false;
        state.error = null;
        }).addCase(disableMfa.rejected, (state) => {
        state.mfaLoading = false;
        state.error = null;
      }) 
       //setup mfa
       .addCase(setupMfa.pending, (state) => {
        state.mfaLoading = true;
        state.error = null;
      }).addCase(setupMfa.fulfilled, (state,action) => {
       // state.isAuthenticated = false;
     //   state.token = null; // ✅ add this
       state.sharedKey=action.payload.sharedKey;
       state.authenticatorUri=action.payload.authenticatorUri;
         state.mfaLoading = false;
        state.error = null;
        }).addCase(setupMfa.rejected, (state) => {
        state.mfaLoading = false;
        state.error = null;
      }) 
       //status mfa
       .addCase(statusMfa.pending, (state) => {
        state.mfaLoading = true;
        state.error = null;
      }).addCase(statusMfa.fulfilled, (state) => {
       // state.isAuthenticated = false;
     //   state.token = null; // ✅ add this
         state.mfaLoading = false;
        state.error = null;
        }).addCase(statusMfa.rejected, (state) => {
        state.mfaLoading = false;
        state.error = null;
      }) 
  },
  //setup mfa
  
});
export const { 
  clearError,
} = authSlice.actions;

//  Selectors
export const selectAuthLoading = (state) => state.auth.loading;
export const selectMfaLoading = (state) => state.auth.mfaLoading;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;
export const selectSharedKey=(state)=>state.auth.sharedKey;
export const selectAutheticationUri=(state)=>state.auth.authenticatorUri;

export default authSlice.reducer;