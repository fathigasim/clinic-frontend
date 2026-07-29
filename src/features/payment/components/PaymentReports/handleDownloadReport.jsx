export const DownloadReport = ({date}) => {

    return(
        <button onClick={()=>{
  const url = `https://localhost:7032/api/PaymentStats/GetPaymentsByDateReportPdf?date=${date}`;
  window.open(url, '_blank');
        }}>Download</button>
    )
};

//optoin a
// const handleDownloadReport = async () => {
//   const response = await api.get(`/PaymentStats/GetPaymentsByDateReport`, {
//     params: { date },
//     responseType: 'blob', // critical - tells axios to expect binary
//   });

//   const blob = new Blob([response.data], { type: 'application/pdf' });
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = `payment-report-${date}.pdf`;
//   link.click();
//   window.URL.revokeObjectURL(url);
// };
//optoin b
{/* <Button variant="secondary" onClick={handleDownloadReport}>
  Download PDF
</Button> */}