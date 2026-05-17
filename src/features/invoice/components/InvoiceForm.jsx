
import { useEffect, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {getNotInvoicedAppointments,selectNotInvoicedAppointments} from '../../appointment/AppointmentSlice'
import { addInvoice} from '../invoiceSlice';
const InvoiceForm = () => {
    const initialState = {
        appointmentNumber: '',
        totalAmount: null
    }
    const [invoice, setInvoice] = useState(initialState);
    const [formErrors, setFormErrors] = useState({});
    const unInvoicedAppointments=useSelector(selectNotInvoicedAppointments);
    const navigate=useNavigate()
    const dispatch = useDispatch();

  //   const unInvoicedAppointments= async()=>{
  // try{
  //     const result=  await dispatch(  getNotInvoicedAppointments()).unwrap();
  //     console.log('unInvoicedApi response',result)
  // }
  // catch(error){
             
  //         console.log('unInvoicedAppointments',error)
  // }
  //   }
    useEffect(()=>{
          
      try{
      const result=   dispatch(getNotInvoicedAppointments()).unwrap();
      console.log('unInvoicedApi response',result)
  }
  catch(error){
             
          console.log('unInvoicedAppointments',error)
  }
        
    },[dispatch])
 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]:
        name === "totalAmount"
          ? value === "" ? null : parseFloat(value, 10)
          : value
    }));

    // Clear error on change
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };;

    const validate = () => {
    const errors = {};
    if (!invoice.appointmentNumber) errors.appointmentNumber = 'Appointment Number is required.';
    if (!invoice.totalAmount) errors.totalAmount = 'Total Amount is required.';
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
       const result = await dispatch(addInvoice(invoice)).unwrap();
       if (result.isSuccess) {
        console.log("Invoice added successfully:", result.data);
         toast.success(result.data || "Invoice added successfully.",navigate('/payment'));
         setInvoice(initialState); // Reset only on success
         setFormErrors({});
       } else {
         toast.error(result.errorMessage || "Failed to add invoice.");
       }
     } catch (err) {
      
         toast.warning(err || "Failed to add invoice.");
       
       setFormErrors({
         appointmentNumber: err?.AppointmentNumber?.[0],
         totalAmount: err?.TotalAmount?.[0],
       
       });
     }
   };
    return (
        <Container className='mt-5'>
          {console.log("Checking unInvoicedAppointments in component",unInvoicedAppointments)}
            <Row>
                <Col md={6}>
                <p className='text-center'><i><h3> Invoice Form</h3></i></p>
            <Form onSubmit={handleSubmit} className='border rounded-5 thin p-4 shadow'>
                <Form.Group controlId="appointmentNumber" className='mb-3'>
                    <Form.Label>Appointment Number</Form.Label>
                    <Form.Select
                       
                        name="appointmentNumber"
                        value={invoice.appointmentNumber}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.appointmentNumber}
                    > 
                    <option value="">---Select Appointment Number---</option>
                      {unInvoicedAppointments&&
                        unInvoicedAppointments.length >0&&
                        unInvoicedAppointments.map((appointment)=>(
                        <option key={appointment.id} value= {appointment.appointmentNumber}>{appointment.appointmentNumber}</option>

                        ))
                      }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {formErrors.appointmentNumber}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="totalAmount" className='mb-3'>
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control
                        type="number"
                        name="totalAmount"
                        value={invoice.totalAmount ? invoice.totalAmount : ''}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.totalAmount}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.totalAmount}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" className='btn btn-primary'>
                    Add Invoice
                </Button>
            </Form>
            </Col>
            </Row>
        </Container>
    )
}

export default InvoiceForm
