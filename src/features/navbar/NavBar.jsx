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
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Clinic Management System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto px-2">
            <Nav.Link as={Link} to="/">Invoices</Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex gap-2">
                <NavDropdown title="Clinic Management" id="nav-dropdown-orders">
                  <NavDropdown.Item as={Link} to="/patientform">Patient Form</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/schedule">Doctor Schedule</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/appointmentform">Book appointment</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/medicalrecord">Medical Records</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Payments" id="nav-dropdown-payments">
                  <NavDropdown.Item as={Link} to="/payments">Payments Details</NavDropdown.Item>
                </NavDropdown>
              </div>

              {isAuthenticated && (
                <>
                  <span className="text-light">Welcome, {user || 'User'}!</span>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}  // ✅ no ()
                  className="text-nowrap"
                >
                  Logout
                </Button>
                </>
              )}
            </div>

            <div className="d-flex align-items-center gap-2">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Button as={Link} to="/register" variant="primary" size="sm">
                Register
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;