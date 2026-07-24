import {useEffect} from 'react'
import { useParams } from 'react-router'
import { useDispatch,useSelector} from 'react-redux';
import { getDoctorScheduleById} from '../doctorSlice';
import { Spinner,Container,Col,Row,Form, FormControl, FormGroup, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Feedback from 'react-bootstrap/esm/Feedback';

export const EditDoctor = () => {
    const {id}=useParams();
    const dispatch=useDispatch();
    const {loading,error,data:doctor}=useSelector((state)=>state.doctor);

      const {
          register,
          handleSubmit,
          setError,
          formState: { errors },
          watch,
          reset
        } = useForm();
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
          reset({
            doctorId:doctor.doctorId,
doctorName:doctor.doctorName,
scheduledDate:doctor.scheduledDate,
dayOfWeek:	doctor.dayOfWeek,
startTime:doctor.startTime,
endTime:doctor.startTime,
slotDurationMinutes:doctor.slotDurationMinutes,
isActive:doctor.isActive
          })
        }
      },[doctor,id,reset])
     if(error){
      return (<div className='alert alert-danger'>{error}</div>)
     }
  return (
    <div>
      {loading ? (<Spinner size='sm' style={{color:'#999'}}></Spinner>)
         :(
          <Container>
            <Row className='justify-content-center'>
                <Col xs={6} sm={12} xl={6}>
                   <Form  onSubmit={handleSubmit}>
                      <Row className='align-items-center'>
                        <Col xs={12} sm={6}>
                        <FormGroup>
                          <Form.Label>Doctor Name</Form.Label>
                        <FormControl 
                          readOnly
                          {...register('doctorName',{required:" please inter firstname"})}
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
                        
                          {...register('scheduledDate',{valueAsDate:true,required:" please inter firstname"})}
                        isInvalid={!!errors.scheduledDate}
                     />
                       <Feedback type='invalid'>
                         {errors.scheduledDate?.message}
                       </Feedback>
                     </FormGroup>
                        </Col>
                         <Col xs={12} sm={6}>
                          <FormGroup>
                          <Form.Label>Start Time</Form.Label>
                        <FormControl 
                        type='time'
                          {...register('startTime',{valueAsDate:true,required:" please inter firstname"})}
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
                          {...register('endTime',{required:" please inter endTime"})}
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
