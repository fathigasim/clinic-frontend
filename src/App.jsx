
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
import VisualCharts from './features/charts/VisualCharts'
import RegisterForm from './features/auth/components/RegisterForm'
function App() {
  
  return (
    <>
     <BrowserRouter>
     <NavBar/>
       <Routes>
     
     <Route path="/" element={<HomePage/>} />
    
       <Route path="/doctorform" element={<DoctorForm/>} />
       <Route path="/register" element={<RegisterForm/>} />
       <Route path="/login" element={<LoginForm/>} />
       <Route path='/forbidden' element={<Forbidden/>}></Route>
       <Route path='/schedule' element={<DoctorSchedule/>}></Route>
       <Route path='/appointmentform' element={<AppointmentForm/>}></Route>
         <Route path='/appointments' element={<TodayAppointments/>}></Route>
       <Route path='/medicalrecord' element={<MedicalRecordForm/>}></Route>
       <Route path='/invoice' element={<InvoiceForm/>}></Route>
       <Route path='/payment' element={<PaymentForm/>}></Route>
      <Route path='/visualcharts' element={<VisualCharts/>}></Route>

       --private routes --
       <Route path="/patientform" element={
        <PrivateRoute allowedRoles={['Admin','User']} requireAllRoles={false} fallbackUrl="/forbidden" loginUrl="/login">
          <PatientForm/>
        </PrivateRoute>
       
       } />
       </Routes>
     
     </BrowserRouter>
    </>
  )
}

export default App
