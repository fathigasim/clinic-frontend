import {useEffect, useState} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { addPayment } from '../paymentSlice';
import {getPendingInvoices,selectLatestInvoices,selectInvoice,getInvoiceByInvoiceNo,resetInvoice} from '../../invoice/invoiceSlice'
import { toast } from 'react-toastify';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
const PaymentForm = () => {
    const initialState = {
        invoiceNo: '',
        amount: null,
        paymentMethod: null
    };

      const [payment, setPayment] = useState(initialState);
    // const [formErrors, setFormErrors] = useState({});
        const {register, handleSubmit, formState: { errors:PaymentErrors }}=useForm();
  
    const latestInvoices=useSelector(selectLatestInvoices);

        const invoice=useSelector(selectInvoice);
    const dispatch = useDispatch();
  useEffect(()=>{

      try{
  const result=   dispatch(getPendingInvoices()).unwrap();
     console.log('print latest invoices =>',result)
      }
      catch(err){

   console.log(err);
      }
    },[dispatch])

    const getByInvoiceNo =async(invoiceNo)=>{

        try{
      const result=     await dispatch(getInvoiceByInvoiceNo(invoiceNo)).unwrap();
      setPayment(prev => ({ ...prev, amount: result.data.totalAmount }));
      console.log('result of component total amoun=>',result)
        }
        catch(error){
            console.log(error);
        }
    }
//     const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'amount') return; // ✅ ignore - set programmatically only

//     setPayment((prev) => ({
//         ...prev,
//         [name]: (() => {
//             if (value === "") return null;
//             if (name === "paymentMethod") return parseInt(value, 10);
//             return value;
//         })(),
//     }));
// };
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;

    //     setPayment((prev) => ({
    //         ...prev,
    //         [name]: (() => {
    //             if (value === "") return null;
    //             if (name === "amount") return parseFloat(value);
    //             if (name === "paymentMethod") return parseInt(value, 10);
    //             return value;
    //         })(),
    //     }));

    //     if (formErrors[name]) {
    //         setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    //     }
    // };

// const validate = () => {
//     const errors = {};

//     if (!payment.invoiceNo) 
//         errors.invoiceNo = 'Invoice Number is required.';

//     // Check null/undefined AND zero explicitly
//     if (payment.amount === null || payment.amount === undefined || payment.amount <= 0)
//         errors.amount = 'Amount is required.';

//     if (payment.paymentMethod === null || payment.paymentMethod === undefined)
//         errors.paymentMethod = 'Payment method is required.';

//     return errors;
// };
    const handleSubmitPayment = async (data,e) => {
        e.preventDefault();

      // const errors = validate();
        // if (Object.keys(errors).length > 0) {
        //     setFormErrors(errors);
        //     return;
        // }

        try {
            const result = await dispatch(addPayment({invoiceNo: data.invoiceNo, amount: Number(data.amount), paymentMethod: Number(data.paymentMethod)})).unwrap();
            if (result.isSuccess) {
                toast.success(result.data || "Payment added successfully.");
               // setPayment(initialState);
                   dispatch(resetInvoice());
            //    setFormErrors({});
            } else {
                toast.error(result.errorMessage || "Failed to add payment.");
            }
        } catch (err) {
            if (err) toast.warning(err || "Failed to add payment.");
            // setFormErrors({
            //     invoiceNo: err?.InvoiceNo?.[0],
            //     amount: err?.Amount?.[0],
            //     paymentMethod: err?.PaymentMethod?.[0],
            // });
            // if(err.InvoiceNo)  PaymentErrors.invoiceNo = err.InvoiceNo[0];
            // if(err.Amount)  PaymentErrors.amount = err.Amount[0];
            // if(err.PaymentMethod)  PaymentErrors.paymentMethod = err.PaymentMethod[0];
        }
    };

    return (
        
        <Container className='mt-5'>
            {console.log('check Invoice in component:', invoice)}
            <Row>
                <Col md={6}>
                <p className='text-center'><h3><i>Payment Form</i></h3></p>
                    <Form onSubmit={handleSubmit(handleSubmitPayment)} className='border p-4 shadow rounded-5'>

                        <Form.Group controlId="invoiceNo" className='mb-3'>
                            <Form.Label>Invoice Number</Form.Label>
                            <Form.Select
                                
                                {...register('invoiceNo', { required: 'Please select an invoice no.',
                                    validate: value => value !== "" || 'Please select an invoice number.'
                                })}
                                    onChange={(e) => {
                                getByInvoiceNo(e.target.value ); // or find the id from latestInvoices
                          }}
                                isInvalid={!!PaymentErrors.invoiceNo}
                            >
                                <option value="">---Please Select Invoice---</option>
                                {latestInvoices&&
                                  latestInvoices.length >0 && 
                                    latestInvoices.map((invoice)=>(
                                <option  key={invoice.id} value={invoice.invoiceNo}>{invoice.invoiceNo}</option>
                                    ))
                                 
                                }
                                </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {PaymentErrors.invoiceNo?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="totalAmount" className='mb-3'>
                            <Form.Label>Total Amount</Form.Label>
                            <Form.Control
                                readOnly
                                type="number"
                                {...register('amount', { required: 'Please enter the amount.' })}
                                value={invoice?.totalAmount ?? ''}//{payment.amount ?? ''} // ✅ fix
                              
                                isInvalid={!!PaymentErrors.amount}
                            />
                            <Form.Control.Feedback type="invalid">
                                {PaymentErrors.amount?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="PaymentMethod" className='mb-3'>
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Select
                                {...register('paymentMethod', { required: 'Please select a payment method.'
                                    ,validate: value => value !== "" || 'Please select a payment method.',valueAsNumber: true
                                 })}
                                isInvalid={!!PaymentErrors.paymentMethod}
                            >
                                <option value=''>---Select Payment Method---</option>
                                <option value='0'>Cash</option> {/* ✅ string values */}
                                <option value='1'>Card</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {PaymentErrors.paymentMethod?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit" className='btn btn-primary mb-3'>
                            Add Payment
                        </Button>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentForm;