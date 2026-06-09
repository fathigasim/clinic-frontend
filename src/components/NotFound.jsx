
import { Container ,Alert} from 'react-bootstrap';   

const NotFound = () => {


 
  return (
    <Container className='mt-3 mb-3'>
     <Alert variant='danger' className='text-center'>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </Alert>

    </Container>
  );
};

export default NotFound;