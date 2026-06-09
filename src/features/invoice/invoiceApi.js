import api from "../../services/api";

export const invoiceApi = ({
// Invoice By Date Report
         getInvoicesByDateApi: async ({page,pageSize,date} ) => {
    const response = await api.get(`/Invoice/InvoicesByDate`,{params:{date,page,pageSize}});
    return response.data;
},
          getDailyInvoicesApi: async ( ) => {
    const response = await api.get(`/Invoice/DailyInvoices`);
    return response.data;
},
       getWeeklyInvoicesApi: async ( ) => {
    const response = await api.get(`/Invoice/WeeklyInvoices`);
    return response.data;
},
    getMonthlyInvoicesApi: async ( ) => {
    const response = await api.get(`/Invoice/MonthlyInvoices`);
    return response.data;
},
getAllInvoicesApi: async ( ) => {
    const response = await api.get(`/Invoice`);
    return response.data;
},
     addInvoiceApi:async(payload)=>{

     const response = await api.post('/Invoice', payload);
    console.log(`api invoice data : ${response.data}`)
    return response.data;

    },
getInvoiceByInvoiceNoApi: async (invoiceNo ) => {
    const response = await api.get(`/Invoice/${invoiceNo}`);
    return response.data;
}
    ,
    getLatestPendingInvoices:async()=>{
     const response=await  api.get('/invoice/LatestInvoices');
   
          return response.data;
      
         
    }

});