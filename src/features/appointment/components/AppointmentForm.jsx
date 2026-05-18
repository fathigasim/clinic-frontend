import {useEffect, useState} from 'react'
import { Container,Row,Col,Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux';
import { addAppointment,getDoctorShiftToday,selectTodaysAvailableDoctors} from '../appointmentSlice';
import {getTodaysPatients,selectTodaysPatients,selectPatientMessage} from '../../patient/patientSlice'
import { selectDoctorLoading,getDoctorsAvailableSlots,selectAvailableSlots } from '../../doctor/doctorSlice';
import { toast } from 'react-toastify'; 

    const initialState = {
        patientId: '',
        doctorId: '',
        dayOfWeek: '',
        startTime:'',
        notes:'',
        docId:'',
        dOfW:''
    };
const AppointmentForm = () => {

//



    const [appointment, setAppointment] = useState(initialState);
const [formErrors, setFormErrors] = useState({
  patientId: "",
  doctorId: "",
  dayOfWeek: "",
  startTime: "",
  notes: "",
  docId: "",
  dOfW: "",
});
   const doctorsShift=useSelector(selectTodaysAvailableDoctors)
   const todaypatients=useSelector(selectTodaysPatients)
      const patientsMessage=useSelector(selectPatientMessage)
          const doctorSlots=useSelector(selectAvailableSlots)
   const dispatch=useDispatch();


 const availableSlots = async(e) => {
  e.preventDefault();

  const errors = {};

  if (!appointment.docId) errors.docId = "Please select a doctor.";
  if (appointment.dOfW === "" || isNaN(appointment.dOfW)) errors.dOfW = "Please select a day.";
  if (Object.keys(errors).length > 0) {
    setFormErrors(prev => ({ ...prev, ...errors }));
    return;
  }

  // safe to dispatch here
  console.log("Dispatching getDoctorsAvailableSlots with doctorId:", appointment.docId, "and dayOfWeek:", appointment.dOfW);
  await dispatch(getDoctorsAvailableSlots({ doctorId: appointment.docId, dayOfWeek: appointment.dOfW })).unwrap()};


    useEffect ( ()=>{ 
  

         try{
    dispatch(getTodaysPatients()).unwrap()
    }
    catch(err){
        console.log("fetch todays patients error",err)
    }
     
   },[dispatch])

   useEffect(()=>{
    try{
    dispatch(getDoctorShiftToday()).unwrap()
    }
    catch(err){
      console.log("fetch todays doctors",err)
    }
   },[dispatch])
 const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') return;

    setAppointment((prev) => ({
        ...prev,
        [name]: (() => {
            if (name === "dayOfWeek" || name === "dOfW") {
                return value === '' ? '' : parseInt(value, 10); //  keep '' don't convert to null
            }
            return value;
        })(),
    }));
};
   const handleSubmit = async (e) => {
        e.preventDefault();
       // Validate all required fields before dispatching
  const errors = {};
  if (!appointment.patientId) errors.patientId = "Please select a patient.";
  if (!appointment.doctorId) errors.doctorId = "Please select a doctor.";
  if (appointment.dayOfWeek === "" || appointment.dayOfWeek === null || appointment.dayOfWeek === undefined) {
    errors.dayOfWeek = "Please select a day.";
  }
  if (!appointment.startTime) errors.startTime = "Please enter a start time.";
  if (!appointment.notes) errors.notes = "Please enter notes.";
  if (Object.keys(errors).length > 0) {
    setFormErrors(prev => ({ ...prev, ...errors }));
    return;
  }
        setFormErrors({ patientId: "", doctorId: "", dayOfWeek: "", startTime: "", notes: "" });
        try {
            const result = await dispatch(addAppointment({patientId:appointment.patientId,doctorId: appointment.doctorId,dayOfWeek: appointment.dayOfWeek, startTime: appointment.startTime.length === 5 ? `${appointment.startTime}:00` : appointment.startTime,notes: appointment.notes })).unwrap();
     
            if (!result.isSuccess) {
                toast.error(result.errorMessage || 'Failed to add appointment.');
                return;
            }
           setAppointment(initialState);
            toast.success(result.data || 'Appointment added successfully.');
        } catch (err) {
       
        
          //  toast.error(err);
                      setFormErrors({
      doctorId: err?.DoctorId?.[0],
      patientId: err?.PatientId?.[0],
      dayOfWeek: err?.DayOfWeek?.[0],
      startTime: err?.StartTime?.[0],
      notes: err?.Notes?.[0],
      
    });


        }
    };

  return (
    <>
    {console.log("available slots in component =>", doctorSlots)}
        <Container className='mt-3 mb-3 justify-content-center'>
        
            
    
    <Row>
      <Col md={8}>
       <h3>Check Doctor availability </h3>
            <Form onSubmit={availableSlots} className="d-flex gap-2 flex-wrap align-items-end mb-4 shadow p-3">
                    <Form.Group controlId="docId" className='mb-3'>
                        <Form.Label>Doctor </Form.Label>
                        <Form.Select name='docId' type="text" value={appointment.docId ??''} onChange={ handleInputChange}

                     isInvalid={!!formErrors.docId} placeholder="Enter doctor" >
                            <option value="">---Select Doctor---</option>
                            {doctorsShift&&doctorsShift.map((doctor)=>(
                            <option key={doctor.doctorId} value={doctor.doctorId}>{doctor.firstName}{doctor.lastName}{doctor.specialization}</option>

                            ))}
                            </Form.Select>
                                    <Form.Control.Feedback type="invalid">
          {formErrors.docId}    
           </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="dayOfWId" className='mb-3'>
                        <Form.Label>Day of Week</Form.Label>
                        <Form.Select name='dOfW' type="text" value={appointment.dOfW ??''}
                         onChange={handleInputChange} 
                         isInvalid={!!formErrors.dOfW} placeholder="Enter day of week" >
                             <option value="">---Select a day---</option>
                            <option value={0}>Sunday</option>
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                        </Form.Select>
                            <Form.Control.Feedback type="invalid">
          {formErrors.dOfW}
           </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                    <Button variant="primary" type="submit">
                        Check Available Slots
                    </Button>
                    </Form.Group>
                
            </Form >
            </Col>
            </Row>
             <Row>
           <Col md={8}>
          {doctorSlots.length>0 ?
         (
        <Alert variant='info'>
        
              <p className="text-center" style={{fontSize:"20px"}}><i>Doctor Available Slots</i></p>
              {appointment.dOfW !== "" && (
                <div className="d-flex flex-wrap gap-2">
                  {doctorSlots.map((slot, index) => (
                    <div key={index} className="border rounded p-2">
                      {slot.availableSlot}
                    </div>
                  ))}
                </div>
              )}
          
                </Alert>
  ):(
     <Alert variant='danger'><p>No slots available for this doctor</p></Alert>
  )
           }
    </Col>
        </Row>
        
            <h3>Book Appointment </h3>
            <Row>
                <Col md={8}>
                 {patientsMessage&&
               <Alert variant='info'>{patientsMessage}</Alert>
            }
                <Form onSubmit={handleSubmit} className="d-flex gap-2 flex-wrap align-items-end mb-4 shadow p-3">
                    <Form.Group controlId="doctorId">
                        <Form.Label>Doctor </Form.Label>
                        <Form.Select name='doctorId' type="text" value={appointment.doctorId} onChange={handleInputChange}

                         isInvalid={!!formErrors.doctorId} placeholder="Enter doctor" > 
                            <option value="">---Select Doctor---</option>
                            {doctorsShift&&doctorsShift.map((doctor)=>(
                            <option key={doctor.doctorId} value={doctor.doctorId}>{doctor.firstName}{doctor.lastName}{doctor.specialization}</option>

                            ))}
                            </Form.Select>
                                    <Form.Control.Feedback type="invalid">
          {formErrors.doctorId}
           </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="patientId">
                        <Form.Label>Patient </Form.Label>
                        <Form.Select name='patientId' type="text" value={appointment.patientId} onChange={ handleInputChange}

                     isInvalid={!!formErrors.patientId} placeholder="Patient" >
                            <option>---Select Patient---</option>
                            {todaypatients&&
                                todaypatients.map((patient)=>(
                                  <option key={patient.patientId} value={patient.patientId}>{patient.firstName} {patient.lastName}</option>

                                ))
                            
                                 } 
                            </Form.Select>
          <Form.Control.Feedback type="invalid">
          {formErrors.patientId}
           </Form.Control.Feedback>
                    </Form.Group>
                      <Form.Group controlId="dayOfWeekId">
                        <Form.Label>Day of Week</Form.Label>
                        <Form.Select name='dayOfWeek' type="text" value={appointment.dayOfWeek ??''}
                         onChange={handleInputChange}
                         

   
                      isInvalid={!!formErrors.dayOfWeek} placeholder="Enter day of week" >
                             <option value="">---Select a day---</option>
                            <option value={0}>Sunday</option>
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                        </Form.Select>
                            <Form.Control.Feedback type="invalid">
          {formErrors.dayOfWeek}
           </Form.Control.Feedback>
                    </Form.Group>
                       <Form.Group name='startTime' value={appointment.startTime} controlId="formBasicNotes">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control name='startTime' type="time" value={appointment.startTime} onChange={ handleInputChange}

              
                   isInvalid={!!formErrors.startTime} placeholder="Enter start time" />
                           <Form.Control.Feedback type="invalid">
          {formErrors.startTime}
           </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group name='notes' value={appointment.notes} controlId="formBasicNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control name='notes' type="text" value={appointment.notes} onChange={ handleInputChange}
                        isInvalid={!!formErrors.notes} placeholder="Enter notes" />
    <Form.Control.Feedback type="invalid">
          {formErrors.notes}
           </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" className='mt-3'>
                        Submit
                    </Button>
                </Form>
                </Col>
            </Row>
        </Container>
    </>
  )
}

export default AppointmentForm
