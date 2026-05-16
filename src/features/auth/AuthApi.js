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
  },
   refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
   },
  logoutApi: async () => {
    const response = await api.post('/auth/logout');
    console.log(`api logout  : ${response.data}`)
    return response.data;
  }
 }