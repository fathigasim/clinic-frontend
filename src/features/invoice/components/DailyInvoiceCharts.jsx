import {selectDailyInvoices,getDailyInvoices,selectDailyInvoicesStatus} from '../invoiceSlice'
import { useDispatch,useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend,LineChart,Line } from 'recharts';



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
        <Bar dataKey="dailyInvoiceDateTotal" fill='#238765' label={{ value: 'Total', position: 'top', offset: 2, margin: { top: 20 } }} fill="#378ADD" radius={[4, 4, 0, 0]} />
        {/* <Bar dataKey="cost" fill="#73726c" radius={[4, 4, 0, 0]} /> */}
      </BarChart>


    </ResponsiveContainer>
    {/* <ResponsiveContainer width="80%" height={300} className={"mt-5"}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <Line dataKey="revenue" stroke="#378ADD" strokeWidth={2}
            dot={false} activeDot={{ r: 4 }} />
          <Line dataKey="cost" stroke="#1D9E75" strokeWidth={2}
            strokeDasharray="5 4" dot={false} />
        </LineChart>
      </ResponsiveContainer> */}
      
      </>
 
 
  );
}