 import api from '../../services/api';
 
 export const AppointmentApi = {
 getDoctorsTodayShiftApi: async () => {
    const response = await api.get('/doctors/doctors-shift');
    console.log(`api product data : ${response.data}`)
    return response.data;
  },
    addAppointmentApi: async (payload) => {
    const response = await api.post('/appointment', payload);
    console.log(`api appointment data : ${response.data}`)
    return response.data;
  },
//    addDoctorScheduleApi: async (payload) => {
//     const response = await api.post('/doctors/schedule', payload);
//     console.log(`api product data : ${response.data}`)
//     return response.data;
//   },
}
  