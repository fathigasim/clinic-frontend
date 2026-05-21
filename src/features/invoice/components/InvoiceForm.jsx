
import { useEffect, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {getNotInvoicedAppointments,selectNotInvoicedAppointments} from '../../appointment/AppointmentSlice'
import { createPaymentIntent } from '../../payment/paymentSlice';
import { addInvoice} from '../invoiceSlice';
import { useForm } from 'react-hook-form';
const InvoiceForm = () => {
    // const initialState = {
    //     appointmentNumber: '',
    //     totalAmount: null
    // }
     const {
    register,
    handleSubmit,
    formState: { errors:invoiceErrors },
    reset,
    watch,
  } = useForm();
    // const [invoice, setInvoice] = useState(initialState);
    // const [formErrors, setFormErrors] = useState({});
    const unInvoicedAppointments=useSelector(selectNotInvoicedAppointments);

    const navigate=useNavigate()
    const dispatch = useDispatch();

    useEffect(()=>{
          
      try{
      const result=   dispatch(getNotInvoicedAppointments()).unwrap();

      console.log('unInvoicedApi response',result)
  }
  catch(error){
             
          console.log('unInvoicedAppointments',error)
  }
        
    },[dispatch])
    
//  const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setInvoice((prev) => ({
//       ...prev,
//       [name]:
//         name === "totalAmount"
//           ? value === "" ? null : parseFloat(value, 10)
//           : value
//     }));

//     // Clear error on change
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };;

  //   const validate = () => {
  //   const errors = {};
  //   if (!invoice.appointmentNumber) errors.appointmentNumber = 'Appointment Number is required.';
  //   if (!invoice.totalAmount) errors.totalAmount = 'Total Amount is required.';
  //   return errors;
  // };

 
   const handleSubmitInvoice = async (data,e) => {
     e.preventDefault();
 
     try {
       //const result = await dispatch(addInvoice(invoice)).unwrap();
       const result = await dispatch(addInvoice({appointmentNumber:data.appointmentNumber,totalAmount:data.totalAmount})).unwrap();
       console.log('Add invoice result:', result);
        await dispatch(createPaymentIntent({
        totalAmount: data.totalAmount,
        invoiceId: result.id, // whatever your backend returns
      })).unwrap();

      // navigate('/paymentpage', { state: { invoiceId: result.data.invoiceId } }); 
        navigate('/paymentpage'); 
       // Clear form only on success
        console.log("Invoice added successfully:", result.data);
         toast.success(result || "Invoice added successfully.");
          reset(); // Clear form fields
       
      
     } catch (err) {
        console.log('Error adding invoice:', err);
         toast.warning(err || "Failed to add invoice.");
      if(err.AppointmentNumber)  invoiceErrors('appointmentNumber',  { message: err.AppointmentNumber?.[0] });
      if(err.TotalAmount)  invoiceErrors('totalAmount',  { message: err.TotalAmount?.[0] });
     }
   };
    return (
        <Container className='mt-5'>
          {console.log("Checking unInvoicedAppointments in component",unInvoicedAppointments)}
            <Row>
                <Col md={6}>
                <p className='text-center'><i><h3> Invoice Form</h3></i></p>
            <Form onSubmit={handleSubmit(handleSubmitInvoice)} className='border rounded-5 thin p-4 shadow'>
                <Form.Group controlId="appointmentNumber" className='mb-3'>
                    <Form.Label>Appointment Number</Form.Label>
                    <Form.Select {...register('appointmentNumber', { required: 'Please select a appointment no.',
                       validate: value => value !== "" || 'Please select an appointment number.'
                     })}
                isInvalid={!!invoiceErrors.appointmentNumber}
                    > 
                    <option value="">---Select Appointment Number---</option>
                      {unInvoicedAppointments&&
                        unInvoicedAppointments.length >0&&
                        unInvoicedAppointments.map((appointment)=>(
                        <option key={appointment.id} value= {appointment.appointmentNumber}>{appointment.appointmentNumber}</option>

                        ))
                      }
                    </Form.Select>
                  
                        <Form.Control.Feedback type="invalid">{invoiceErrors.appointmentNumber?.message}</Form.Control.Feedback>
            
                </Form.Group>

                <Form.Group controlId="totalAmount" className='mb-3'>
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control
                        // type="number"
                        // name="totalAmount"
                        // value={invoice.totalAmount ? invoice.totalAmount : ''}
                        // onChange={handleInputChange}
                         {...register('totalAmount', { required: 'Total Amount required' })}
                        isInvalid={!!invoiceErrors.totalAmount}
                    />
                    <Form.Control.Feedback type="invalid">
                        {invoiceErrors.totalAmount?.message}
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
