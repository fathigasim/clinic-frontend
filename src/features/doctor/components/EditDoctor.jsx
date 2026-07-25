import {useEffect} from 'react'
import { useParams } from 'react-router'
import { useDispatch,useSelector} from 'react-redux';
import { getDoctorScheduleById,EditDoctorSchedule} from '../doctorSlice';
import { Spinner,Container,Col,Row,Form, FormControl, FormGroup, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Feedback from 'react-bootstrap/esm/Feedback';
import { useNavigate } from 'react-router';

export const EditDoctor = () => {
    const {id}=useParams();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {loading,error,data:doctor}=useSelector((state)=>state.doctor);

      const {
          register,
          handleSubmit,
          setError,
          formState: { errors },
          watch,
          reset
        } = useForm(
        //  {values: doctor}
        );
    useEffect(()=>{
        console.log('Checking Id got to edit doctor component',id);
      if(id==null)
      {
        return;
      }
         dispatch(getDoctorScheduleById(id));
    },[dispatch,id])

      useEffect(()=>{
        if(doctor&&doctor.doctorId===id)
        {
          console.log(`doctor shape before the reset`,doctor)
          reset({
            doctorId:doctor.doctorId,
doctorName:doctor.doctorName,
scheduleDate:doctor.scheduleDate,//.split("T")[0],

startTime:doctor.startTime,
endTime:doctor.endTime

          })
        }
      },[doctor,id,reset])
     if(error){
      return (<div className='alert alert-danger'>{error}</div>)
     }

     const handleUpdateDoctorSchedule =async (data,e)=>{
      e.preventDefault();
            const payload={
              id:id,
              scheduleDate:data.scheduleDate,
              startTime:data.startTime,
              endTime:data.endTime
            }

             console.log(`checking payload before submit `,payload.id)
            try{
    const result=  await  dispatch(EditDoctorSchedule({id:id,doctorSchedule:payload})).unwrap();
      // await dispatch(UpdatePatient({ id: data.patientId, patient: payload })).unwrap();
      console.log(`Checking update result output`,result)
       navigate('/Doctors/doctor-schedule',{state:{message:` ${result}`}})
         reset({
            doctorId:'',

scheduleDate:'',

startTime:'',
endTime:'',

          })
       
        }
        catch(error){
          if(error.fieldErrors?.ScheduleDate)  setError('scheduleDate',{message:error.fieldErrors?.ScheduleDate})
             if(error.fieldErrors?.StartTime)  setError('startTime',{message:error.fieldErrors?.StartTime})
               if(error.fieldErrors?.EndTime)  setError('endTime',{message:error.fieldErrors?.EndTime})
        }
     }
  return (
    <div>
      {loading ? (<Spinner size='sm' style={{color:'#999'}}></Spinner>)
         :(
          <Container>
            <Row className='justify-content-center'>
                <Col xs={6} sm={12} xl={6}>
                 {Object.keys(errors).filter(k => k !== 'root').length > 0 && (
    <div className="alert alert-danger">
      <h5>Please fix the following errors:</h5>
      <ul className="mb-0">
        {Object.keys(errors)
          .filter(k => k !== 'root')
          .map((key) => (
            <li key={key}>{errors[key]?.message}</li>
          ))}
      </ul>
    </div>
  )}
                   <Form  onSubmit={handleSubmit(handleUpdateDoctorSchedule)}>
                      <Row className='align-items-center'>
                        <Col xs={12} sm={6}>
                         <FormControl 
                          hidden
                          {...register('doctorId')}
                          
                        isInvalid={!!errors.doctorId}
                     />
                        <FormGroup>
                          <Form.Label>Doctor Name</Form.Label>
                        <FormControl 
                          readOnly
                          {...register('doctorName',{required:" please enter doctorName"})}
                        isInvalid={!!errors.doctorName}
                     />
                       <Feedback type='invalid'>
                         {errors.doctorName?.message}
                       </Feedback>
                     </FormGroup>
                     
                        </Col>
                         <Col xs={12} sm={6}>
                          <FormGroup>
                          <Form.Label>Schedule Date</Form.Label>
                        <FormControl 
                           type="date" 
                          {...register('scheduleDate',{required:" please Enter Schedule Date"})}
                        isInvalid={!!errors.scheduleDate}
                     />
                       <Feedback type='invalid'>
                         {errors.scheduleDate?.message}
                       </Feedback>
                     </FormGroup>
                        </Col>
                         <Col xs={12} sm={6}>
                          <FormGroup>
                          <Form.Label>Start Time</Form.Label>
                        <FormControl 
                        type='time'
                          {...register('startTime',{required:" please enter start time"})}
                        isInvalid={!!errors.startTime}
                     />
                       <Feedback type='invalid'>
                         {errors.startTime?.message}
                       </Feedback>
                     </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup>
                          <Form.Label>End Time</Form.Label>
                        <FormControl 
                          type='time'
                          {...register('endTime',{required:" please Enter End Time"})}
                        isInvalid={!!errors.endTime}
                     />
                       <Feedback type='invalid'>
                         {errors.endTime?.message}
                       </Feedback>
                     </FormGroup>
                     
                     
                      
                        </Col>
                          <FormGroup>
                         <Button type='submit' variant='info' className='w-100 mt-3'>Submit</Button>
                       </FormGroup>
                      </Row>
                   </Form>
                </Col>
            </Row>
          </Container>
         )
      }
    </div>
  )
}

export default EditDoctor
