import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SignUp } from './components/Signup.jsx';
import { SignIn } from './components/Signin.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { PatientList } from './components/PatientsList.jsx';
import { InvoiceList } from './components/InvoiceList.jsx';
import { NotFound } from './components/NotFound.jsx';
import { ForgotPassword } from './components/ForgotPassword.jsx';
import { PasswordReset } from './components/PasswordReset.jsx';
import { AppointmentsList } from './components/AppointmentsList.jsx';

function App() {
  return (
    <Routes>
      <Route path='*' element={<NotFound />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/patients" element={<PatientList />} />
      <Route path="/invoices" element={<InvoiceList />} />
      <Route path="/appointments" element={<AppointmentsList />} />
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
    </Routes>
  )
}

export default function Main() {
  return (
    <Router>
      <App />
    </Router>
  );
}
