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
},
PaymentIntentApi: async(invoiceData)=>
{
   const response=  await  api.post('/payments/create-payment-intent',invoiceData);
   return response.data;
},
PaymentDailySalesApi: async()=>
{
   const response=  await  api.get('/PaymentStats');
   return response.data;
},
GetPaymentsByDateApi: async({date,page,pageSize})=>
{
   const response=  await  api.get(`/PaymentStats/GetPaymentsByDate`,{
    params: { date,page,pageSize }
});
   return response.data;
}
}