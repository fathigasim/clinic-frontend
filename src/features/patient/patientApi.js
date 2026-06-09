 import api from '../../services/api';
 
 export const patientApi = {
   fetchPatientsApi: async ({ q,page, pageSize }) => {
    const response = await api.get('/Patient',{params:{q,page,pageSize}});
    console.log(`api todays patients data : ${response.data}`)
    return response.data;
  },
 fetchTodaysPatientsApi: async () => {
    const response = await api.get('/Patient/TodaysPatients');
    console.log(`api todays patients data : ${response.data}`)
    return response.data;
  },
//    fetchProductById: async (Id) => {
//     const response = await api.get(`/Product/${Id}`);
//     console.log(`api product data : ${response.data}`)
//     return response.data;
//   },
    addPatientApi: async (payload) => {
    const response = await api.post('/Patient', payload);
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
//      updateProduct: async (Id, formData) => {
//     const response = await api.put(`/Product/${Id}`, formData,{headers :{ 'Content-Type':'multipart/form-data'}});
//     console.log(`api product data : ${response.data}`)
//     return response.data;
//   },
}
  