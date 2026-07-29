import React, { useEffect, useState } from 'react'
import { Container,Row,Col,Form,FormControl
  ,Button, Alert, FormGroup, Spinner ,Table} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import {getPaymentsByDate,getPaymentsByDatePdf,getPaymentsByDateReport} from '../../paymentSlice'
import { DownloadReport } from './handleDownloadReport'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'
import Paginationbootstrap from '../../../../components/Pagintationbootstrap'

const PaymentsByDate = () => {
   const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Extract state directly from URL query string
  const date = searchParams.get('date') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 2;

  // 2. Select Redux state
  const { paymentslist, error, loading,totalPages } = useSelector((state) => state.payment);

  // 3. Setup React Hook Form with URL's initial date
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { date }
  });

  // 4. Trigger API call whenever URL params change
  useEffect(() => {
    if (date) {
        
      dispatch(getPaymentsByDate({ date, page: currentPage, pageSize:pageSize}));
    }
  }, [dispatch, date, currentPage, pageSize]);

  // 5. Form Submit: Updates URL date and resets page back to 1
  const handleSearch = (data) => {

    setSearchParams({
      date: data.date,
      page: 1,
      pageSize: pageSize
    });
  };

  // 6. Pagination Handler: Updates URL page parameter
  // const handlePageChange = (newPage) => {
  //   if (newPage < 1) return;
  //   setSearchParams({
  //     date: date,
  //     page: newPage,
  //     pageSize: pageSize
  //   });
  // };
  console.log('render - error is:', error);
  return (
    <Container>
      <Row className='justify-content-start'>
        <Col sm={6} xm={12}>
          {error&&<Alert variant='danger'>{error}</Alert>}
          
        <Form noValidate  onSubmit={handleSubmit(handleSearch)}>
          <FormGroup>
             <FormControl
             type='date'
            {...register('date',{required:'Please Enter Date'})}
            isInvalid={!!errors?.date} />
               
               {/* <FormControl.Feedback type='invalid'>
                {errors.date?.message}</FormControl.Feedback> */}
             </FormGroup>
             <Button type='submit'>Submit</Button>

        </Form>
             
                 <>
                 <Container className='mt-5 mb-5'>
                  {loading ?(<Spinner variant='' size='sm' className='align-item-center'></Spinner>)
                    :(
                       <div> {paymentslist.length >0&&
                       <> 
                          {/* <Button  onClick={handleDownloadReport()} size='sm' variant='info'>Download Pdf Report</Button> */}
                            {/* <DownloadReport date={date}/> */}
                           <Row >
                              <Col sm={3} xm={4}>
                                   <Button onClick={()=>{
                              console.log(`Checking if date reach pdf function`,date)
                              const formattedDate = new Date(date).toISOString().split('T')[0];
                                dispatch(getPaymentsByDatePdf(formattedDate))
                            }} variant='info'>Download report</Button>
                              </Col>
                               <Col sm={3} xm={4}>
                                   <Button onClick={()=>{
                              console.log(`Checking if date reach pdf function`,date)
                              const formattedDate = new Date(date).toISOString().split('T')[0];
                           dispatch(getPaymentsByDateReport({date,format:'pdf'}))
                            }} variant='info'>Download report Pdf</Button>
                              </Col>
                               <Col sm={3} xm={4}>
                                   <Button onClick={()=>{
                              console.log(`Checking if date reach pdf function`,date)
                              const formattedDate = new Date(date).toISOString().split('T')[0];
                              dispatch(getPaymentsByDateReport({date,format:'xlsx'}))
                            }} variant='info'>Download report Xls</Button>
                              </Col>
                                <Col sm={3} xm={4}>
                                   <Button onClick={()=>{
                              console.log(`Checking if date reach pdf function`,date)
                              const formattedDate = new Date(date).toISOString().split('T')[0];
                              dispatch(getPaymentsByDateReport({date,format:'csv'}))
                            }} variant='info'>Download report Csv</Button>
                              </Col>
                           </Row>
                           <br></br>
                        <Table size='md' striped bordered hover variant="dark" className='mt-5 mb-5' style={{borderRadius:"2 rem"}}>
                          <tr>
                            <th>Customer</th>
                            <th>Invoice No</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                         { paymentslist.map((payment)=>(
                            <tr>
                              <td>
                                 {payment.customerId}
                              </td>
                              <td>
                                 {payment.invoiceNo}
                              </td>
                              <td>
                                 {payment.amount}
                              </td>
                              <td>
                                 {payment.status}
                              </td>
                              </tr>
                          )
                          )}
                          </Table>
                          </>
                       }</div>
                    )  
                }
                     
              


          <Paginationbootstrap
            page={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </Container>
          </>

</Col>
</Row>
    </Container>

  )
}

export default PaymentsByDate
