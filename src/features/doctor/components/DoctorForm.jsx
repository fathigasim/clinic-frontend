

import { Form,Button, FormControl,Container,FormGroup,FormSelect } from 'react-bootstrap'
import {Col,Row} from 'react-bootstrap'
import { useDispatch ,useSelector} from 'react-redux'
import {addDoctor} from '../doctorSlice'
import { toast } from 'react-toastify'
import { selectDoctorLoading } from '../doctorSlice'
import { useForm } from 'react-hook-form'
const DoctorForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    reset
  } = useForm();
  const dispatch=useDispatch();
  const loading=useSelector(selectDoctorLoading);
  //  const [firstname,setFirstname]=useState()
  //  const [lastname,setLastName]=useState()
  //  const [specialization,setSpecialization]=useState()
  //  const [gender,setGender]=useState() 
  //  const [phone,setPhone]=useState()
  //  const [email,setEmail]=useState()
  
    const  addDoctorForm =async (data,e)=>{
            e.preventDefault();
      
           try{
           const payload = {
        firstname: data.firstname  ||null,
        lastname: data.lastname || null,
        specialization: data.specialization,
        gender:data.gender,
        phone:data.phone,
        email:data.email
   
    };
    const result=  await dispatch(addDoctor(payload)).unwrap()
                               toast.success(result.data)
                             reset();
   }
           catch(err){
            console.log("doctor form component errors " ,err.fieldErrors)
            if (err.fieldErrors?.Firstname)   setError('firstname',  { message: err.fieldErrors.Firstname[0] });
      if (err?.fieldErrors?.Lastname)  setError('lastname', { message: err.fieldErrors.Lastname[0] });
      if (err?.fieldErrors?.Gender)  setError('gender', { message: err.fieldErrors.Gender[0] });
      if (err?.fieldErrors?.Phone)  setError('phone', { message: err.fieldErrors.Phone[0] });
      if (err?.fieldErrors?.Email)      setError('email',     { message: err.fieldErrors.Email[0] });
           
      // non-field error (422 business rule, 404, 500, etc.)
  if (!err?.fieldErrors && err?.message) {
    setError('root.serverError', { type: 'manual', message: err.message });
  }
    }
            
  }
  
  
  return (
    <>
    <Container className='mt-5'>
        <Row>
   <Col md={6} >
    <div>
          <p> Doctor Registeration Form </p>
    </div>
    <div>
       {errors.root?.serverError?.message && (
    <div className="alert alert-warning">
      {errors.root.serverError.message}
    </div>
  )}
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
      {/* {Object.keys(errors).length > 0 && (
  <div className="alert alert-danger">
    <h5>Please fix the following errors:</h5>
    <ul className="mb-0">
      {Object.keys(errors).map((key) => (
        <li key={key}>{errors[key]?.message}</li>
      ))}
    </ul>
  </div>
)} */}
    </div>
    <Form noValidate className='justify-between'  onSubmit={handleSubmit(addDoctorForm)}>
          <FormGroup className="mb-3" controlId="firstnameId">
         <FormControl 
         {...register('firstname', { required: 'first name required.' })}
           isInvalid={!!errors.firstname}
         placeholder='First Name'/>
          <Form.Control.Feedback type="invalid">
          {errors.firstname?.message}
           </Form.Control.Feedback>
          </FormGroup>

          <FormGroup className="mb-3" controlId="lastnameId">
         <FormControl 
       
 {...register('lastname', { required: 'last name is required.' })}
         
        
           isInvalid={!!errors.lastname} placeholder='Last Name'/>
        <Form.Control.Feedback type="invalid">
          {errors.lastname?.message}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="emailId">
         <FormControl 
 {...register('email', { required: 'email required.' })}
          isInvalid={!!errors.email} placeholder='Email'/>
           <Form.Control.Feedback type="invalid">
          {errors.email?.message}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="specializationId">
         <FormControl 
          {...register('specialization', { required: 'specialization required.' })}
         isInvalid={!!errors.specialization} placeholder='specialization'/>
                <Form.Control.Feedback type="invalid">
          {errors.specialization?.message}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="genderId">
         <FormSelect 
       {...register('gender', { required: 'Gender required.' })}
          isInvalid={!!errors.gender}>
             <option value="" disabled>---Please Select Gender---</option>
             <option value="male"> male</option>
             <option value="female"> female</option>
          </FormSelect>
                <Form.Control.Feedback type="invalid">
          {errors.gender?.message}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="phoneId">
         <FormControl
          {...register('phone', { required: 'phone required.' })}
          isInvalid={!!errors.phone} placeholder='Phone'/>
                 <Form.Control.Feedback type="invalid">
          {errors.phone?.message}
           </Form.Control.Feedback>
          </FormGroup>

      <Button disabled={loading} type='submit' className='btn btn-primary'>
        {loading ? 'Adding Doctor...' : 'Add Doctor'}
      </Button>
    </Form>
    </Col>
    </Row>
    </Container>
    
    </>
  )
}

export default DoctorForm
