import { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../authSlice';
import {
  Form,
  // FormGroup,
  FormControl,
  // Col,
  // Row,
  // Container,
  // Button,
} from 'react-bootstrap';

const LoginForm = () => {
  useEffect(() => {
  document.body.classList.add("auth-body");
  return () => {
    document.body.classList.remove("auth-body");
  };
}, []);
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
    // <Container className="mt-3">
    //   <Row>
    //     <Col md={5}>
    //       <p>Login Form</p>
    //       <Form noValidate onSubmit={handleSubmit} className='mt-3 py-3 px-3 rounded shadow justify-content-center' style={{backgroundColor:'#f8f9fa'}}>
    //         <FormGroup className="mb-3" controlId="emailId">
    //           <FormControl
    //             type="email"
    //             value={email}
    //             onChange={(e) => {
    //               setEmail(e.target.value);
    //               clearFieldError('email');
    //             }}
    //             isInvalid={!!formErrors.email}
    //             placeholder="Email"
    //           />
    //           <Form.Control.Feedback type="invalid">
    //             {formErrors.email}
    //           </Form.Control.Feedback>
    //         </FormGroup>

    //         <FormGroup className="mb-3" controlId="passwordId">
    //           <FormControl
    //             type="password"
    //             value={password}
    //             onChange={(e) => {
    //               setPassword(e.target.value);
    //               clearFieldError('password');
    //             }}
    //             isInvalid={!!formErrors.password}
    //             placeholder="Password"
    //           />
    //           <Form.Control.Feedback type="invalid">
    //             {formErrors.password}
    //           </Form.Control.Feedback>
    //         </FormGroup>

    //         <Button type="submit" variant="primary">
    //           Login
    //         </Button>
    //       </Form>
    //       <div className="mt-3 flex gap-2">
    //         <a href="/auth/forgot-password">Forgot Password?</a>
    //      <br/>
    //         <a href="/register">Don't have an account? Register</a>
    //       </div>
    //     </Col>
    //   </Row>
    // </Container>
    <div className="auth-body">
  <button className="icon-button theme-toggle auth-theme-toggle" type="button" data-theme-toggle aria-label="Switch color theme" title="Switch color theme">
    <i className="bi bi-moon-stars" data-theme-icon aria-hidden="true"></i>
  </button>
  <main className="auth-page">
    <section className="auth-card">
      <a className="auth-brand" href="index.html"><span className="brand-icon"><i className="bi bi-grid-1x2-fill" aria-hidden="true"></i></span><span><strong>adminHMD</strong><small>Sign in to your admin workspace.</small></span></a>
      <div className="auth-visual"><img src="../assets/images/png/dasher-ui-bootstrap-5.jpg" alt="adminHMD dashboard interface"/></div>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-4">
          <p className="eyebrow mb-1">Secure Access</p>
          <h1 className="h3 mb-1">Login</h1>
          <p className="text-muted mb-0">Sign in to your admin workspace.</p>
        </div>
        <div className="mb-3">
          <label className="form-label" for="loginEmail">Email address</label>
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
      </div>
          {/* <div className="invalid-feedback">Enter a valid email.</div></div> */}
        <div className="mb-3"><div className="d-flex justify-content-between"><label className="form-label" for="loginPassword">Password</label>
        <a className="small fw-semibold" href="/auth/forgot-password">Forgot?</a></div>
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
        <div className="invalid-feedback">Password must be at least 6 characters.</div></div>
        <div className="form-check mb-4"><input className="form-check-input" type="checkbox" id="rememberMe"/><label className="form-check-label" for="rememberMe">Remember me</label></div>
        <button className="btn btn-primary w-100" type="submit"><i className="bi bi-box-arrow-in-right" aria-hidden="true"></i> Sign In</button>
      </form>
      
      <div className="auth-footer">New here? <a href="/auth/register">Create an account</a></div>
    </section>
  </main>


</div>

  );
};

export default LoginForm;