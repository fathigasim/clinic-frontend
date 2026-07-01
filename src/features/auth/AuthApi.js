 import api from "../../services/api";
 export const authApi = {

    loginApi: async (payload) => {
    const response = await api.post('/auth/login', payload);
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
  registerApi:async (payload)=>{
        const response = await api.post('/auth/register', payload);
    console.log(`api product data : ${response.data}`)
      return response.data;
  },
  confirmEmailApi: async (payload) => {
    const response = await api.get('/auth/confirm-email', { params: payload });
    console.log(`api confirm email data:`, response.data);
    return response.data;
},
  forgotPasswordApi: async (payload) => {
    const response = await api.post('/auth/foregot-password', payload);
    console.log(`api forgot password data:`, response.data);
    return response.data;
},
  resetPasswordApi: async (payload) => {
    const response = await api.post('/auth/reset-password', payload);
    console.log(`api reset password data:`, response.data);
    return response.data;
},
   refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
   },
   enableMfaApi: async (enableCode) => {
    const response = await api.post('/auth/mfa/enable', { code: enableCode });
   // await axios.post('https://localhost:7032/api/auth/mfa/enable', { code: enableCode });
    console.log(`api enable mfa  : ${response.data}`)
    return response.data;
  },
  verifyMfaApi: async (payload) => {
  const response = await api.post('/auth/login/mfa', payload);
  return response.data;
},
  statusMfaApi:async()=>{
    const response= await api.get('/auth/mfa/status')
    return response.data
  },
   setupMfaApi: async () => {
    
    const response=await  api.get('/auth/mfa/setup');
    console.log(`api setup mfa  : ${response.data}`)
    return response.data;
  },
  disableMfaApi: async (password) => {
    
    const response=  api.post('/auth/mfa/disable', { password });
    console.log(`api disable mfa  : ${response.data}`)
    return response.data;
  },
    mfaStatusApi: async () => {
    const response = await api.post('/auth/mfa/status');
    console.log(`api mfa status  : ${response.data}`)
    return response.data;
  },
  logoutApi: async () => {
    const response = await api.post('/auth/logout');
    console.log(`api logout  : ${response.data}`)
    return response.data;
  }
 }