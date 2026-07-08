import {selectWeeklyInvoices,getWeeklyInvoices,selectWeeklyInvoicesStatus} from '../invoiceSlice'
import { useDispatch,useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend } from 'recharts';

// const data = [
//   { month: 'Jan', revenue: 4200, cost: 2800 },
//   { month: 'Feb', revenue: 5800, cost: 3100 },
//   { month: 'Mar', revenue: 5100, cost: 2900 },
// ];

export default function WeeklyInvoiceCharts() {

  const dispatch=useDispatch();
  const weeklyInvoices=useSelector(selectWeeklyInvoices);
  const status = useSelector(selectWeeklyInvoicesStatus);
     useEffect(() => {
       if (status === 'idle') {
          dispatch(getWeeklyInvoices())
       }
   }, [dispatch, status]);
    // useEffect(()=>{
    //    const getAllPatientWeeklyInvoices =async()=>{
    //      await dispatch(getWeeklyInvoices()).unwrap()
    //    }

    //    getAllPatientWeeklyInvoices()
    // },[dispatch])



  return (
    <>
    {console.log('Checking all invoices loaded',weeklyInvoices)}
    <ResponsiveContainer width="100%" height={300} className={"mt-5"}>
      <BarChart data={weeklyInvoices} >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="weeklyInvoice" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="weeklyInvoiceTotal" fill="#378ADD" radius={[4, 4, 0, 0]} />
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
      </ResponsiveContainer>
      
     */}
 
  </> 
  );
}