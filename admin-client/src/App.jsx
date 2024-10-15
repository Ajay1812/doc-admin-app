import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SignUp } from './components/Signup.jsx';
import { SignIn } from './components/Signin.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { PatientList } from './components/PatientsList.jsx';
import { InvoiceList } from './components/InvoiceList.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/patients" element={<PatientList />} />
      <Route path="/invoices" element={<InvoiceList />} />
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
