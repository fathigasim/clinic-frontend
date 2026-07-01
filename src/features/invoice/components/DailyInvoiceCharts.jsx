import {selectDailyInvoices,getDailyInvoices,selectDailyInvoicesStatus} from '../invoiceSlice'
import { useDispatch,useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend,LabelList,LineChart,Line } from 'recharts';



export default function DailyInvoiceCharts() {
   
  const dispatch=useDispatch();
  const dailyInvoices=useSelector(selectDailyInvoices);
  const status = useSelector(selectDailyInvoicesStatus);
 useEffect(() => {
    if (status === 'idle') {
        dispatch(getDailyInvoices());
    }
}, [dispatch, status]);



  return (
    <>
    {console.log('Checking all invoices loaded',dailyInvoices)}
    <ResponsiveContainer width="100%" height={300} className={"mt-5"}>
      <BarChart data={dailyInvoices} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="dailyInvoiceDate" label={{ value: 'Date', position: 'bottom', offset: 0 }} />
        <YAxis  label={{ value: 'Total', position: 'top-left', offset: 0 }} />
        <Tooltip />
        <Legend />
        {/* <Bar dataKey="dailyInvoiceDateTotal" fill='#238765' label={{ value: 'Total', position: 'top', offset: 2, margin: { top: 20 } }} fill="#378ADD" radius={[4, 4, 0, 0]} /> */}
        <Bar dataKey="dailyInvoiceDateTotal" name="Total" fill="#378ADD" radius={[4, 4, 0, 0]}>
  <LabelList
    dataKey="dailyInvoiceDateTotal"
    position="top"
    formatter={(value) => `$${value.toLocaleString()}`}
  />
</Bar>
      </BarChart>


    </ResponsiveContainer>
  
      
      </>
 
 
  );
}