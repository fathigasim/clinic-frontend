
import { useState } from 'react'
import { Form,Button, FormControl,Container,FormGroup,FormSelect } from 'react-bootstrap'
import {Col,Row} from 'react-bootstrap'
import { useDispatch ,useSelector} from 'react-redux'
import {addDoctor} from '../doctorSlice'
import { toast } from 'react-toastify'
import { selectDoctorLoading } from '../doctorSlice'
const DoctorForm = () => {

  const dispatch=useDispatch();
  const loading=useSelector(selectDoctorLoading);
   const [firstname,setFirstname]=useState()
   const [lastname,setLastName]=useState()
   const [specialization,setSpecialization]=useState()
   const [gender,setGender]=useState() 
   const [phone,setPhone]=useState()
   const [email,setEmail]=useState()
   const [formErrors,setFormErrors]=useState({firstname,lastname,specialization,gender,phone,email})
    const  addPatientForm =async (e)=>{
            e.preventDefault();
          setFormErrors({firstname:"",lastname:"",specialization:"",gender:"",phone:"",email:""})
           try{
         
    const result=  await dispatch(addDoctor({firstname,lastname,specialization,gender,phone,email})).unwrap()
                               toast.success(result.data)
                               setFirstname("")
                               setLastName("")
                               setPhone("")
                               setEmail("")
                               setGender("")
                               setSpecialization("")
   }
           catch(err){
            console.log("doctor form component errors " ,err)
            
              setFormErrors({
      firstname: err?.FirstName?.[0],
      lastname: err?.LastName?.[0],
      specialization: err?.Specialization?.[0],
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
    <div>
          <p> Doctor Registeration Form </p>
    </div>
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
          <FormGroup className="mb-3" controlId="specializationId">
         <FormControl type='text' value={specialization} onChange={e=>{setSpecialization(e.target.value)
                    if (formErrors.specialization) {
      setFormErrors(prev => ({
        ...prev,
        specialization: undefined
      }))}

         }} isInvalid={!!formErrors.specialization} placeholder='specialization'/>
                <Form.Control.Feedback type="invalid">
          {formErrors.specialization}
           </Form.Control.Feedback>
          </FormGroup>
          <FormGroup className="mb-3" controlId="genderId">
         <FormSelect  value={gender} onChange={e=>{setGender(e.target.value)

                       if (formErrors.gender) {
      setFormErrors(prev => ({
        ...prev,
        gender: undefined
      }))}
         }
        
        }  isInvalid={!!formErrors.gender}>
             <option value=" ">---Please Select Gender---</option>
             <option value="male"> male</option>
             <option value="female"> female</option>
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
