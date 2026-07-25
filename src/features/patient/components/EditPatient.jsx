
import { useEffect, useState } from 'react';
import { useParams } from 'react-router'
import { useDispatch,useSelector } from 'react-redux';
import  {getPatientById,UpdatePatient} from '../patientSlice'
import { Container,Form,Button,Col,Row, FormGroup,FormControl,Spinner, Alert, FormSelect } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Feedback from 'react-bootstrap/esm/Feedback';
 export const EditPatient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error,message, patient } = useSelector((state) => state.patient);
  //const [formData, setFormData] = useState(null);

    const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
      watch,
      reset
    } = useForm();
    const navigate=useNavigate();
  useEffect(() => {
      console.log('dispatching with id:', id);
     //   setFormData(null);    // clear stale data immediately on navigation
    dispatch(getPatientById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (patient && patient.patientId === id) {// extra safety: only accept matching patient
      // eslint-disable-next-line react-hooks/set-state-in-effect


      reset({
         patientId:patient.patientId,
      firstName:patient.firstName,
      lastName:patient.lastName,
      email:patient.email,
      dob:patient.dob.split("T")[0],
      phone:patient.phone,
      gender:patient.gender
      })
    }
  }, [patient, id,reset]);

  const submitPatient  =async (data,e)=>{
    e.preventDefault();
    const payload={
       patientId:data.patientId,
      firstName:data.firstName,
      lastName:data.lastName,
      email:data.email,
      dob:data.dob.split("T")[0],
      phone:data.phone,
      gender:data.gender,//||""
    }
    try{
    //  await  dispatch(UpdatePatient({id: data.patientId, payload })).unwrap();
await dispatch(UpdatePatient({ id: data.patientId, patient: payload })).unwrap();
     // reset();
        reset({
         patientId:'',
      firstName:'',
      lastName:'',
      email:'',
      dob:'',
      phone:'',
      gender:''
      })


      setTimeout(()=>{navigate('/patients/patients-list',{state:{message:`Patient ${patient.firstName} updated successfully`}})},2000)
    }
    catch(error){
          console.log('FULL ERROR OBJECT:', error);
  console.log('error.message:', error?.message);
  console.log('error.fieldErrors:', error?.fieldErrors);
  console.log('error keys:', error ? Object.keys(error) : 'error is null/undefined');
        if(error.fieldErrors?.FirstName) setError('firstName',{message:error.fieldErrors.FirstName[0]})
         if(error.fieldErrors?.LastName) setError('lastName',{message: error.fieldErrors.LastName[0]})
         if(error.fieldErrors?.Email) setError('email',{message:error.fieldErrors.Email[0]})
           if(error.fieldErrors?.DOB) setError('dOB',{message:error.fieldErrors.DOB[0]})
            if(error.fieldErrors?.Phone) setError('phone',{message: error.fieldErrors.Phone[0]})
              if(error.fieldErrors?.Gender) setError('gender',{message:error.fieldErrors.Gender[0]})
        
                            // non-field error (422 business rule, 404, 500, etc.)
  if (!error?.fieldErrors && error?.message) {
    setError('root.serverError', { type: 'manual', message: error.message });
  }
              }
  }

  // if (error) return <Alert>{error}</Alert>;

 if (loading ) {
  return <Spinner />;
}

//console.log('formData at render:', JSON.stringify(formData));

  return (
    <Container  fluid className="mt-3 mb-5 px-0">
      <Row className="g-4 align-items-start">
        <Col sm={12} md={8} xl={7}>
          {errors.root?.serverError?.message && (
    <div className="alert alert-warning">
      {errors.root.serverError.message}
    </div>
  )}
        <br></br>
        
        <Form onSubmit={handleSubmit(submitPatient)} className="align-items-center">
          <Row className="g-3 align-items-start">
          <Col sm={6}  xs={12}>
           
           <FormControl type="text" {...register('patientId')} hidden />
            <FormGroup>
              <Form.Label> First Name</Form.Label>
              <FormControl
                 {...register('firstName', { required: 'firstName  required.' })}
                    isInvalid={!!errors.firstName}
              type="text"
                isInvalid={!!errors.firstName}
              />
              <Feedback type="invalid">
                {errors.firstName?.message}
              </Feedback>
            </FormGroup>
          </Col>
          <Col sm={6}  xs={12}>
            <FormGroup>
              <Form.Label> Last Name</Form.Label>
              <FormControl
                 {...register('lastName', { required: 'lastName  required.' })}
              type="text" 
                isInvalid={!!errors.lastName}
              />
              <Feedback type="invalid">{errors.lastName?.message}</Feedback>
            </FormGroup>
          </Col>

          <Col sm={6} xs={12}>
            <FormGroup>
              <Form.Label> Email</Form.Label>
              <FormControl
               {...register('email', { required: 'email  required.' })}
              type="text" 
               isInvalid={!!errors.email}
              />
              <Feedback type="invalid">
                {errors.email?.message}
              </Feedback>
            </FormGroup>
          </Col>
           <Col sm={6} xs={12}>
            <FormGroup>
              <Form.Label> Birth Date </Form.Label>
              <FormControl
              {...register('dob', {valueAsDate:true ,required: 'dob  required.' })}
              type="date" 
                 isInvalid={!!errors.dob}
              />
             <Feedback type="invalid">{errors.dob?.message}</Feedback>
            </FormGroup>
          </Col>
           <Col sm={6} xs={12}>
            <FormGroup>
              <Form.Label> Phone</Form.Label>
              <FormControl 
              {...register('phone', {required: 'phone  required.' })}
              type="text" 
              isInvalid={!!errors.phone}
              />
              <Feedback type="invalid">
                {errors.phone?.message}
              </Feedback>
            </FormGroup>
          </Col>
          <Col sm={6} xs={12}>
            <FormGroup>
              <Form.Label> Gender</Form.Label>
              <FormSelect
                {...register('gender', {required: 'gender  required.' })}
              
                isInvalid={!!errors.gender}
              >
              <option value="male">Male</option>
              <option value="female">Female</option>
                </FormSelect>
                <Feedback type="invalid">
                    {errors.gender?.message}
                </Feedback>
            </FormGroup>
          </Col>
           <Col xs={12} className="pt-2">
                <Button type="submit" variant="primary" className="w-100 py-2">
                  <i className="bi bi-plus-pencile me-2"></i>Update Patient
                </Button>
              </Col>
          </Row>
        </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditPatient;