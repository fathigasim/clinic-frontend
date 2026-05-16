import {useEffect, useState} from 'react'
import { Container,Row,Col,Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux';
import { addAppointment,getDoctorShiftToday,selectTodaysAvailableDoctors} from '../appointmentSlice';
import {getTodaysPatients,selectTodaysPatients,selectPatientMessage} from '../../patient/patientSlice'
import { selectDoctorLoading,getDoctorsAvailableSlots,selectAvailableSlots } from '../../doctor/doctorSlice';
import { toast } from 'react-toastify'; 

const AppointmentForm = () => {
const [patientId, setPatientId] = useState("");
const [doctorId, setDoctorId] = useState("");
const [dayOfWeek, setDayOfWeek] = useState("");
const [startTime, setStartTime] = useState("");
const [notes, setNotes] = useState("");
//
const [docId, setDocId] = useState("");
const [dOfW, setDOfW] = useState("");
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

  if (!docId) errors.docId = "Please select a doctor.";
  if (dOfW === "" || isNaN(dOfW)) errors.dOfW = "Please select a day.";
  if (Object.keys(errors).length > 0) {
    setFormErrors(prev => ({ ...prev, ...errors }));
    return;
  }

  // safe to dispatch here
  console.log("Dispatching getDoctorsAvailableSlots with doctorId:", docId, "and dayOfWeek:", dOfW);
  await dispatch(getDoctorsAvailableSlots({ doctorId: docId, dayOfWeek: dOfW })).unwrap()};


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
  
   const handleSubmit = async (e) => {
        e.preventDefault();
       // Validate all required fields before dispatching
  const errors = {};
  if (!patientId) errors.patientId = "Please select a patient.";
  if (!doctorId) errors.doctorId = "Please select a doctor.";
  if (dayOfWeek === "" || dayOfWeek === null || dayOfWeek === undefined) {
    errors.dayOfWeek = "Please select a day.";
  }
  if (!startTime) errors.startTime = "Please enter a start time.";
  if (!notes) errors.notes = "Please enter notes.";
  if (Object.keys(errors).length > 0) {
    setFormErrors(prev => ({ ...prev, ...errors }));
    return;
  }
        setFormErrors({ patientId: "", doctorId: "", dayOfWeek: "", startTime: "", notes: "" });
        try {
            const result = await dispatch(addAppointment({ patientId, doctorId, dayOfWeek, startTime: startTime.length === 5 ? `${startTime}:00` : startTime, notes })).unwrap();
     
            if (!result.isSuccess) {
                toast.error(result.errorMessage || 'Failed to add appointment.');
                return;
            }
             setPatientId("");
            setDoctorId("");
            setDayOfWeek("");
            setStartTime("");
            setNotes("");
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
        <Container className='mt-3 justify-content-center'>
        
             <Row>
              <Col md={8}>
        <Alert variant='info'>
          {doctorSlots.length > 0 ? (
            <>
              <p className="text-center" style={{fontSize:"20px"}}><i>Doctor Available Slots</i></p>
              {dOfW !== "" && (
                <div className="d-flex flex-wrap gap-2">
                  {doctorSlots.map((slot, index) => (
                    <div key={index} className="border rounded p-2">
                      {slot.availableSlot}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-center" style={{fontSize:"20px"}}><i>No available slots for the selected doctor and day.</i></p>
          )}
        </Alert>
          </Col>
        </Row>
        
    
    <Row>
      <Col md={8}>
       <h3>Check Doctor availability </h3>
            <Form onSubmit={availableSlots} className="d-flex gap-2 flex-wrap align-items-end mb-4 shadow p-3">
                    <Form.Group controlId="docId" className='mb-3'>
                        <Form.Label>Doctor </Form.Label>
                        <Form.Select type="text" value={docId} onChange={(e) =>{ setDocId(e.target.value)

                            if (formErrors.docId) {
      setFormErrors(prev => ({
        ...prev,
        docId: undefined
      }))}
                        }} isInvalid={!!formErrors.docId} placeholder="Enter doctor" >
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
                        <Form.Select type="text" value={dOfW}
                         onChange={(e) =>{setDOfW(parseInt((e.target.value)))
                         

                            if (formErrors.dOfW) {
      setFormErrors(prev => ({
        ...prev,
        dOfW: undefined
      }))}
                        }}  isInvalid={!!formErrors.dOfW} placeholder="Enter day of week" >
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
            <h3>Book Appointment </h3>
            <Row>
                <Col md={8}>
                 {patientsMessage&&
               <Alert variant='info'>{patientsMessage}</Alert>
            }
                <Form onSubmit={handleSubmit} className="d-flex gap-2 flex-wrap align-items-end mb-4 shadow p-3">
                    <Form.Group controlId="doctorId">
                        <Form.Label>Doctor </Form.Label>
                        <Form.Select type="text" value={doctorId} onChange={(e) =>{ setDoctorId(e.target.value)

                            if (formErrors.doctorId) {
      setFormErrors(prev => ({
        ...prev,
        doctorId: undefined
      }))}
                        }} isInvalid={!!formErrors.doctorId} placeholder="Enter doctor" >
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
                        <Form.Select type="text" value={patientId} onChange={(e) =>{ setPatientId(e.target.value)

                                            if (formErrors.patientId) {
      setFormErrors(prev => ({
        ...prev,
        patientId: undefined
      }))}
                        }} isInvalid={!!formErrors.patientId} placeholder="Patient" >
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
                        <Form.Select type="text" value={dayOfWeek}
                         onChange={(e) =>{setDayOfWeek(parseInt((e.target.value)))
                         

                            if (formErrors.dayOfWeek) {
      setFormErrors(prev => ({
        ...prev,
        dayOfWeek: undefined
      }))}
                        }}  isInvalid={!!formErrors.dayOfWeek} placeholder="Enter day of week" >
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
                       <Form.Group value={startTime} controlId="formBasicNotes">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control type="time" value={startTime} onChange={(e) =>{ setStartTime(e.target.value)

                             if (formErrors.startTime) {
      setFormErrors(prev => ({
        ...prev,
        startTime: undefined
      }))}
                        }} isInvalid={!!formErrors.startTime} placeholder="Enter start time" />
                           <Form.Control.Feedback type="invalid">
          {formErrors.startTime}
           </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group value={notes} controlId="formBasicNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control type="text" value={notes} onChange={(e) =>{ setNotes(e.target.value)
 if (formErrors.notes) {
      setFormErrors(prev => ({
        ...prev,
        notes: undefined
      }))}


                        }}   isInvalid={!!formErrors.notes} placeholder="Enter notes" />
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
