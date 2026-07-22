
import {NavLink } from "react-router"

const SideBar = () => {
  return (
    <div>
        <aside className="admin-sidebar" id="adminSidebar" aria-label="Main navigation">
      <div className="sidebar-header">
        <NavLink className="brand-mark" href="#" aria-label="adminHMD dashboard">
          <span className="brand-icon"><i className="bi bi-grid-1x2-fill" aria-hidden="true"></i></span>
          <span className="brand-copy">
            <span className="brand-title">adminHMD</span>
            <span className="brand-subtitle"> Clinic Admin</span>
          </span>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        <NavLink className="nav-link active" href="index.html" aria-current="page">
          <span className="nav-icon"><i className="bi bi-speedometer2" aria-hidden="true"></i></span>
          <span className="nav-text">Dashboard</span>
        </NavLink>
        <NavLink className="nav-link" to="/patients/patients-list">
          <span className="nav-icon"><i className="bi bi-people" aria-hidden="true"></i></span>
          <span className="nav-text">Patients</span>
        </NavLink>
        <NavLink className="nav-link" to="/patients/patient-form">
          <span className="nav-icon">
            <i className="bi bi-person-plus" aria-hidden="true"></i></span>
          <span className="nav-text">Add Patient</span>
        </NavLink>
  
        <NavLink className="nav-link" to="/Appointments/appointmentform">
          <span className="nav-icon"><i className="bi bi-person-badge" aria-hidden="true"></i></span>
          <span className="nav-text">Add Appointment</span>
        </NavLink>
        <NavLink className="nav-link" to="/doctors/medical-records">
          <span className="nav-icon">
            <i className="bi bi-bar-chart-line" aria-hidden="true"></i></span>
          <span className="nav-text">Add Medical Record</span>
        </NavLink>
        <NavLink className="nav-link" to="/invoice/invoice-form">
          <span className="nav-icon"><i className="bi bi-table" aria-hidden="true"></i></span>
          <span className="nav-text">Issue Invoice</span>
        </NavLink>
        <NavLink className="nav-link" href="forms.html">
          <span className="nav-icon"><i className="bi bi-ui-checks-grid" aria-hidden="true"></i></span>
          <span className="nav-text">Forms</span>
        </NavLink>
        <NavLink className="nav-link" href="components.html">
          <span className="nav-icon"><i className="bi bi-grid-3x3-gap" aria-hidden="true"></i></span>
          <span className="nav-text">Components</span>
        </NavLink>
        <NavLink className="nav-link" href="alerts.html">
          <span className="nav-icon"><i className="bi bi-exclamation-triangle" aria-hidden="true"></i></span>
          <span className="nav-text">Alerts</span>
        </NavLink>
        <NavLink className="nav-link" href="modals.html">
          <span className="nav-icon"><i className="bi bi-window-stack" aria-hidden="true"></i></span>
          <span className="nav-text">Modals</span>
        </NavLink>
        <NavLink className="nav-link" href="settings.html">
          <span className="nav-icon"><i className="bi bi-gear" aria-hidden="true"></i></span>
          <span className="nav-text">Settings</span>
        </NavLink>
        <NavLink className="nav-link" href="blank.html">
          <span className="nav-icon"><i className="bi bi-file-earmark" aria-hidden="true"></i></span>
          <span className="nav-text">Blank Page</span>
        </NavLink>
      </nav>

      <div className="sidebar-user">
        {/* <img className="avatar-img avatar-md sidebar-user-avatar" src="../assets/images/avatar/avatar.jpg" alt="Admin Hasan"> */}
        <strong>Admin Hasan</strong>
        <small>Active Workspace</small>
      </div>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        <span className="sidebar-footer-text">System running smoothly</span>
      </div>
    </aside>


    </div>
  )
}

export default SideBar
