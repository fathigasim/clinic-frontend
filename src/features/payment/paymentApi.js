import api from "../../services/api"
export const paymentApi ={
 addPaymentApi: async(payload)=>
{
   const response=  await  api.post('/payments',payload);
   return response.data;
},
confirmPaymentApi: async(paymentIntentId)=>
{
   const response=  await  api.post('/payments/confirm-payment',{paymentIntentId});
   return response.data;
}
}