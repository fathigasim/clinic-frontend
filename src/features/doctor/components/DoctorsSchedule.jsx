 
import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsSchedule, selectDoctorSchedule } from '../doctorSlice';
import {Container} from 'react-bootstrap';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
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
    </tr>
  ))
)}
            </tbody>
          </table>
     </div>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginTop:"1rem",boxShadow:"0 4px 8px rgba(0, 0, 0, 0.1)",padding:"1rem",borderRadius:"8px"}}>
         <label style={{fontSize:"1.2rem",fontWeight:"bold"}}>Monday</label>
          <br/>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {doctorSchedule?.schedule.Monday?.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.doctorName}</td>
                  <td>{doctor.startTime}</td>
                  <td>{doctor.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
     
     
     </div>


     </Container>
    </>
  )
 }

 export default DoctorsSchedule