
import { useState } from 'react'
import { Form,Button, FormControl,Container,FormGroup, FormSelect } from 'react-bootstrap'
import {Col,Row} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import {addPatient,selectPatientLoading,clearError,clearMessge} from '../patientSlice'
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';

const PatientForm = () => {
  const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
      watch,
      reset
    } = useForm();
 // const [medicalRec
  const dispatch=useDispatch();
  const loading=useSelector(selectPatientLoading);
  // const message=useSelector(selectPatientMessage);
  //  const [firstname,setFirstname]=useState()
  //  const [lastname,setLastName]=useState()
  //  const [dob,setDob]=useState()
  //  const [gender,setGender]=useState() 
  //  const [phone,setPhone]=useState()
  //  const [email,setEmail]=useState()
   //const [formErrors,setFormErrors]=useState({firstname,lastname,dob,gender,phone,email})
   
 
   const  addPatientForm =async (data,e)=>{
            e.preventDefault(); 
      //    setFormErrors({firstname:"",lastname:"",dob:"",gender:"",phone:"",email:""})
          
        try{
                 dispatch( clearError());
            dispatch(clearMessge());
    const result=   await dispatch(addPatient({firstname:data.firstname,
      lastname:data.lastname,
      dob:data.dob,
      gender:data.gender,
      phone:data.phone,
      email:data.email})).unwrap()
           console.log('checking component result message',result) 
     toast.success(result.data || "Patient added successfully");
     reset();
  //    setFirstname("")
  //    setLastName("")
  //    setDob("")
  //    setGender("")
  //  setEmail("")
  //  setPhone("")
  //  setEmail("")
           }
           catch(err){
            console.log(`logging the patient catch error response`,err)
            
    //           setFormErrors({
    //   firstname: err?.FirstName?.[0],
    //   lastname: err?.LastName?.[0],
    //   dob: err?.DOB?.[0],
    //   gender: err?.Gender?.[0],
    //   phone: err?.Phone?.[0],
    //   email:err?.Email?.[0]
    // });
if(err.fieldErrors?.Firstname) setError('firstname',{message:err.fieldErrors.Firstname[0]})
       if(err.fieldErrors?.Lastname) setError('lastname',{message: err.fieldErrors.Lastname[0]})
         if(err.fieldErrors?.Email) setError('email',{message:err.fieldErrors.Email[0]})
           if(err.fieldErrors?.DOB) setError('dob',{message:err.fieldErrors.DOB[0]})
            if(err.fieldErrors?.Gender) setError('gender',{message: err.fieldErrors.Gender[0]})
              if(err.fieldErrors?.Phone) setError('phone',{message:err.fieldErrors.Phone[0]})

                   // non-field error (422 business rule, 404, 500, etc.)
  if (!err?.fieldErrors && err?.message) {
    setError('root.serverError', { type: 'manual', message: err.message });
  }
           }
            
  }
  
  return (
    <>
    <Container  fluid className="mt-3 mb-5 px-0">
        <Row className='className="g-4 align-items-start"'>
    <Col xs={12} xl={5}>
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
  <div className="py-3 px-3 shadow" style={{borderRadius:"2rem"}}>
    <div className='mb-3 align-items-center text-bold'  style={{fontWeight:"bold"}}>
          <p><i></i>Patient Registeration Form</p>
    </div>
    
    <Form noValidate  onSubmit={handleSubmit(addPatientForm)}>
      <Row className="g-3 align-items-start">
            <Col xs={12} sm={6}>
          <FormGroup className="mb-3" controlId="firstnameId">
         <FormControl 
               {...register('firstname', { required: 'firstname  required.' })}
        
           isInvalid={!!errors.firstname}
         placeholder='First Name'/>
          <Form.Control.Feedback type="invalid">
          {errors.firstname?.message}
           </Form.Control.Feedback>
          </FormGroup>
          </Col>
          <Col xs={12}sm={6}>
          <FormGroup className="mb-3" controlId="lastnameId">
         <FormControl
           {...register('lastname', { required: 'lastname  required.' })}
            isInvalid={!!errors.lastname} placeholder='Last Name'/>
        <Form.Control.Feedback type="invalid">
          {errors.lastname?.message}
           </Form.Control.Feedback>
          </FormGroup>
          </Col>
          <Col xm={12} sm={6}>
          <FormGroup className="mb-3" controlId="emailId">
         <FormControl
         {...register('email',{required:"email is required"})}
     

      
        isInvalid={!!errors.email} placeholder='Email'/>
           <Form.Control.Feedback type="invalid">
          {errors.email?.message}
           </Form.Control.Feedback>
          </FormGroup>
          </Col>
          <Col xm={12} sm={6}>
          <FormGroup className="mb-3" controlId="dobId">
         <FormControl
          type='date'
             {...register('dob',{required:"Birth Date is required"})}
          isInvalid={!!errors.dob} placeholder='Date of birth'/>
                <Form.Control.Feedback type="invalid">
          {errors.dob?.message}
           </Form.Control.Feedback>
          </FormGroup>
          </Col>
          <Col xm={12} sm={6}>
          <FormGroup className="mb-3" controlId="genderId">
         <FormSelect
             {...register('gender',{required:"gender  is required"})}
         isInvalid={!!errors.gender}>
             <option value="" disabled>--- please select Gender---</option>
             <option value="male"> male</option>
             <option  value="female"> female</option>
          </FormSelect>
                <Form.Control.Feedback type="invalid">
          {errors.gender?.message}
           </Form.Control.Feedback>
          </FormGroup>
          </Col>
          <Col xm={12} sm={6}>
          <FormGroup className="mb-3" controlId="phoneId">
         <FormControl
             {...register('phone',{required:"phone  is required"})}
          isInvalid={!!errors.phone} placeholder='Phone'/>
                 <Form.Control.Feedback type="invalid">
          {errors.phone?.message}
           </Form.Control.Feedback>
          </FormGroup>
   </Col>
    <Col xm={12} sm={12}>
      <Button  disabled={loading} type='submit' className='btn btn-primary w-100'>{loading ? 'Adding...' : 'Add Patient'}</Button>
     </Col>
      </Row>
    </Form>
    </div>
    </Col>
    </Row>
    </Container>
    </>
  )
}

export default PatientForm
