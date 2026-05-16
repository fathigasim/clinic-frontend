import api from "../../services/api"
export const paymentApi ={
 addPaymentApi: async(payload)=>
{
   const response=  await  api.post('/payments',payload);
   return response.data;
}

}