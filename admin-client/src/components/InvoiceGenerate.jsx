import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../config';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const InvoiceGenerate = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [services, setServices] = useState('');
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Fetch patients once on mount
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

  const handleGenerateInvoice = async () => {
    if (!selectedPatient || !amount || !services) {
      setError('Please fill out all fields to generate an invoice.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/admin/invoices`, {
        patientId: selectedPatient,
        amount,
        services,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      setGeneratedInvoice(response.data.invoice); // Assuming the API returns the generated invoice
      toast.success("Invoice generated successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (err) {
      setError('Error generating invoice. Please try again.');
    }
  };

  const handleDownloadInvoice = () => {
    // Logic to download the invoice
    const invoiceBlob = new Blob([JSON.stringify(generatedInvoice, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(invoiceBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${generatedInvoice._id}.json`; // Change the filename as needed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

        <Grid item xs={12} md={6}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Services Rendered"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            fullWidth
            required
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateInvoice}
            disabled={!selectedPatient || !amount || !services}
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
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDownloadInvoice}
                >
                  Download Invoice
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      <ToastContainer />
    </>
  );
};
