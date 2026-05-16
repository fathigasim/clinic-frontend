import  { useEffect, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { addDoctorSchedule,getAllDoctors,selectAllDoctors } from '../doctorSlice';
import {Col,Row,Container,Form,FormControl,FormGroup, FormSelect, Button} from 'react-bootstrap'
import {toast} from 'react-toastify'
const DoctorSchedule = () => {
   const [doctorId,setDoctorId] =useState("");
   const [dayOfWeek,setDayOfWeek] =useState("");
   const [startTime,setStartTime] =useState("");
   const [endTime,setEndTime] =useState("");
  const doctors=useSelector(selectAllDoctors);
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(getAllDoctors())
  },[dispatch])
const DoctorScheduleForm = async()=>{
try{
  console.log("Checking both start time and end time:", startTime, endTime)
 var result=  await dispatch(addDoctorSchedule({doctorId,dayOfWeek,startTime: startTime.length === 5 ? `${startTime}:00` : startTime,endTime: endTime.length === 5 ? `${endTime}:00` : endTime})).unwrap();
    console.log("schedule component result data =>",result)
    if(!result.isSuccess){
    
        toast.error(result.errorMessage || "Failed to add schedule.");
        return;
    }
    toast.success(result.data || "Schedule added successfully.");
    }
    catch(err){

        console.log(err)
        toast.error("Failed to add schedule.");
    }
}
  return (
    <>
    <Container>
        <h2>Doctor Schedule</h2>
    
    <Row>
        <Col md={6}>
      <Form noValidate >
             <FormGroup>
                <FormSelect  value={doctorId}  onChange={(e)=>setDoctorId(e.target.value)} placeholder='Doctor'>
                    <option value="">---Select Doctor---</option>
                    {doctors.map((doctor)=>(
                        <option key={doctor.doctorId} value={doctor.doctorId}>{doctor.firstName+' '+doctor.lastName+' '+doctor.specialization}</option>
                    ))}
                </FormSelect>
             </FormGroup>
            <FormGroup>
                <FormSelect value={dayOfWeek} onChange={(e)=>setDayOfWeek(parseInt(e.target.value))} placeholder='Day of Week'>
                      <option value="">---Select Day---</option>
                      <option value={0}>Sunday</option>
                      <option value={1}>Monday</option>
                      <option value={2}>Tuesday</option>
                      <option value={3}>Wednesday</option>
                      <option value={4}>Thursday</option>
                      <option value={5}>Friday</option>
                      <option value={6}>Saturday</option>
                </FormSelect>
            </FormGroup>
            <FormGroup>
                <FormControl type='time' value={startTime}  onChange={(e)=>setStartTime(e.target.value)}  >

                </FormControl>
            </FormGroup>

             <FormGroup>
                <FormControl type='time' value={endTime} onChange={(e)=>setEndTime(e.target.value)}  >

                </FormControl>
            </FormGroup>

            <Button onClick={DoctorScheduleForm}>Add Schedule</Button>
      </Form>
      </Col>
      </Row>
      </Container>
    </>
  )
}

export default DoctorSchedule
