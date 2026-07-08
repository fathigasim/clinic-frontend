
import './App.css'
import { Route,Routes ,BrowserRouter} from 'react-router'
import PatientForm from './features/patient/components/PatientForm'
import DoctorForm from './features/doctor/components/DoctorForm'
import LoginForm from './features/auth/components/LoginForm'
import NavBar from './features/navbar/NavBar'
import PrivateRoute from './features/auth/components/PrivateRoute'
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
import {PaymentPage} from './features/payment/components/PaymentPage'
import Dashboard from './features/home/Dashboard'
import Patients from './features/patient/components/Patients'
import NotFound from './components/NotFound';
import InvoiceByDateReport from './features/invoice/components/InvoiceByDateReport'
import DoctorsSchedule from './features/doctor/components/DoctorsSchedule'
import MfaVerify from './features/auth/components/MfaVerify'
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './features/auth/authSlice';
import { tokenService } from './services/tokenService';
import { initializeAuth } from './features/auth/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react'
function App() {
  //   const token = tokenService.getAccessToken();

  // const isAuthenticated = useSelector(selectIsAuthenticated);
  // const role=tokenService.getUserRoles(token);
    const dispatch = useDispatch();
const isAuthenticated = useSelector(selectIsAuthenticated);
const role = useMemo(() => {
  const token = tokenService.getAccessToken();
  return tokenService.getUserRoles(token);
}, [isAuthenticated]); // recompute only when auth actually changes
  // useEffect(() => {
  //   dispatch(initializeAuth());
  // }, []);
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
    <>
     <BrowserRouter>
     <NavBar/>
       <Routes>
     {(!isAuthenticated || isAuthenticated && !role.includes('Admin')) &&
      <Route path="/" element={<HomePage/>} />
     }
      {isAuthenticated && !role.includes('Admin') &&
     <Route path="/" element={<HomePage/>} />
     }
     {isAuthenticated && role.includes('Admin') &&
     <Route path="/" element={<Dashboard/>} />
     }
       <Route path="/patients/patients-list" element={<Patients/>} />
       <Route path="/doctors/doctor-form" element={<DoctorForm/>} />
       <Route path="/auth/register" element={<RegisterForm/>} />
       <Route path="/auth/login" element={<LoginForm/>} />
       <Route path="/auth/mfa-verify" element={<MfaVerify/>} />
       <Route path="/auth/confirm-email" element={<ConfirmEmail/>} />
       <Route path="/auth/forgot-password" element={<ForegotPassword/>} />
       <Route path="/auth/reset-password" element={<ResetPassword/>} />
       <Route path='/auth/forbidden' element={<Forbidden/>}></Route>
       <Route path='/ServerError' element={<ServerError/>}></Route>
       <Route path='/Doctors/schedule' element={<DoctorSchedule/>}></Route>  
        <Route path='/Doctors/weekly-schedule' element={<DoctorsSchedule/>}></Route>
       <Route path='/Appointments/appointmentform' element={<AppointmentForm/>}></Route>
       <Route path='/Appointments/appointments' element={<TodayAppointments/>}></Route>
       <Route path='/doctors/medical-records' element={<MedicalRecordForm/>}></Route>
       <Route path='/invoice/invoice-form' element={<InvoiceForm/>}></Route>
       <Route path='/payments/payment-form' element={<PaymentForm/>}></Route>
       <Route path='/payments/payment-success' element={<PaymentSuccess/>}></Route>
        <Route path='/invoice/MonthlyStats' element={<MonthlyInvoiceCharts/>}></Route>
          <Route path='/invoice/WeeklyStats' element={<WeeklyInvoiceCharts/>}></Route>
          <Route path='/invoice/DailyStats' element={<DailyInvoiceCharts/>}></Route>
          <Route path='/invoice/InvoiceByDate' element={<InvoiceByDateReport/>}></Route>
        <Route path='/payments/paymentpage' element={<PaymentPage/>}></Route>
         <Route path='/management/dashboard' element={<Dashboard/>}></Route>
        <Route path='*' element={<NotFound/>}></Route>
       
       --private routes --
       <Route path="/patients/patient-form" element={
        <PrivateRoute allowedRoles={['Admin']} requireAllRoles={false} fallbackUrl="/auth/forbidden" loginUrl="/login">
          <PatientForm/>
        </PrivateRoute>
       
       } />
       </Routes>
     
     </BrowserRouter>
    </>
  )
}

export default App
