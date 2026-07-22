 import api from '../../services/api';
 
 export const patientApi = {
   fetchPatientsApi: async ({ q,page, pageSize }) => {
    const response = await api.get('/Patient',{params:{q,page,pageSize}});
    console.log(`api todays patients data : ${response.data}`)
    return response.data;
  },

  fetchPatientByIdApi: async (id) => {
    const response = await api.get(`/Patient/${id}`);
    console.log(`api get patient data : ${response.data}`)
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
     updatePatient: async (id, payload) => {
    const response = await api.put(`/Patient/${id}`, payload);
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
}
  