import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

export function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    appointmentDate: '',
    reason: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/admin/appointments`, {
        headers: { Authorization: `Bearer ${token}` }, // Use GET and include token in headers
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error.response?.data || error.message);
      setErrorMessage('Failed to fetch appointments.'); // Set error message for user feedback
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      // Check if the patient exists before creating an appointment
      const patientResponse = await axios.get(`${BASE_URL}/admin/patients/`, {
        params: {
          firstName: newAppointment.firstName,
          lastName: newAppointment.lastName,
          phone: newAppointment.phone,
        },
      });
      console.log(patientResponse);

      // Check if data is an array and has at least one patient
      if (!Array.isArray(patientResponse.data) || patientResponse.data.length === 0) {
        setErrorMessage('Patient not found. Please check the details.');
        return;
      }

      const patientId = patientResponse.data[0]._id; // Now this is safe to access

      // Create new appointment with patientId
      const response = await axios.post(
        `${BASE_URL}/admin/appointment/`,
        { ...newAppointment, patientId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Appointment added:', response.data);
      fetchAppointments();
      handleClose();
    } catch (error) {
      console.error('Error adding appointment:', error.response?.data || error.message);
      alert('Error adding appointment: ' + (error.response?.data.message || error.message));
    }
  };


  const handleClose = () => {
    setOpen(false);
    setNewAppointment({
      firstName: '',
      lastName: '',
      phone: '',
      appointmentDate: '',
      reason: '',
    });
    setErrorMessage('');
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Appointments
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>{appointment.patient?.firstName}</TableCell>
                <TableCell>{appointment.patient?.lastName}</TableCell>
                <TableCell>{appointment.patient?.phone}</TableCell>
                <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} style={{ marginTop: '20px' }}>
        Add Appointment
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Appointment</DialogTitle>
        <DialogContent>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            name="firstName"
            value={newAppointment.firstName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            name="lastName"
            value={newAppointment.lastName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            name="phone"
            value={newAppointment.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Appointment Date"
            type="date"
            fullWidth
            variant="outlined"
            name="appointmentDate"
            value={newAppointment.appointmentDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Reason"
            type="text"
            fullWidth
            variant="outlined"
            name="reason"
            value={newAppointment.reason}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
