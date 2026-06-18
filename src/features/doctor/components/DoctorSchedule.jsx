import  { useEffect, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { addDoctorSchedule,getAllDoctors,selectAllDoctors } from '../doctorSlice';
import {Col,Row,Container,Form,FormControl,FormGroup, FormSelect, Button} from 'react-bootstrap'
import {toast} from 'react-toastify'
import { useForm } from 'react-hook-form';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
const DoctorSchedule = () => {





const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({
    defaultValues: {
        doctorId: "",
        scheduleDate: "",
        startTime: "",
        endTime: ""
    }
});
const handleServerErrors =useFormServerErrors(setError)
const onSubmit = async (data) => {
    const payload = {
        doctorId: data.doctorId  ||null,
        scheduleDate: data.scheduleDate || null,
        startTime: data.startTime ? `${data.startTime}:00` : null,
        endTime: data.endTime ? `${data.endTime}:00` : null
    };
    try{
    const result=  await dispatch(addDoctorSchedule(payload)).unwrap();
    toast.success(result || 'Doctor schedule added successfully');
    reset(); // Reset the form after successful submission
    }
   catch (error) {
    console.error('Error adding doctor schedule:', errors);
handleServerErrors(error);
}
}
        
    
    
  

  const doctors=useSelector(selectAllDoctors);
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(getAllDoctors())
  },[dispatch])

  return (
    <>
    <Container>
      {errors.root && (
    <div className="alert alert-danger mt-2">
        {errors.root.message}
    </div>
)}
        <h2 className='mt-3 text-center'>Doctor Schedule</h2>
    
    <Row>

 <FormGroup className='mb-3'>
    <FormSelect 
        {...register("doctorId", { 
            required: "Doctor selection is required.",
            validate: value => value !== "" || "Doctor selection is required."
        })}  
        className={errors.doctorId ? "form-select is-invalid" : "form-select"}
    >
        <option value="">---Select Doctor---</option>
        {doctors.map((doctor) => (
            <option key={doctor.doctorId} value={doctor.doctorId}>
                {doctor.firstName + ' ' + doctor.lastName + ' ' + doctor.specialization}
            </option>
        ))}
    </FormSelect>
    {errors.doctorId && (
        <div className="invalid-feedback d-block">
            {errors.doctorId.message}
        </div>
    )}
</FormGroup>
      <FormGroup className='mb-3'>
    <FormControl
        type='date'
        {...register("scheduleDate", { required: "Schedule date is required." })}
      invalid={!!errors.scheduleDate}
    />
    {errors.scheduleDate && <p className="text-danger">{errors.scheduleDate.message}</p>}
    <FormControl.Feedback type="invalid">
                    {errors.scheduleDate && errors.scheduleDate.message}
                </FormControl.Feedback>
</FormGroup>

<FormGroup className='mb-3'>
    <FormControl
        type='time'
        {...register("startTime", { required: "Start time is required." })}
        invalid={!!errors.startTime}
    />
    {errors.startTime && <p className="text-danger">{errors.startTime.message}</p>}
    <FormControl.Feedback type="invalid">
                    {errors.startTime && errors.startTime.message}
                </FormControl.Feedback>
</FormGroup>

<FormGroup className='mb-3'>
    <FormControl
        type='time'
        {...register("endTime", {
            required: "End time is required.",
            validate: (val, formValues) =>
                val > formValues.startTime || "End time must be after start time."
        })}
        invalid={!!errors.endTime}
    />
    {errors.endTime && <p className="text-danger">{errors.endTime.message}</p>}
    <FormControl.Feedback type="invalid">
                    {errors.endTime && errors.endTime.message}
                </FormControl.Feedback>
</FormGroup>

<Button type='button' onClick={handleSubmit(onSubmit)}>Save Schedule</Button>
      </Row>
      </Container>
    </>
  )
}
export default DoctorSchedule
