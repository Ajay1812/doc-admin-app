import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, MenuItem, Alert, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../config';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const InvoiceGenerate = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [procedure, setProcedure] = useState('');
  const [cost, setCost] = useState('');
  const [treatments, setTreatments] = useState([]);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

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

  const handleAddTreatment = () => {
    if (procedure && cost) {
      setTreatments([...treatments, { procedure, cost: parseFloat(cost) }]);
      setProcedure('');
      setCost('');
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedPatient || !amount || !services) {
      // console.log(selectedPatient, amount, services)
      setError('Please fill out all fields to generate an invoice.');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/admin/patients/${selectedPatient}/invoices`,
        {
          patientId: selectedPatient,
          amount,
          services,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setGeneratedInvoice(response.data.invoice);
      toast.success("Invoice generated successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (err) {
      setError('Error generating invoice. Please try again.');
    }
  };


  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Generate Invoice</Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
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
        </Grid>

        <Grid item xs={6} md={3}>
          <TextField
            label="Procedure"
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="Cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" color="primary" onClick={handleAddTreatment}>
            Add Treatment
          </Button>
        </Grid>

        <Grid item xs={12}>
          {treatments.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6">Treatments</Typography>
                <ul>
                  {treatments.map((treatment, index) => (
                    <li key={index}>{treatment.procedure} - ${treatment.cost}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateInvoice}
            disabled={!selectedPatient || treatments.length === 0}
          >
            Generate Invoice
          </Button>
        </Grid>

        {generatedInvoice && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5">Generated Invoice</Typography>
                <pre>{JSON.stringify(generatedInvoice, null, 2)}</pre>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      <ToastContainer />
    </>
  );
};
