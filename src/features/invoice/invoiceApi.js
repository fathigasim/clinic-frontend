import api from "../../services/api";

export const invoiceApi = ({

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