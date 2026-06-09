import {useState,useEffect} from 'react'
import { getPatients,selectPatientsResult,selectPatientLoading } from '../patientSlice';
import Paginationbootstrap from '../../../components/Pagintationbootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';


const Patients = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const paramsPage = Number(searchParams.get("page") || "1");
    const paramsPageSize = Number(searchParams.get("pageSize") || "2");
    
    const [query, setQuery] = useState(searchParams.get("q") || ""); // initialize query from URL

    const dispatch = useDispatch();
    const patientResult = useSelector(selectPatientsResult);
    const loading = useSelector(selectPatientLoading);
    useEffect(() => {
        // Fetch patients when component mounts or when page changes
        dispatch(getPatients({ q: query, page: paramsPage, pageSize: paramsPageSize }));
    }, [dispatch, paramsPage, paramsPageSize]); // re-fetch when page or pageSize changes
    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ q: query, page: 1, pageSize: paramsPageSize });
        dispatch(getPatients({ q: query ?? "", page: 1, pageSize: paramsPageSize }));
        console.log("Printing result of get patients fuction", patientResult);
    };
    if (loading) {
        return <div>Loading...</div>;
    }
  return (
    
    <>
        <form onSubmit={handleSubmit}>
            <input type="text" name='query' value={query} onChange={(e)=>setQuery(e.target.value)}  placeholder='Enter Query'/>
              <button type='submit' style={{color:"#014",transform:"translate(4px)"}}>Search</button>
        </form>
        {loading&&
        <div>....Loading</div>
    }
        {patientResult&&
             patientResult.items.length > 0 ? (
              <>
             <table className='table table-striped'>    
                {  patientResult.items.map((patient)=>
                    <tr key={patient.id}>
                        <td>{patient.firstName}</td>
                          <td>{patient.lastName}</td>
                        <td>{patient.email}</td>
                    </tr>
                )}
             </table>

                 <Paginationbootstrap
                         page={paramsPage}
                         totalPages={patientResult.totalPages}
                         searchParams={searchParams}
                         setSearchParams={setSearchParams}
                       />
            </>
        ):(
            <div>No patients found</div>
        )}
    </>
  )
}

export default Patients
