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
},
 getPaymentsReportPdfApi : async (date) => {
  const response = await api.get(`/PaymentStats/GetPaymentsByDateReportPdf`, {
    params: { date },
    responseType: 'blob', // critical - tells axios to expect binary
  });
   console.log('status:', response.status);
  console.log('content-type:', response.headers['content-type']);
  console.log('data is Blob:', response.data instanceof Blob, 'size:', response.data?.size);
  return response;
},
getPaymentsReportApi: async (date, format = 'pdf') => {
  const response = await api.get(`/PaymentStats/GetPaymentsByDateReport`, {
    params: { date, format },
    responseType: 'blob',
  });
  return response;
}
}