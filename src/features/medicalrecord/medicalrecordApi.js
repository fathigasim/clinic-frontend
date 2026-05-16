
import api from "../../services/api"


export const medicalRecordApi = {
    getMedicalRecordsByPatientIdApi: async () => {
        },
         addmedicalrecordApi: async (payload) => {
            const response = await api.post('/medicalrecords', payload);
            console.log(`api medical record data : ${response.data}`)
            return response.data;
        }
    }