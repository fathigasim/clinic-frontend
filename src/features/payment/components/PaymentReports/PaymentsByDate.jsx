import React, { useEffect, useState } from 'react'
import { Container,Row,Col,Form,FormControl
  ,Button, Alert, FormGroup, Spinner } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import {getPaymentsByDate} from '../../paymentSlice'
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
  const { paymentslist, error, totalPages } = useSelector((state) => state.payment);

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
                 {/* {loading&&<Spinner variant='' size='sm' className='align-item-center'></Spinner>} */}
                      <ul>
                 {
                   paymentslist.length>0&&
                    paymentslist.map((payment)=>
                      <li key={payment.paymentId}>
                        {payment.customerId}
                      </li>
                    )
                 }
             </ul>
              


          <Paginationbootstrap
            page={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        
          </>

</Col>
</Row>
    </Container>

  )
}

export default PaymentsByDate
