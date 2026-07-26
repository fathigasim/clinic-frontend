 import api from '../../services/api';
 
 export const doctorApi = {
   getDoctorScheduleByIdApi: async (id) => {
    const response = await api.get(`/doctors/doctorScheduleById/${id}`);
    console.log(`api Doctors Schedule data : ${response.data}`)
    return response.data;
  },
   getDoctorsScheduleApi: async () => {
    const response = await api.get('/doctors/doctorsSchedule');
    console.log(`api Doctors Schedule data : ${response.data}`)
    return response.data;
  },
  getListedScheduledDoctorsApi: async () => {
    const response = await api.get('/doctors/scheduled-doctors');
    console.log(`api listed doctors data : ${response.data}`)
    return response.data;
  },
 getAllDoctorsApi: async () => {
    const response = await api.get('/doctors/doctors-list',{params:{page:1,pageSize:5}});
    console.log(`api Doctors data : ${response.data}`)
    return response.data;
  },

  getDoctorsAvailableSlotsApi: async (doctorId, dayOfWeek) => {
    console.log(`Fetching available slots for doctorId: ${doctorId}, dayOfWeek: ${dayOfWeek}`);
    const response = await api.get('/doctors/available-slots',{params: { doctorId:doctorId, dayOfWeek:dayOfWeek  }});
    console.log(`api Doctors Available Slots data : ${response.data}`)
    return response.data;
  },
  getDoctorsAvailableSlotsByDateApi: async (doctorId, date) => {
    console.log(`Fetching available slots for doctorId: ${doctorId}, date: ${date}`);
    const response = await api.get('/doctors/available-slots-by-date',{params: { doctorId:doctorId, date:date  }});
    console.log(`api Doctors Available Slots data : ${response.data}`)
    return response.data;
  },
    addDoctorApi: async (payload) => {
    const response = await api.post('/doctors', payload);
    console.log(`api Doctors data : ${response.data}`)
    return response.data;
  },

     editDoctorScheduleApi: async (id,payload) => {
    const response = await api.put(`/doctors/updatedoctorsSchedule/${id}`,payload);
    console.log(`api Doctors data : ${response.data}`)
    return response.data;
  },
   addDoctorScheduleApi: async (payload) => {
    const response = await api.post('/doctors/schedule', payload);
    console.log(`api Doctors Schedule data : ${response.data}`)
    return response.data;
  },
  deleteDoctorScheduleByIdApi: async (id) => {
    const response = await api.delete(`/doctors/doctorsSchedule/${id}`);
    console.log(`api delete Doctors Schedule data : ${response.data}`)
    return response.data;
  },
}
  