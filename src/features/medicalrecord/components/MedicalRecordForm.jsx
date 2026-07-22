
import { useDispatch } from 'react-redux';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addmedical } from '../medicalrecordSlice';
import TodayAppointments from '../../appointment/components/TodayAppointments';
import { useForm } from 'react-hook-form';
// const initialState = {
//   appointmentNumber: '',
//   diagnosis: '',
//   medicationName: '',
//   dosage: '',
//   frequency: null,
//   duration: ''
// };

const MedicalRecordForm = () => {
    const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
      watch,
      reset
    } = useForm();
 // const [medicalRecord, setMedicalRecord] = useState(initialState);
  // const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setMedicalRecord((prev) => ({
  //     ...prev,
  //     [name]:
  //       name === "frequency"
  //         ? value === "" ? null : parseInt(value, 10)
  //         : value
  //         ,
  //       [name]:
  //       name === "duration"
  //         ? value === "" ? null : parseInt(value, 10)
  //         : value
  //   }));

  //   // Clear error on change
  //   if (formErrors[name]) {
  //     setFormErrors(prev => ({ ...prev, [name]: undefined }));
  //   }
  // };

  // const validate = () => {
  //   const errors = {};
  //   if (!medicalRecord.appointmentNumber) errors.appointmentNumber = 'Appointment Number is required.';
  //   if (!medicalRecord.diagnosis) errors.diagnosis = 'Diagnosis is required.';
  //   if (!medicalRecord.medicationName) errors.medicationName = 'Medication Name is required.';
  //   if (!medicalRecord.dosage) errors.dosage = 'Dosage is required.';
  //   if (medicalRecord.frequency === null || medicalRecord.frequency === '') errors.frequency = 'Frequency is required.';
  //   if (!medicalRecord.duration) errors.duration = 'Duration is required.';
  //   return errors;
  // };

  const handleSubmitMedicalRecord = async (data,e) => {
    e.preventDefault();

    try {
      const payload={
         appointmentNumber: data.appointmentNumber,
  diagnosis:data.diagnosis ,
  medicationName: data.medicationName,
  dosage: data.dosage,
  frequency: data.frequency,
  duration: data.duration
      }
      const result = await dispatch(addmedical(payload)).unwrap();
      if (result.isSuccess) {
        toast.success(result.data || "Medical record added successfully.");
       // setMedicalRecord(initialState); // Reset only on success
        reset();
      } else {
        toast.error(result.errorMessage || "Failed to add medical record.");
      }
    } catch (err) {
     
    //   if(err.exceptionMessage){
    //     toast.warning(err.exceptionMessage)
    //   }
    //   setFormErrors({
    //     appointmentNumber: err?.AppointmentNumber?.[0],
    //     diagnosis: err?.Diagnosis?.[0],
    //     medicationName: err?.MedicationName?.[0],
    //     dosage: err?.Dosage?.[0],
    //     frequency: err?.Frequency?.[0],
    //     duration: err?.Duration?.[0],
    //   });
    // }
    if(err.fieldErrors.AppointmentNumber) setError('appointmentNumber',{message:err.fieldErrors.AppointmentNumber[0]})
       if(err.fieldErrors.Diagnosis) setError('diagnosis',{message: err.fieldErrors.Diagnosis[0]})
         if(err.fieldErrors.MedicationName) setError('medicationName',{message:err.fieldErrors.MedicationName[0]})
           if(err.fieldErrors.Dosage) setError('dosage',{message:err.fieldErrors.Dosage[0]})
            if(err.fieldErrors.Frequency) setError('frequency',{message: err.fieldErrors.Frequency[0]})
              if(err.fieldErrors.Duration) setError('duration',{message:err.fieldErrors.Duration[0]})
            
            
  };
  }
  return (
 <Container fluid className="mt-3 mb-5 px-0">
    {/* Main Root Row separating your page into two distinct side-by-side panels */}
    <Row className="g-4 align-items-start">
      
      {/* ================= LEFT SIDE: MEDICAL RECORD FORM PANEL (Takes 7/12 width) ================= */}
      <Col xs={12} xl={7}>
        <div className="bg-white p-4 shadow rounded-3 border-0 mb-4">
          <h3 className="h5 fw-bold text-body mb-3">
            <i className="bi bi-file-earmark-medical me-2 text-primary"></i>Medical Record
          </h3>
          
          <Form onSubmit={handleSubmit(handleSubmitMedicalRecord)} noValidate>
            {/* The inner row locks individual inputs into isolated grid cells */}
            <Row className="g-3 align-items-start">
              
              {/* 1. Appointment Number */}
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">Appointment Number</Form.Label>
                  <Form.Control
                    
                    
                    placeholder="e.g. APP-1024"
                    {...register('appointmentNumber', { required: 'appointmentNumber  required.' })}
                    isInvalid={!!errors.appointmentNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.appointmentNumber?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* 2. Diagnosis */}
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">Diagnosis</Form.Label>
                  <Form.Control
                   
                    
                    placeholder="Diagnosis details"
                      {...register('diagnosis', { required: 'diagnosis  required.' })}
                    isInvalid={!!errors.diagnosis}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.diagnosis?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* 3. Medication Name */}
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">Medication Name</Form.Label>
                  <Form.Control
                    type="text"
                   
                    placeholder="Medication name"
                      {...register('medicationName', { required: 'medicationName  required.' })}
                    isInvalid={!!errors.medicationName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.medicationName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* 4. Dosage */}
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">Dosage</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                  
                    placeholder="Dosage details"
                     {...register('dosage', { required: 'dosage  required.' })}
                    isInvalid={!!errors.dosage}
                    style={{ minHeight: '38px' }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dosage?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* 5. Frequency */}
              <Col xs={12} sm={6} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">Frequency (times/day)</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                  {...register('frequency', {valueAsNumber:true ,required: 'frequency  required.' })}
                    placeholder="Times per day"
                  
                    isInvalid={!!errors.frequency}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.frequency?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* 6. Duration */}
              <Col xs={12} sm={6} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">Duration (days)</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    name="duration"
                    placeholder="Days"
                  {...register('duration', { valueAsNumber:true,required: 'duration  required.' })}
                    isInvalid={!!errors.duration}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.duration?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* 7. Action Button Container */}
              <Col xs={12} className="pt-2">
                <Button type="submit" variant="primary" className="w-100 py-2">
                  <i className="bi bi-plus-circle me-2"></i>Add Medical Record
                </Button>
              </Col>

            </Row>
          </Form>
        </div>
      </Col>

      {/* ================= RIGHT SIDE: APPOINTMENT SCHEDULE WORKSPACE (Takes 5/12 width) ================= */}
      <Col xs={12} xl={5}>
        <div className="bg-white p-4 shadow rounded-3 border-0 mb-4">
          <h4 className="h5 fw-bold text-body mb-3">
            <i className="bi bi-calendar-check me-2 text-primary"></i>Appointment Schedule
          </h4>
          <div className="appointment-list-wrapper mt-2">
            <TodayAppointments />
          </div>
        </div>
      </Col>

    </Row>
  </Container>
  );
};

export default MedicalRecordForm;