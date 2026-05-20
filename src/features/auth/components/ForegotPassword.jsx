import React from 'react'

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, selectAuthLoading } from '../authSlice';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';


const ForegotPassword = () => {
    const [email, setEmail] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [emailSuccess, setEmailSuccess] = useState('');
    const loading = useSelector(selectAuthLoading);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    try {
     const result=   await dispatch(forgotPassword({ email })).unwrap();
     console.log('Forgot password successful:', result);
      setEmailSuccess('Password reset link sent to your email.');
      toast.success(result)
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setFormErrors({ email: 'Failed to send reset link. Please try again.' });
    }   };
  return (
      <Container className="mt-5 ">
      <Row>
        <Col md={5} className="mt-5 mx-auto">
    <Form noValidate onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-96 px-3 py-3">
      {formErrors.email &&  <Alert variant="danger">{formErrors.email}</Alert>}
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control  type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required
           placeholder="Enter_email"
      />
      {emailSuccess && <p style={{ color: "green" }}>{emailSuccess}</p>}
      </Form.Group>

       <Button variant="primary" type="submit"
        disabled={loading}
           className="bg-blue-600 text-black w-full py-2 rounded hover:bg-blue-700"
       >
        {loading ? `sending` : `send_reset_link`}
      </Button>
    </Form>
    </Col>
    </Row>
    </Container>
  )
}

export default ForegotPassword
