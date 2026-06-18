import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { logout ,selectIsAuthenticated} from '../auth/authSlice';
import { useDispatch,useSelector } from 'react-redux';
import { tokenService } from '../../services/tokenService';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const token = tokenService.getAccessToken();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const user=tokenService.getEmailFromToken(token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Clinic Management System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          {/* <Nav className="me-auto px-2">
            <Nav.Link as={Link} to="/">Invoices</Nav.Link>
          </Nav> */}

          <Nav className="ms-auto align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex gap-2">
               
                  
                <NavDropdown title="Doctor & Patient Management" id="nav-dropdown-doctor">
                   <NavDropdown.Item as={Link} to="/patients/patient-form">Patient Form</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/patients/patients-list">Patient List</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/doctors/doctor-form">Doctor Form</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/doctors/schedule">Doctor Schedule</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/doctors/weekly-schedule">Doctors Schedule</NavDropdown.Item>
                </NavDropdown>

                 <NavDropdown title="Appointment & medical record Management" id="nav-dropdown-doctor">
                  <NavDropdown.Item as={Link} to="/appointments/appointmentform">Appointment Form</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/appointments/appointments">Appointment Schedule</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/doctors/medical-records">Medical Record</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Invoices&Payments" id="nav-dropdown-payments">
                   <NavDropdown.Item as={Link} to="/Invoice/invoice-form">Invoice Form</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/payments">Payments Details</NavDropdown.Item>
                </NavDropdown>
              </div>

              {isAuthenticated && (
                <>
                  <span className="text-light">Welcome, {user || 'User'}!</span>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}  //  no ()
                  className="text-nowrap"
                >
                  Logout
                </Button>
                </>
              )}
            </div>
           {!isAuthenticated && 
            <div className="d-flex align-items-center gap-2">
              <Nav.Link as={Link} to="/auth/login">Login</Nav.Link>
              <Button as={Link} to="/auth/register" variant="primary" size="sm">
                Register
              </Button>
            </div>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;