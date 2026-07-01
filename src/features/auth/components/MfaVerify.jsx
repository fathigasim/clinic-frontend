import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyMfa } from '../authSlice';
import { Form, FormControl, Button, Container, Row, Col, Alert } from 'react-bootstrap';

export const MfaVerify = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const mfaToken = location.state?.mfaToken;
  const returnUrl = location.state?.from || '/';

  if (!mfaToken) {
    navigate('/auth/login', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(verifyMfa({ mfaToken, code })).unwrap();
      navigate(returnUrl, { replace: true });
    } catch (err) {
      setError(err || 'Invalid code');
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={5}>
          <p>Enter your authenticator code</p>
          <Form onSubmit={handleSubmit} className="mt-3 py-3 px-3 rounded shadow" style={{ backgroundColor: '#f8f9fa' }}>
            <FormControl
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              className="mb-3"
            />
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" variant="primary">Verify</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MfaVerify;