import {  useState,useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux'
import { selectInvoicesByDate ,getInvoicesByDate,selectLoadingInvoices} from '../invoiceSlice';
import { useSearchParams } from 'react-router';
import { Alert } from 'react-bootstrap';
import Paginationbootstrap from '../../../components/Pagintationbootstrap';

const InvoiceByDateReport = () => {
   
    const [searchParams,setSearchParams]=useSearchParams();
    const paramsPage= Number(searchParams.get("page"))||1;
        const paramsPageSize=Number(searchParams.get("pageSize"))||2;
          const paramsDate=searchParams.get("date");

           const [theDate,setTheDate]=useState(paramsDate);
           const [isActive, setIsActive] = useState(false);
   const dispatch=useDispatch();
    const invoicesByDate=useSelector(selectInvoicesByDate);
     const loading=useSelector(selectLoadingInvoices);
        // Add this effect — re-fetch when page changes
useEffect(() => {
    if (theDate) { // only fetch if a date was already selected
        dispatch(getInvoicesByDate({ page: paramsPage, pageSize: paramsPageSize, date: theDate }));
    }
}, [paramsPage]); //  triggers on every page navigation
      
 
    const  handleSubmit = async(e)=>{
        e.preventDefault();
         await dispatch(getInvoicesByDate({page:paramsPage,pageSize:paramsPageSize,date:theDate}));
            setSearchParams({ page: 1, pageSize: paramsPageSize });// reset to first page on new search
         setIsActive(true);
       console.log("Printing result of invoice by date fuction",invoicesByDate)
    }
    {loading&&
        <div>....Loading</div>
    }
  return (
    <>
     
        <form onSubmit={handleSubmit}>
            <input type="date" name='date' value={theDate} onChange={(e=>setTheDate(e.target.value))}  placeholder='Enter Date'/>
              <button type='submit' style={{color:"#014",transform:"translate(4px)"}}>Search</button>
        </form>
      {console.log('Checking component result',invoicesByDate)}
           {invoicesByDate&&
             invoicesByDate.items.length > 0 ? (
              <>
             <table className='table table-striped'>
               
             {  invoicesByDate.items.map((invoice)=>
            <tr key={invoice.id}>
              <td>{invoice.invoiceNo}</td>
              <td>{invoice.totalAmount}</td>
            </tr>
            )}
            </table>

              <Paginationbootstrap
            page={paramsPage}
            totalPages={invoicesByDate.totalPages}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
            </>
          ):(
              isActive &&
                <Alert>No data found</Alert>
              
            )
           }
       
    </>
  )
}

export default InvoiceByDateReport
