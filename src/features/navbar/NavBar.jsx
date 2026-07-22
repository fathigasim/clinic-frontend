import { useDashboard } from '../../components/DashboardContext';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router';
import { useDispatch,useSelector } from 'react-redux';
import { logout ,selectIsAuthenticated} from '../auth/authSlice';
import {tokenService} from '../../services/tokenService'
import NavToggleSwitch from '../navbar/NavToggleSwitch'
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';
const NavBar = () => {
  const { theme, toggleTheme, toggleSidebar } = useDashboard();
  //get user
    const isAuthenticated = useSelector(selectIsAuthenticated);
  const token=tokenService.getAccessToken();
  const user=tokenService.getEmailFromToken(token);
  const dispatch=useDispatch();
const handleSignOut =async()=>{
    await dispatch(logout());
}

  return (
    <div className="admin-mainw-100">
      <nav className="navbar admin-navbar navbar-expand bg-white">
        <div className="container-fluid px-3 px-lg-4">
          
          {/* ========================================== */}
          {/* 1. SIDEBAR TOGGLE BUTTON (Commented Logic Connected) */}
          {/* ========================================== */}
          <button 
            className="sidebar-toggle" 
            type="button" 
            onClick={toggleSidebar} 
            aria-label="Toggle sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* <form className="d-none d-md-flex ms-3 flex-grow-1" role="search">
            <input className="form-control search-input" type="search" placeholder="Search users, orders, reports" aria-label="Search"/>
          </form> */}

          <div className="navbar-actions ms-auto">
                        <DropdownButton size='sm' id="dropdown-item-button" title="Patient">
      {/* <Dropdown.ItemText>Doctors</Dropdown.ItemText> */}
      <Dropdown.Item as="button" ><Link to={'/patients/patients-list'}>Patients</Link></Dropdown.Item>
      {/* <Dropdown.Item as="button"><Link to={'/Appointments/appointmentform'}>Doctor Schedule</Link></Dropdown.Item> */}
      <Dropdown.Item as="button"><Link to={'/Appointments/appointmentform'}>Doctor Appintemnts</Link></Dropdown.Item>
      <Dropdown.Item as="button">Something else</Dropdown.Item>
    </DropdownButton>

            <DropdownButton size='sm' id="dropdown-item-button" title="Doctor">
      {/* <Dropdown.ItemText>Doctors</Dropdown.ItemText> */}
      <Dropdown.Item as="button" ><Link to={'/doctors/schedule'}>Doctor Schedule</Link></Dropdown.Item>
      {/* <Dropdown.Item as="button"><Link to={'/Appointments/appointmentform'}>Doctor Schedule</Link></Dropdown.Item> */}
      <Dropdown.Item as="button"><Link to={'/Appointments/appointmentform'}>Doctor Appintemnts</Link></Dropdown.Item>
      <Dropdown.Item as="button">Something else</Dropdown.Item>
    </DropdownButton>
            {/* ========================================== */}
            {/* 2. THEME SWITCH BUTTON (Commented Logic Connected) */}
            {/* ========================================== */}
            <button 
              className="icon-button theme-toggle" 
              type="button" 
              onClick={toggleTheme} 
              aria-label="Switch color theme" 
              title="Switch color theme"
            >
              {/* Icon dynamically toggles classes based on context state */}
              <i className={theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars"} aria-hidden="true"></i>
            </button>

            {/* 1. The main parent container must be <Dropdown> */}
  <Dropdown align="end" as="div" className="dropdown">
    
    {/* 2. Turn your raw action button into the Toggle element */}
    <Dropdown.Toggle 
      as="button" 
      className="icon-button border-0 bg-transparent position-relative"
      id="dropdown-notifications"
    >
      <span className="notification-dot"></span>
      <i className="bi bi-bell" aria-hidden="true"></i>
    </Dropdown.Toggle>

    {/* 3. Wrap your custom notification card layout inside <Dropdown.Menu> */}
    <Dropdown.Menu 
      as="div" 
      className="dropdown-menu dropdown-menu-end notification-menu shadow-sm"
    >
      <div className="dropdown-header fw-bold text-body">Notifications</div>
      
      {/* 
        Using as={Link} lets you hook these straight to internal routes 
        without breaking page context 
      */}
      <Dropdown.Item as={Link} to="/management/users" className="dropdown-item">
        <span className="notification-title">New user registered</span>
        <span className="notification-time">4 minutes ago</span>
      </Dropdown.Item>
      
      <Dropdown.Item as={Link} to="/analytics/revenue" className="dropdown-item">
        <span className="notification-title">Revenue target reached</span>
        <span className="notification-time">32 minutes ago</span>
      </Dropdown.Item>
      
      <Dropdown.Item as={Link} to="/settings/security" className="dropdown-item">
        <span className="notification-title">Security review completed</span>
        <span className="notification-time">1 hour ago</span>
      </Dropdown.Item>
    </Dropdown.Menu>

  </Dropdown>

            {/* Profile Dropdown */}
            {/* Wrap your current element inside Dropdown with align spec */}
  <Dropdown align="end" as="div" className="dropdown">
    
    {/* 
      1. Use Dropdown.Toggle instead of raw button.
      Passing 'as={CustomButton}' keeps the template's markup intact while adding the click listener.
    */}
    <Dropdown.Toggle 
      as="button"
      className="profile-button dropdown-toggle border-0 bg-transparent"
    >
      <img className="avatar-img avatar-sm" src="/assets/images/avatar/avatar.jpg" alt="Admin Hasan"/>
      <span className="profile-name d-none d-sm-inline ms-1">{user }</span>
    </Dropdown.Toggle>

    {/* 
      2. Use Dropdown.Menu instead of <ul>.
      Passing 'as="ul"' renders a real <ul> tag so the template's structural styles apply.
    */}
    <Dropdown.Menu as="ul" className="dropdown-menu dropdown-menu-end">
         <li>
        <Dropdown.Item as={Link} to="#" className="dropdown-item">
          MFA
              {isAuthenticated && <NavToggleSwitch />}
        </Dropdown.Item>
      </li>
      <li>
        <Dropdown.Item as={Link} to="/management/profile" className="dropdown-item">
          Profile
        </Dropdown.Item>
      </li>
      <li>
        <Dropdown.Item as={Link} to="/management/settings" className="dropdown-item">
          Account settings
        </Dropdown.Item>
      </li>
      <li>
        <hr className="dropdown-divider"/>
      </li>
      <li>
       {isAuthenticated ? <Dropdown.Item as="button" 
        onClick={handleSignOut}
         className="dropdown-item border-0 bg-transparent text-danger w-100 text-start">
          Sign out
        </Dropdown.Item>:<Dropdown.Item as={Link} 
          to="/auth/login"
         className="dropdown-item border-0 bg-transparent text-danger w-100 text-start">
          SignIn
        </Dropdown.Item>} 
      </li>
    </Dropdown.Menu>
  </Dropdown>
      

          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;