
import { useEffect,useState } from 'react';
import { useSearchParams } from 'react-router'
import { Container,Alert } from 'react-bootstrap';
import { useDispatch ,useSelector} from 'react-redux';
import { confirmEmail ,selectAuthLoading} from '../authSlice';
const ConfirmEmail = () => {
    const [searchParams] = useSearchParams();
    const email=searchParams.get("email");
      const token=searchParams.get("token");
      const [isSuccess, setIsSuccess] = useState(false);
      const [error,setError]=useState(null);
      const dispatch = useDispatch();
      const isLoading = useSelector(selectAuthLoading);
     
    useEffect(() => {
  const confirm = async () => {
    try {
      if (!email || !token) {
        setError('Invalid confirmation link. Please check your email and try again.');
        return;
      }
      console.log('Confirming email with:', { email, token });
      await dispatch(confirmEmail({ email, token })).unwrap(); //  awaited
      setIsSuccess(true);
      console.log('Email confirmation successful');
    } catch (error) {
      console.error('Error confirming email:', error);
      setError(error.message || 'Confirmation failed. Please try again.');
    }
  };
  confirm();
}, [email, token,dispatch]);
  return (

       <Container className="mt-3">
    {isLoading && <Alert variant="info">Confirming your email, please wait...</Alert>}
{isSuccess && <Alert variant="success">Email confirmed! You can now log in.</Alert>}
{error && <Alert variant="danger">{error}</Alert>}
      </Container>
     
  )
}

export default ConfirmEmail
