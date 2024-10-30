import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { BiTrash } from "react-icons/bi";
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../config';

export const AppointmentsList = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(dayjs());
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('Scheduled');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/patients`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        setPatients(response.data.patients);
      } catch (err) {
        setError('Error fetching patients');
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/appointments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const appointmentsWithPatientNames = response.data.appointments.map(appointment => {
          const patient = patients.find(p => p._id === appointment.patientId);
          return {
            ...appointment,
            firstName: patient ? patient.firstName : 'Unknown',
            lastName: patient ? patient.lastName : 'Unknown',
            phone: patient ? patient.phone : 'Unknown',
          };
        });

        setAppointments(appointmentsWithPatientNames);
      } catch (err) {
        setError('Error fetching appointments');
      }
    };

    if (patients.length) {
      fetchAppointments();
    }
  }, [patients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedPatientDetails = patients.find(
        (patient) => patient._id === selectedPatient
      );

      if (!selectedPatientDetails) {
        setError('Selected patient not found');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/admin/add-appointments`,
        {
          firstName: selectedPatientDetails.firstName,
          lastName: selectedPatientDetails.lastName,
          phone: selectedPatientDetails.phone,
          appointmentDate,
          reason,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response)
      toast.success("Appointment added successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
      setSelectedPatient('');
      setAppointmentDate(dayjs());
      setReason('');

      setAppointments((prevAppointments) => [
        ...prevAppointments,
        {
          _id: response.data._id,
          firstName: selectedPatientDetails.firstName,
          lastName: selectedPatientDetails.lastName,
          phone: selectedPatientDetails.phone,
          appointmentDate,
          reason,
          status,
        },
      ]);
    } catch (err) {
      setError('Error adding appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    setLoading(true);
    setError('');
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`${BASE_URL}/admin/delete-appointment/${appointmentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment._id !== appointmentId)
        );
        toast.success("Appointment deleted successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      } catch (err) {
        setError('Error deleting appointment. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      setLoading(true);
      setError('');
      await axios.patch(`${BASE_URL}/admin/appointments/${appointmentId}/status`, {
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: newStatus } : appointment
        )
      );

      toast.success(`Appointment ${newStatus.toLowerCase()} successfully`, {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (err) {
      setError(`Failed to update appointment status to ${newStatus}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
            Add Appointment
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4}>
          <div style={{ marginLeft: "20px", width: "300px" }}>
            <TextField
              select
              label="Select Patient"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              fullWidth
              required
            >
              {patients.map((patient) => (
                <MenuItem key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName} - {patient.phone}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <div style={{ marginLeft: "20px", width: "300px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                disablePast
                label="Appointment Date & Time"
                value={appointmentDate}
                onChange={(newValue) => {
                  if (newValue && newValue.isValid()) {
                    setAppointmentDate(newValue);
                  } else {
                    setError("Invalid date");
                  }
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                required
              />
            </LocalizationProvider>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <div style={{ marginLeft: "20px", width: "300px" }}>
            <TextField
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={8}>
          {loading ? (
            <CircularProgress />
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0 20px 0" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                startIcon={<LocalHospitalRoundedIcon />}
                disabled={!selectedPatient || !appointmentDate || !reason}
              >
                Add Appointment
              </Button>
            </div>
          )}
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Patient Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Phone</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Appointment Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Reason</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Status</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment._id}</TableCell>
                    <TableCell>{appointment.firstName} {appointment.lastName}</TableCell>
                    <TableCell>{appointment.phone}</TableCell>
                    <TableCell>{dayjs(appointment.appointmentDate).format('YYYY-MM-DD HH:mm')}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>
                      <Button
                        color={
                          appointment.status === 'Scheduled' ? 'secondary' :
                            appointment.status === 'Completed' ? 'primary' : 'error'
                        }
                        onClick={() => {
                          const nextStatus =
                            appointment.status === 'Scheduled'
                              ? 'Completed'
                              : appointment.status === 'Completed'
                                ? 'Cancelled'
                                : 'Scheduled';
                          updateAppointmentStatus(appointment._id, nextStatus);
                        }}
                      >
                        {appointment.status}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(appointment._id)}
                        color="error"
                        startIcon={<BiTrash />}
                      >
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid >
      <ToastContainer />
    </>
  );
};
