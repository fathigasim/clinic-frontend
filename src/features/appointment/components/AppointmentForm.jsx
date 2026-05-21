import { useEffect,useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addAppointment, getDoctorShiftToday, selectTodaysAvailableDoctors } from '../appointmentSlice';
import { getTodaysPatients, selectTodaysPatients, selectPatientMessage } from '../../patient/patientSlice'
import { getDoctorsAvailableSlots, selectAvailableSlots } from '../../doctor/doctorSlice';
import { toast } from 'react-toastify';

const AppointmentForm = () => {
  const doctorsShift = useSelector(selectTodaysAvailableDoctors);
  const todayPatients = useSelector(selectTodaysPatients);
  const patientsMessage = useSelector(selectPatientMessage);
  const doctorSlots = useSelector(selectAvailableSlots);
  const [slotsChecked, setSlotsChecked] = useState(false);
  const dispatch = useDispatch();

  // ── Form 1: Check Available Slots ──────────────────────────────
  const {
    register: registerSlots,
    handleSubmit: handleSlotsSubmit,
    formState: { errors: slotsErrors },
    watch: watchSlots,
  } = useForm();

  // ── Form 2: Book Appointment ───────────────────────────────────
  const {
    register: registerAppt,
    handleSubmit: handleApptSubmit,
    formState: { errors: apptErrors },
    reset: resetAppt,
    setError: setApptError,
  } = useForm();

  useEffect(() => {
    dispatch(getTodaysPatients());
    dispatch(getDoctorShiftToday());
  }, [dispatch]);

  // Form 1 submit
  const onCheckSlots = async (data) => {
    await dispatch(getDoctorsAvailableSlots({
      doctorId: data.docId,
      dayOfWeek: Number(data.dOfW),
    })).unwrap();
    setSlotsChecked(true);
  };

  // Form 2 submit
  const onBookAppointment = async (data) => {
    try {
      const result = await dispatch(addAppointment({
        patientId: data.patientId,
        doctorId: data.doctorId,
        dayOfWeek: Number(data.dayOfWeek),
        startTime: data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime,
        notes: data.notes,
      })).unwrap();

      if (!result.isSuccess) {
        toast.error(result.errorMessage || 'Failed to add appointment.');
        return;
      }

      resetAppt();
      toast.success(result.data || 'Appointment added successfully.');
    } catch (err) {
      // Map server errors back to fields
      if (err?.DoctorId)   setApptError('doctorId',  { message: err.DoctorId[0] });
      if (err?.PatientId)  setApptError('patientId', { message: err.PatientId[0] });
      if (err?.DayOfWeek)  setApptError('dayOfWeek', { message: err.DayOfWeek[0] });
      if (err?.StartTime)  setApptError('startTime', { message: err.StartTime[0] });
      if (err?.Notes)      setApptError('notes',     { message: err.Notes[0] });
    }
  };

  const daysOfWeek = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ];

  const selectedDOfW = watchSlots('dOfW');

  return (
    <Container className='mt-3 mb-3'>

      {/* ── Form 1: Check Availability ── */}
      <Row>
        <Col md={8}>
          <h3>Check Doctor Availability</h3>
          <Form onSubmit={handleSlotsSubmit(onCheckSlots)} className="d-flex gap-2 flex-wrap align-items-end mb-4 shadow p-3">

            <Form.Group controlId="docId" className='mb-3'>
              <Form.Label>Doctor</Form.Label>
              <Form.Select
                {...registerSlots('docId', { required: 'Please select a doctor.' })}
                isInvalid={!!slotsErrors.docId}
              >
                <option value="">---Select Doctor---</option>
                {doctorsShift?.map((doctor) => (
                  <option key={doctor.doctorId} value={doctor.doctorId}>
                    {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{slotsErrors.docId?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="dOfW" className='mb-3'>
              <Form.Label>Day of Week</Form.Label>
              <Form.Select
                {...registerSlots('dOfW', { required: 'Please select a day.' })}
                isInvalid={!!slotsErrors.dOfW}
              >
                <option value="">---Select a day---</option>
                {daysOfWeek.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{slotsErrors.dOfW?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Button variant="primary" type="submit">Check Available Slots</Button>
            </Form.Group>

          </Form>
        </Col>
      </Row>

      {/* ── Slots Result ── */}
      {slotsChecked && 
      <Row>
        <Col md={8}>
          {doctorSlots.length > 0 ? (
            <Alert variant='info'>
              <p className="text-center" style={{ fontSize: "20px" }}><i>Doctor Available Slots</i></p>
              {selectedDOfW !== "" && (
                <div className="d-flex flex-wrap gap-2">
                  {doctorSlots.map((slot, index) => (
                    <div key={index} className="border rounded p-2">{slot.availableSlot}</div>
                  ))}
                </div>
              )}
            </Alert>
          ) : (
            <Alert variant='danger'>No slots available for this doctor</Alert>
          )}
        </Col>
      </Row>
      }

      {/* ── Form 2: Book Appointment ── */}
      <h3>Book Appointment</h3>
      <Row>
        <Col md={8}>
          {patientsMessage && <Alert variant='info'>{patientsMessage}</Alert>}

          <Form onSubmit={handleApptSubmit(onBookAppointment)} className="d-flex gap-2 flex-wrap align-items-end mb-4 shadow p-3">

            <Form.Group controlId="doctorId">
              <Form.Label>Doctor</Form.Label>
              <Form.Select
                {...registerAppt('doctorId', { required: 'Please select a doctor.' })}
                isInvalid={!!apptErrors.doctorId}
              >
                <option value="">---Select Doctor---</option>
                {doctorsShift?.map((doctor) => (
                  <option key={doctor.doctorId} value={doctor.doctorId}>
                    {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{apptErrors.doctorId?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="patientId">
              <Form.Label>Patient</Form.Label>
              <Form.Select
                {...registerAppt('patientId', { required: 'Please select a patient.' })}
                isInvalid={!!apptErrors.patientId}
              >
                <option value="">---Select Patient---</option>
                {todayPatients?.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{apptErrors.patientId?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="dayOfWeek">
              <Form.Label>Day of Week</Form.Label>
              <Form.Select
                {...registerAppt('dayOfWeek', { required: 'Please select a day.' })}
                isInvalid={!!apptErrors.dayOfWeek}
              >
                <option value="">---Select a day---</option>
                {daysOfWeek.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{apptErrors.dayOfWeek?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                {...registerAppt('startTime', { required: 'Please enter a start time.' })}
                isInvalid={!!apptErrors.startTime}
              />
              <Form.Control.Feedback type="invalid">{apptErrors.startTime?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                type="text"
                {...registerAppt('notes', { required: 'Please enter notes.' })}
                isInvalid={!!apptErrors.notes}
                placeholder="Enter notes"
              />
              <Form.Control.Feedback type="invalid">{apptErrors.notes?.message}</Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className='mt-3'>Submit</Button>

          </Form>
        </Col>
      </Row>

    </Container>
  );
};

export default AppointmentForm;