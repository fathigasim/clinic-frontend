import { useEffect } from "react"
import { useSearchParams } from "react-router"
import { getTodaysAppointments,selectTodaysAppointments,selectAppointmentLoading,selectTotalpages } from "../AppointmentSlice"
import { useDispatch,useSelector } from "react-redux"

import Paginationbootstrap from "../../../components/Pagintationbootstrap"


const TodayAppointments = () => {
    const [searchParams,setSearchParams] = useSearchParams();
      const currentPage = Number(searchParams.get("page")) || 1;
  const pSize = Number(searchParams.get("pageSize")) || 5;
    const dispatch=useDispatch();
    const loading=useSelector(selectAppointmentLoading); 
    const appointments=useSelector(selectTodaysAppointments);
    const totalPages=useSelector(selectTotalpages);
      useEffect(() => {

     dispatch(getTodaysAppointments({  page: currentPage,pageSize: pSize }));
      
  }, [dispatch, currentPage, pSize]);
  return (
    
        <div  className="p-4 border rounded ">
        {console.log("Checking todays appointments",appointments)}
       
            <table className="table table-striped ">
                <thead>
                    <tr>
                        <th className="w-50">Appointment Number</th>
                        <th>Day Of Week</th>
                        <th>Start Time</th>
                 
                  </tr>
                  </thead>
                  
                  <tbody>
                         {
                            appointments.length >0 &&
                            appointments.map((appointemnt)=>(
                                <tr key={appointemnt.id}><td >{appointemnt.appointmentNumber}</td>
                                  <td>{appointemnt.dayOfWeek}</td>
                                  <td>{appointemnt.startTime}</td>
                              
                                </tr>
                            ))
                         }
                  </tbody>
            </table>
          {!loading && appointments.length > 0 && (
      
          <Paginationbootstrap
            page={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />)}
</div>
    
  )
}

export default TodayAppointments
