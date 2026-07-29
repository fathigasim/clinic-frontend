import {selectWeeklyInvoices,getWeeklyInvoices,selectWeeklyInvoicesStatus} from '../invoiceSlice'
import { useDispatch,useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend,LabelList } from 'recharts';

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
    <ResponsiveContainer width="100%" height={300} className="mt-5">
  <BarChart 
    data={weeklyInvoices}
    margin={{ top: 30, right: 30, left: 40, bottom: 10 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
    <XAxis 
      dataKey="weeklyInvoice" 
      // remove the "Week" axis label entirely — it's redundant, 
      // the day names (Monday/Sunday/Tuesday) already make the axis self-explanatory
    />
    <YAxis 
      tickFormatter={(value) => value.toLocaleString()}
      label={{ 
        value: 'Total Invoiced (SAR)', 
        angle: -90, 
        position: 'left',
        style: { textAnchor: 'middle' },
        dx: -20  // pushes it further left, away from the tick numbers
      }}
    />
    <Tooltip formatter={(value) => value.toLocaleString()} />
    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 10 }} />
    <Bar dataKey="weeklyInvoiceTotal" fill="#378ADD" radius={[4, 4, 0, 0]}>
      <LabelList 
        dataKey="weeklyInvoiceTotal" 
        position="top" 
        formatter={(value) => value.toLocaleString()}
      />
    </Bar>
  </BarChart>
</ResponsiveContainer>
{/* 
      
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';

<ResponsiveContainer width="80%" height={300} className="mt-5">
  <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
    
    <XAxis 
      dataKey="date" 
      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
    />
    
    <YAxis 
      tickFormatter={(value) => value.toLocaleString()}
      label={{ 
        value: 'Amount (SAR)', 
        angle: -90, 
        position: 'left', 
        style: { textAnchor: 'middle' },
        dx: -20 
      }}
    />
    
    <Tooltip formatter={(value) => value.toLocaleString()} />
    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
    
    <Line 
      dataKey="revenue" 
      name="Revenue"
      stroke="#378ADD" 
      strokeWidth={2}
      dot={false} 
      activeDot={{ r: 4 }} 
    />
    <Line 
      dataKey="cost" 
      name="Cost"
      stroke="#1D9E75" 
      strokeWidth={2}
      strokeDasharray="5 4" 
      dot={false} 
    />
  </LineChart>
</ResponsiveContainer> */}
 

 {/* import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend 
} from 'recharts';

const COLORS = ['#378ADD', '#1D9E75', '#F5A623', '#D0021B'];

<ResponsiveContainer width="100%" height={300} className="mt-5">
  <PieChart>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      labelLine={true}
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip formatter={(value) => value.toLocaleString()} />
    <Legend verticalAlign="bottom" />
  </PieChart>
</ResponsiveContainer> */}
  </> 
  );
}