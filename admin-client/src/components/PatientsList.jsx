import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config.js';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  TextField,
  Typography,
  IconButton,
  Grid,
} from '@mui/material';
import EditDialog from './EditDialog';
import MenuIcon from '@mui/icons-material/Menu';

export function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    phone: '',
    address: '',
    medicalHistory: [],
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/patients`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPatients(response.data.patients);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleOpenDialog = (patientId) => {
    setSelectedPatientId(patientId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedPatientId(null);
    setOpenDialog(false);
  };

  const refreshPatients = async () => {
    const response = await axios.get(`${BASE_URL}/admin/patients`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setPatients(response.data.patients);
  };

  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`${BASE_URL}/admin/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        refreshPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleAddPatient = async () => {
    try {
      await axios.post(`${BASE_URL}/admin/addpatients`, newPatient, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      refreshPatients();
      setNewPatient({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        age: '',
        phone: '',
        address: '',
        medicalHistory: [],
      });
      setDrawerOpen(false);
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* Toggle Button for Drawer */}
      <IconButton onClick={toggleDrawer} style={{ margin: '20px 0 20px 20px' }}>
        <MenuIcon fontSize='large' />
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <div style={{ width: 320, padding: 20 }}>
          <Typography textAlign={'center'} margin={"20px 0 20px 0"} variant="h5">Add Patient</Typography>
          <TextField
            label="First Name"
            fullWidth
            value={newPatient.firstName}
            onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Last Name"
            fullWidth
            value={newPatient.lastName}
            onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            value={newPatient.dateOfBirth}
            onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Age"
            fullWidth
            value={newPatient.age}
            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Phone"
            fullWidth
            value={newPatient.phone}
            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Address"
            fullWidth
            value={newPatient.address}
            onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Medical History"
            fullWidth
            value={newPatient.medicalHistory.join(', ')}
            onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value.split(',').map(item => item.trim()) })}
            margin="normal"
          />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Button variant="contained" color="primary" onClick={handleAddPatient}>
              Add Patient
            </Button>
          </div>
        </div>
      </Drawer>

      <Grid container spacing={2} justifyContent={'center'}>
        <Grid item xs={12} md={8}>
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0 20px 0" }}>
            <Typography variant='h4'>Patients List</Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }}>First Name</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Last Name</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Phone</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Address</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map(patient => (
                    <TableRow key={patient._id}>
                      <TableCell>{patient.firstName}</TableCell>
                      <TableCell>{patient.lastName}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.address}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Button variant="contained" color="primary" onClick={() => handleOpenDialog(patient._id)}>
                            Edit
                          </Button>
                          <Button variant="contained" color="secondary" onClick={() => handleDelete(patient._id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid >

      <EditDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        patientId={selectedPatientId}
        refreshPatients={refreshPatients}
      />
    </>
  );
};

export default PatientList;
