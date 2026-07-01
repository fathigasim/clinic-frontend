import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../authSlice';
import {
  Form,
  FormGroup,
  FormControl,
  Col,
  Row,
  Container,
  Button,
} from 'react-bootstrap';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const returnUrl = location.state?.from || '/';

  const clearFieldError = (field) => {
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Client-side validation
//     const errors = {};
//     if (!email) errors.email = 'Email is required';
//     if (!password) errors.password = 'Password is required';
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     setFormErrors({});

//     try {
//       await dispatch(login({ email, password })).unwrap();

// // then after login:
// navigate(returnUrl, { replace: true });
 
//     } catch (error) {
//       console.error('Login error:', error);
//       // Only mark password invalid — don't reveal which field is wrong (security)
//       setFormErrors({ password: 'Invalid email or password' });
//     }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();
  const errors = {};
  if (!email) errors.email = 'Email is required';
  if (!password) errors.password = 'Password is required';
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }
  setFormErrors({});

  try {
    const result = await dispatch(login({ email, password })).unwrap();

    if (result.mfaRequired) {
      navigate('/auth/mfa-verify', { state: { mfaToken: result.mfaToken, from: returnUrl } });
    } else {
      navigate(returnUrl, { replace: true });
    }
  } catch (error) {
    console.error('Login error:', error);
    setFormErrors({ password: 'Invalid email or password' });
  }
};
  return (
    <Container className="mt-3">
      <Row>
        <Col md={5}>
          <p>Login Form</p>
          <Form noValidate onSubmit={handleSubmit} className='mt-3 py-3 px-3 rounded shadow justify-content-center' style={{backgroundColor:'#f8f9fa'}}>
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
              Login
            </Button>
          </Form>
          <div className="mt-3 flex gap-2">
            <a href="/auth/forgot-password">Forgot Password?</a>
         <br/>
            <a href="/register">Don't have an account? Register</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;