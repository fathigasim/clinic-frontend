 
import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsSchedule, selectDoctorSchedule } from '../doctorSlice';
import {Container} from 'react-bootstrap';
 const DoctorsSchedule = () => {
const dispatch = useDispatch();
const doctorSchedule = useSelector(selectDoctorSchedule);


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
                <th>Doctor Name</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {doctorSchedule?.schedule.Sunday?.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.doctorName}</td>
                  <td>{doctor.startTime}</td>
                  <td>{doctor.endTime}</td>
                </tr>
              ))}
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
           <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginTop:"1rem",boxShadow:"0 4px 8px rgba(0, 0, 0, 0.1)",padding:"1rem",borderRadius:"8px"}}>
         <label style={{fontSize:"1.2rem",fontWeight:"bold"}}>Tuesday</label>
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
              {doctorSchedule?.schedule.Tuesday?.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.doctorName}</td>
                  <td>{doctor.startTime}</td>
                  <td>{doctor.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
     </div>

             <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginTop:"1rem",boxShadow:"0 4px 8px rgba(0, 0, 0, 0.1)",padding:"1rem",borderRadius:"8px"}}>
         <label style={{fontSize:"1.2rem",fontWeight:"bold"}}>Wednesday</label>
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
              {doctorSchedule?.schedule.Wednesday?.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.doctorName}</td>
                  <td>{doctor.startTime}</td>
                  <td>{doctor.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
     </div>
             <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginTop:"1rem",boxShadow:"0 4px 8px rgba(0, 0, 0, 0.1)",padding:"1rem",borderRadius:"8px"}}>
         <label style={{fontSize:"1.2rem",fontWeight:"bold"}}>Thursday</label>
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
              {doctorSchedule?.schedule.Thursday?.map((doctor) => (
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