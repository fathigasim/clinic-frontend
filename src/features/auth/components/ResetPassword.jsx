
import { useSearchParams } from 'react-router'
import { Container, Row, Col,Form } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, selectAuthLoading } from '../authSlice';
import { toast } from 'react-toastify';

const ResetPassword = () => {
     const [formErrors, setFormErrors] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
     const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
    const dispatch = useDispatch();
    const loading = useSelector(selectAuthLoading);
      const clearFieldError = (field) => {
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newPassword) errors.newPassword = 'New password is required.';
    else if (newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters.';
    if (!newPasswordConfirm) errors.newPasswordConfirm = 'Please confirm your new password.';
    else if (newPassword !== newPasswordConfirm) errors.newPasswordConfirm = 'Passwords do not match.';
    setFormErrors(errors);
     if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
      return; //  stop if errors exist
     }
      setFormErrors({});
      try {
    const result = await dispatch(resetPassword({email,  token, newPassword })).unwrap();
      console.log('Password reset successful:', result);
      toast.success('Password reset successful! You can now log in with your new password.');
      }
        catch (error) {
        console.error('Reset password error:', error);
        toast.error(error.message || 'Password reset failed. Please try again.');
      }
  };

  return (
        <Container className="mt-5">

      <Row className="justify-content-center">
        <Col md={5} className="p-2">
      
      <Form
      style={{ padding: "10px" }}
  className="bg-white shadow rounded w-100"
        noValidate
        onSubmit={handleSubmit}
       
      >
        
          <h2 className="text-xl text-center font-semibold mb-4">Reset Password</h2>

          {formErrors.newPassword && (
            <p style={{ color: "red" }}>{formErrors.newPassword}</p>
          )}
          <Row className="align-items-center mb-3">
          
        <Col>    
         <Form.Group>
          <Form.Label>New Password</Form.Label>
                <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) =>{ setNewPassword(e.target.value)
                clearFieldError("newPassword");
              }}
              className="form-control border rounded  p-2 mb-4"
              required
              minLength={6}
              
            />
            </Form.Group>
      </Col>

          </Row>

          {formErrors.newPasswordConfirm && (
            <p style={{ color: "red" }}>{formErrors.newPasswordConfirm}</p>
          )}
         
           
       
            
        
           <Form.Group>
            <Form.Label>Confirm New Password</Form.Label>
          
           
            <Form.Control
              type="password"
              value={newPasswordConfirm}
              onChange={(e) =>{ setNewPasswordConfirm(e.target.value)
                clearFieldError("newPasswordConfirm")
              }}
              className="form-control border rounded w-full p-2 mb-4"
              required
              minLength={6}
              
            />
             </Form.Group>
            
          
         
        
            <Col >
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            </Col>
         
        
      </Form>
      </Col>
      </Row>
    </Container>
  )
}

export default ResetPassword
