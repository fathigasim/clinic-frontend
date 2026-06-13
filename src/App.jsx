
import './App.css'
import { Route,Routes ,BrowserRouter} from 'react-router'
import PatientForm from './features/patient/components/PatientForm'
import DoctorForm from './features/doctor/components/DoctorForm'
import LoginForm from './features/auth/components/LoginForm'
import NavBar from './features/navbar/NavBar'
import PrivateRoute from './features/auth/components/PrivateRoute'
import Forbidden from './features/auth/components/forbidden'
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
import PaymentSuccess from './features/payment/components/PaymentSuccess'
import {PaymentPage} from './features/payment/components/PaymentPage'
import Patients from './features/patient/components/Patients'
import NotFound from './components/NotFound';
import InvoiceByDateReport from './features/invoice/components/InvoiceByDateReport'
import DoctorsSchedule from './features/doctor/components/DoctorsSchedule'

function App() {
  
  return (
    <>
     <BrowserRouter>
     <NavBar/>
       <Routes>
     
     <Route path="/" element={<HomePage/>} />
       
       <Route path="/patients" element={<Patients/>} />
       <Route path="/doctorform" element={<DoctorForm/>} />
       <Route path="/register" element={<RegisterForm/>} />
       <Route path="/login" element={<LoginForm/>} />
       <Route path="/auth/confirm-email" element={<ConfirmEmail/>} />
       <Route path="/auth/forgot-password" element={<ForegotPassword/>} />
       <Route path="/auth/reset-password" element={<ResetPassword/>} />
       <Route path='/forbidden' element={<Forbidden/>}></Route>
       <Route path='/doctor/schedule' element={<DoctorSchedule/>}></Route>  
        <Route path='/doctor/weeklyschedule' element={<DoctorsSchedule/>}></Route>
       <Route path='/appointmentform' element={<AppointmentForm/>}></Route>
       <Route path='/appointments' element={<TodayAppointments/>}></Route>
       <Route path='/medicalrecord' element={<MedicalRecordForm/>}></Route>
       <Route path='/invoice' element={<InvoiceForm/>}></Route>
       <Route path='/payment' element={<PaymentForm/>}></Route>
       <Route path='/payment-success' element={<PaymentSuccess/>}></Route>
        <Route path='/Invoice/MonthlyStats' element={<MonthlyInvoiceCharts/>}></Route>
          <Route path='/Invoice/WeeklyStats' element={<WeeklyInvoiceCharts/>}></Route>
          <Route path='/Invoice/DailyStats' element={<DailyInvoiceCharts/>}></Route>
          <Route path='/Invoice/InvoiceByDate' element={<InvoiceByDateReport/>}></Route>
        <Route path='/paymentpage' element={<PaymentPage/>}></Route>
        <Route path='*' element={<NotFound/>}></Route>
       
       --private routes --
       <Route path="/patientform" element={
        <PrivateRoute allowedRoles={['Admin']} requireAllRoles={false} fallbackUrl="/forbidden" loginUrl="/login">
          <PatientForm/>
        </PrivateRoute>
       
       } />
       </Routes>
     
     </BrowserRouter>
    </>
  )
}

export default App
