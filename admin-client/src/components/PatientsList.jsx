import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Drawer, TextField, Typography, IconButton, Grid, } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config.js';
import EditDialog from './EditDialog';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
        toast.success("Patient Deleted successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
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
      setDrawerOpen(true);
      toast.success("Patient added successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
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
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <div style={{ width: 320, padding: 20 }}>
          <Typography textAlign={'center'} margin={"70px 0 20px 0"} variant="h5">Add Patient</Typography>
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
            <Button variant="contained" color="primary" startIcon={<LocalHospitalRoundedIcon />} onClick={handleAddPatient}>
              Add Patient
            </Button>
          </div>
        </div>
      </Drawer>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
            <Typography marginRight="1.3rem" variant="h4">Patients List</Typography>
            <IconButton onClick={toggleDrawer}>
              <AddBoxOutlinedIcon color='primary' fontSize='large' />
            </IconButton>
          </div>
        </Grid>

        {/* Table Container */}
        <Grid item xs={12}>
          <TableContainer component={Paper} style={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Patient Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Phone</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Address</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Medical History</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map(patient => (
                  <TableRow key={patient._id}>
                    <TableCell>{patient.firstName.toUpperCase()} {patient.lastName.toUpperCase()}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.address}</TableCell>
                    <TableCell>{patient.medicalHistory}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <Button color="primary" startIcon={<EditOutlinedIcon />} onClick={() => handleOpenDialog(patient._id)}></Button>
                        <Button color='error' startIcon={<DeleteForeverOutlinedIcon />} onClick={() => handleDelete(patient._id)}></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <EditDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        patientId={selectedPatientId}
        refreshPatients={refreshPatients}
      />
      <ToastContainer />
    </>
  );
};

export default PatientList;
