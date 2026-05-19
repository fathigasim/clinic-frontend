import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../authSlice';
import {
  Form,
  FormGroup,
  FormControl,
  Col,
  Row,
  Container,
  Button,
} from 'react-bootstrap';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
//   const location = useLocation();

  const returnUrl = '/login';//location.state?.from || 

  const clearFieldError = (field) => {
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
  await dispatch(register({ email, password })).unwrap();
// then after register:
toast.success('Registration successful! Redirecting to login...', {
  autoClose: 2000, // Closes after 2 seconds
  onClose: () => navigate('/login', { replace: true }) // Redirects when it closes
});

    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Register error:', error);
      // Only mark password invalid — don't reveal which field is wrong (security)
      setFormErrors({ password: 'Invalid email or password' });
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={4}>
          <p>Register Form</p>
          <Form noValidate onSubmit={handleSubmit}>
            <FormGroup className="mb-3" controlId="emailId">
              <FormControl
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                isInvalid={!!formErrors.email}
                placeholder="Email"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email}
              </Form.Control.Feedback>
            </FormGroup>

            <FormGroup className="mb-3" controlId="passwordId">
              <FormControl
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                isInvalid={!!formErrors.password}
                placeholder="Password"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.password}
              </Form.Control.Feedback>
            </FormGroup>

            <Button type="submit" variant="primary">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
