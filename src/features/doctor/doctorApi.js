 import api from '../../services/api';
 
 export const doctorApi = {
 getAllDoctorsApi: async () => {
    const response = await api.get('/doctors/doctors-list',{params:{page:1,pageSize:5}});
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
  getDoctorsAvailableSlotsApi: async (doctorId, dayOfWeek) => {
    console.log(`Fetching available slots for doctorId: ${doctorId}, dayOfWeek: ${dayOfWeek}`);
    const response = await api.get('/doctors/available-slots',{params: { doctorId:doctorId, dayOfWeek:dayOfWeek  }});
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
    addDoctorApi: async (payload) => {
    const response = await api.post('/doctors', payload);
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
   addDoctorScheduleApi: async (payload) => {
    const response = await api.post('/doctors/schedule', payload);
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
}
  