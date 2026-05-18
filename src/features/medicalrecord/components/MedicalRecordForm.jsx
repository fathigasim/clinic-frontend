import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addmedical } from '../medicalrecordSlice';
import TodayAppointments from '../../appointment/components/TodayAppointments';

const initialState = {
  appointmentNumber: '',
  diagnosis: '',
  medicationName: '',
  dosage: '',
  frequency: null,
  duration: ''
};

const MedicalRecordForm = () => {
  const [medicalRecord, setMedicalRecord] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedicalRecord((prev) => ({
      ...prev,
      [name]:
        name === "frequency"
          ? value === "" ? null : parseInt(value, 10)
          : value
    }));

    // Clear error on change
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!medicalRecord.appointmentNumber) errors.appointmentNumber = 'Appointment Number is required.';
    if (!medicalRecord.diagnosis) errors.diagnosis = 'Diagnosis is required.';
    if (!medicalRecord.medicationName) errors.medicationName = 'Medication Name is required.';
    if (!medicalRecord.dosage) errors.dosage = 'Dosage is required.';
    if (medicalRecord.frequency === null || medicalRecord.frequency === '') errors.frequency = 'Frequency is required.';
    if (!medicalRecord.duration) errors.duration = 'Duration is required.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate BEFORE submitting
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const result = await dispatch(addmedical(medicalRecord)).unwrap();
      if (result.isSuccess) {
        toast.success(result.data || "Medical record added successfully.");
        setMedicalRecord(initialState); // Reset only on success
        setFormErrors({});
      } else {
        toast.error(result.errorMessage || "Failed to add medical record.");
      }
    } catch (err) {
     
      if(err.exceptionMessage){
        toast.warning(err.exceptionMessage)
      }
      setFormErrors({
        appointmentNumber: err?.AppointmentNumber?.[0],
        diagnosis: err?.Diagnosis?.[0],
        medicationName: err?.MedicationName?.[0],
        dosage: err?.Dosage?.[0],
        frequency: err?.Frequency?.[0],
        duration: err?.Duration?.[0],
      });
    }
  };

  return (
    <Container className='mt-3 mb-5'>
      <Row>
        <Col md={6}>
          <h3><i>Medical Record  </i></h3>
          <Form onSubmit={handleSubmit} className='d-flex gap-2 flex-wrap align-items-end mb-4 shadow p-3'>

            <Form.Group>
              <Form.Label>Appointment Number</Form.Label>
              <Form.Control
                type="text"
                name="appointmentNumber"
                placeholder="Appointment Number"
                value={medicalRecord.appointmentNumber}
                onChange={handleInputChange}
                isInvalid={!!formErrors.appointmentNumber}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.appointmentNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                type="text"
                name="diagnosis"
                placeholder="Diagnosis"
                value={medicalRecord.diagnosis}
                onChange={handleInputChange}
                isInvalid={!!formErrors.diagnosis}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.diagnosis}
              </Form.Control.Feedback>
            </Form.Group>

          

            <Form.Group>
              <Form.Label>Medication Name</Form.Label>
              <Form.Control
                type="text"
                name="medicationName"
                placeholder="Medication Name"
                value={medicalRecord.medicationName}
                onChange={handleInputChange}
                isInvalid={!!formErrors.medicationName}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.medicationName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Dosage</Form.Label>
              <Form.Control
                  as="textarea"
                name="dosage"
                placeholder="Dosage"
                value={medicalRecord.dosage}
                onChange={handleInputChange}
                isInvalid={!!formErrors.dosage}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.dosage}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Frequency</Form.Label>
              <Form.Control
                type="number"
                name="frequency"
                placeholder="Frequency"
                value={medicalRecord.frequency ?? ""}
                onChange={handleInputChange}
                isInvalid={!!formErrors.frequency}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.frequency}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="date"
                name="duration"
                placeholder="Duration"
                value={medicalRecord.duration}
                onChange={handleInputChange}
                isInvalid={!!formErrors.duration}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.duration}
              </Form.Control.Feedback>
            </Form.Group>

            <Button className='mt-3' type="submit">Add Medical Record</Button>
          </Form>
        </Col>
        <Col md={6}>
            <div  className='d-flex gap-2 flex-wrap align-items-end mb-4 shadow-sm'>
                   <h4 className='text-center'><i>Appointment Schedule   </i></h4>
           <TodayAppointments/>
           </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MedicalRecordForm;