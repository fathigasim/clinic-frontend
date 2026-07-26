 
import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsSchedule, selectDoctorSchedule ,deleteDoctorSchedule} from '../doctorSlice';
import {Button, Container} from 'react-bootstrap';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import DeleteDoctorScheduleModal from './DeleteDoctorScheduleModal';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaBeer } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";

 const DoctorsSchedule = () => {
const dispatch = useDispatch();
const doctorSchedule = useSelector(selectDoctorSchedule);
const location=useLocation();
   
useEffect(() => {
    const fetchDoctorSchedule = async () => {
      try { 
        await dispatch(getDoctorsSchedule());
    
      
      } catch (error) {
        console.error('Error fetching doctor schedule:', error);
      }
    };

    fetchDoctorSchedule();
  }, [dispatch]);
useEffect(() => {
    if (location.state?.message) {
      toast.info(location.state.message);

      // Clear location state so toast doesn't re-appear on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const handleDeleteDoctorSchedule=async (id)=>{
    try{
      const result= await  dispatch(deleteDoctorSchedule(id)).unwrap();
            console.log(`printing out delete doctor schedule result`,result)     
        toast.info(result);
 await dispatch(getDoctorsSchedule());
    }
      catch(error){
           console.log(error)
      }
  }
  return ( <>
    {console.log("doctorSchedule data in component =>",doctorSchedule?.schedule?.Sunday?.[0]?.doctorName)}
    <Container style={{marginTop:"2rem"}}>
     <label style={{fontSize:"1.5rem",fontWeight:"bold"}}>Doctors Weekly Schedule</label>
     <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginTop:"1rem",boxShadow:"0 4px 8px rgba(0, 0, 0, 0.1)",padding:"1rem",borderRadius:"8px"}}>
         <label style={{fontSize:"1.2rem",fontWeight:"bold"}}>Sunday</label>
          <br/>
          <table className="table table-striped">
            <thead>
              <tr>
                     <th>Schedule Date </th>
                <th>Doctor Name</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {/* {doctorSchedule?.schedule.scheduleDate?.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.doctorName}</td>
                  <td>{doctor.startTime}</td>
                  <td>{doctor.endTime}</td>
                </tr>
              ))} */}
              {Object.entries(doctorSchedule?.schedule ?? {}).map(([date, doctors]) =>
  doctors.map((doctor) => (
    <tr key={`${doctor.doctorId}-${date}`}>
      <td>{doctor.scheduleDate}</td>
      <td>{doctor.doctorName}</td>
      <td>{doctor.startTime}</td>
      <td>{doctor.endTime}</td>
      <td><Link to={`/Doctors/editdoctors/${doctor.doctorId}`}>Edit</Link></td>
       <td>
        {/* <Button type='submit' onClick={()=>{
      var confirmed=   window.confirm('Are you sure you want to delete?');
           if(confirmed)
          handleDeleteDoctorSchedule(doctor.doctorId)
         
        }
       } variant='danger'> Delete</Button> */}
       <DeleteDoctorScheduleModal id={doctor.doctorId}/>
       
       </td>
    </tr>
  ))
)}
            </tbody>
          </table>
     
     
     </div>


     </Container>
    </>
  )
 }

 export default DoctorsSchedule