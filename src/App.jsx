import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router' // Note: Use 'react-router-dom' if upgrading layout hooks
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useEffect } from 'react'

// Layout Infrastructure Components
import { DashboardProvider } from './components/DashboardContext'
import MainLayout from './components/MainLayout'

// Existing imports
import PatientForm from './features/patient/components/PatientForm'
import DoctorForm from './features/doctor/components/DoctorForm'
import LoginForm from './features/auth/components/LoginForm'
import PrivateRoute from './features/auth/components/PrivateRoute'
import { ROLES } from './constants/roles'
import Forbidden from './features/auth/components/Forbidden'
import DoctorSchedule from './features/doctor/components/DoctorSchedule'
import HomePage from './features/home/HomePage'
import AppointmentForm from './features/appointment/components/AppointmentForm'
import MedicalRecordForm from './features/medicalrecord/components/MedicalRecordForm'
import InvoiceForm from './features/invoice/components/InvoiceForm'
import PaymentForm from './features/payment/components/PaymentForm'
import TodayAppointments from './features/appointment/components/TodayAppointments'
import MonthlyInvoiceCharts from './features/invoice/components/MonthlyInvoiceCharts'
import DailyInvoiceCharts from './features/invoice/components/DailyInvoiceCharts'
import WeeklyInvoiceCharts from './features/invoice/components/WeeklyInvoiceCharts'
import RegisterForm from './features/auth/components/RegisterForm'
import ConfirmEmail from './features/auth/components/ConfirmEmail'
import ResetPassword from './features/auth/components/ResetPassword'
import ForegotPassword from './features/auth/components/ForegotPassword'
import ServerError from './features/auth/components/ServerError'
import PaymentSuccess from './features/payment/components/PaymentSuccess'
import { PaymentPage } from './features/payment/components/PaymentPage'
import Dashboard from './features/home/Dashboard'
import Patients from './features/patient/components/Patients'
import NotFound from './components/NotFound';
import InvoiceByDateReport from './features/invoice/components/InvoiceByDateReport'
import DoctorsSchedule from './features/doctor/components/DoctorsSchedule'
import MfaVerify from './features/auth/components/MfaVerify'
import { selectIsAuthenticated, initializeAuth } from './features/auth/authSlice';
import { tokenService } from './services/tokenService';
import EditPatient from './features/patient/components/EditPatient';
import EditDoctor from './features/doctor/components/EditDoctor';
import PaymentsByDate from './features/payment/components/PaymentReports/PaymentsByDate'

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const role = useMemo(() => {
    const token = tokenService.getAccessToken();
    return tokenService.getUserRoles(token) || [];
  }, [isAuthenticated]);

  const PUBLIC_ROUTES = [
    '/auth/login',
    '/auth/register',
    '/auth/mfa-verify',
    '/auth/confirm-email',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];

  useEffect(() => {
    if (!PUBLIC_ROUTES.includes(window.location.pathname)) {
      dispatch(initializeAuth());
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================== */}
        {/* BRANCH 1: PUBLIC / AUTH ROUTES (NO SIDEBAR) */}
        {/* ========================================== */}
        <Route path="/auth/register" element={<RegisterForm />} />
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/auth/mfa-verify" element={<MfaVerify />} />
        <Route path="/auth/confirm-email" element={<ConfirmEmail />} />
        <Route path="/auth/forgot-password" element={<ForegotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path='/auth/forbidden' element={<Forbidden />} />
        <Route path='/ServerError' element={<ServerError />} />
        <Route path='*' element={<NotFound />} />

        {/* ========================================== */}
        {/* BRANCH 2: THE PROTECTED APP (WITH SIDEBAR) */}
        {/* ========================================== */}
        <Route element={
          <DashboardProvider>
            <MainLayout />
          </DashboardProvider>
        }>
          {/* Dynamic Landing Context Engine */}
          <Route path="/" element={
            (!isAuthenticated || (isAuthenticated && !role.includes('Admin'))) 
              ? <HomePage /> 
              : <Dashboard />
          } />

          {/* Internal Dashboard Views */}
          <Route path="/patients/patients-list" element={<Patients />} />
           <Route path="/patients/editpatients/:id" element={<EditPatient />} />
          <Route path="/doctors/doctor-form" element={<DoctorForm />} />
          <Route path='/Doctors/schedule' element={<DoctorSchedule />} />  
          <Route path='/Doctors/doctor-schedule' element={<DoctorsSchedule />} />
          <Route path='/Doctors/editdoctors/:id' element={<EditDoctor />} />
          <Route path='/Appointments/appointmentform' element={<AppointmentForm />} />
          <Route path='/Appointments/appointments' element={<TodayAppointments />} />
          <Route path='/doctors/medical-records' element={<MedicalRecordForm />} />
          <Route path='/invoice/invoice-form' element={<InvoiceForm />} />
          <Route path='/payments/payment-form' element={<PaymentForm />} />
          <Route path='/payments/payment-success' element={<PaymentSuccess />} />
          //Payments Reports
          <Route path='/payments/reports/paymentsByDate' element={<PaymentsByDate />} />
          <Route path='/invoice/MonthlyStats' element={<MonthlyInvoiceCharts />} />
          <Route path='/invoice/WeeklyStats' element={<WeeklyInvoiceCharts />} />
          <Route path='/invoice/DailyStats' element={<DailyInvoiceCharts />} />
          <Route path='/invoice/InvoiceByDate' element={<InvoiceByDateReport />} />
          <Route path='/payments/paymentpage' element={<PaymentPage />} />
          <Route path='/management/dashboard' element={<Dashboard />} />

          {/* Protected Routes Wrapper */}
          <Route path="/patients/patient-form" element={
            <PrivateRoute allowedRoles={[ROLES.Admin, ROLES.User]} requireAllRoles={false} fallbackUrl="/auth/forbidden" loginUrl="/login">
              <PatientForm />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;