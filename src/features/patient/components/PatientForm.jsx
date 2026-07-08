
import { useState } from 'react'
import { Form,Button, FormControl,Container,FormGroup, FormSelect } from 'react-bootstrap'
import {Col,Row} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import {addPatient,selectPatientLoading,clearError,clearMessge} from '../patientSlice'
import { toast } from "react-toastify";

const PatientForm = () => {

  const dispatch=useDispatch();
  const loading=useSelector(selectPatientLoading);
  // const message=useSelector(selectPatientMessage);
   const [firstname,setFirstname]=useState()
   const [lastname,setLastName]=useState()
   const [dob,setDob]=useState()
   const [gender,setGender]=useState() 
   const [phone,setPhone]=useState()
   const [email,setEmail]=useState()
   const [formErrors,setFormErrors]=useState({firstname,lastname,dob,gender,phone,email})
   
 
   const  addPatientForm =async (e)=>{
            e.preventDefault(); 
          setFormErrors({firstname:"",lastname:"",dob:"",gender:"",phone:"",email:""})
          
        try{
                 dispatch( clearError());
            dispatch(clearMessge());
    const result=   await dispatch(addPatient({firstname,lastname,dob,gender,phone,email})).unwrap()
           console.log('checking component result message',result) 
     toast.success(result.data || "Patient added successfully");
     setFirstname("")
     setLastName("")
     setDob("")
     setGender("")
   setEmail("")
   setPhone("")
   setEmail("")
           }
           catch(err){
            console.log(err?.DOB)
            
              setFormErrors({
      firstname: err?.FirstName?.[0],
      lastname: err?.LastName?.[0],
      dob: err?.DOB?.[0],
      gender: err?.Gender?.[0],
      phone: err?.Phone?.[0],
      email:err?.Email?.[0]
    });


           }
            
  }
  
  return (
    <>
    <Container className='mt-5'>
        <Row>
   <Col md={6} >
   <Row >
    <div className='mb-3 align-items-center'>
          <p>Patient Registeration Form</p>
    </div>
    </Row>
    <Form noValidate className='justify-between'  onSubmit={addPatientForm}>
          <FormGroup className="mb-3" controlId="firstnameId">
         <FormControl value={firstname} onChange={e=>{setFirstname(e.target.value)
               if (formErrors.firstname) {
      setFormErrors(prev => ({
        ...prev,
        firstname: undefined
      }))}


         }}
           isInvalid={!!formErrors.firstname}
         placeholder='First Name'/>
          <Form.Control.Feedback type="invalid">
          {formErrors.firstname}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="lastnameId">
         <FormControl value={lastname} onChange={e=>{setLastName(e.target.value)

                 if (formErrors.lastname) {
      setFormErrors(prev => ({
        ...prev,
        lastname: undefined
      }))}
         }
        
        }   isInvalid={!!formErrors.lastname} placeholder='Last Name'/>
        <Form.Control.Feedback type="invalid">
          {formErrors.lastname}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="emailId">
         <FormControl value={email} onChange={e=>{setEmail(e.target.value)

               if (formErrors.email) {
      setFormErrors(prev => ({
        ...prev,
        email: undefined
      }))}
         }} isInvalid={!!formErrors.email} placeholder='Email'/>
           <Form.Control.Feedback type="invalid">
          {formErrors.email}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="dobId">
         <FormControl type='date' value={dob} onChange={e=>{setDob(e.target.value)
                    if (formErrors.dob) {
      setFormErrors(prev => ({
        ...prev,
        dob: undefined
      }))}

         }} isInvalid={!!formErrors.dob} placeholder='Date of birth'/>
                <Form.Control.Feedback type="invalid">
          {formErrors.dob}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="genderId">
         <FormSelect value={gender} onChange={e=>{setGender(e.target.value)

                       if (formErrors.gender) {
      setFormErrors(prev => ({
        ...prev,
        gender: undefined
      }))}
         }
        
        }  isInvalid={!!formErrors.gender}>
             <option value="">--- please select Gender---</option>
             <option value="male"> male</option>
             <option  value="female"> female</option>
          </FormSelect>
                <Form.Control.Feedback type="invalid">
          {formErrors.gender}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="phoneId">
         <FormControl value={phone} onChange={e=>{setPhone(e.target.value)
                      if (formErrors.phone) {
      setFormErrors(prev => ({
        ...prev,
        phone: undefined
      }))}

         }
        
        }  isInvalid={!!formErrors.phone} placeholder='Phone'/>
                 <Form.Control.Feedback type="invalid">
          {formErrors.phone}
           </Form.Control.Feedback>
          </FormGroup>

      <Button  disabled={loading} type='submit' className='btn btn-primary'>{loading ? 'Adding...' : 'Add Patient'}</Button>
    </Form>
    </Col>
    </Row>
    </Container>
    </>
  )
}

export default PatientForm
