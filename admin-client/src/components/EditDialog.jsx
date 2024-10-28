import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../config.js";

function EditDialog({ open, onClose, patientId, refreshPatients }) {
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    phone: "",
    address: "",
    medicalHistory: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && patientId) {
      const fetchPatientData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${BASE_URL}/admin/patients/${patientId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setPatientData(response.data.patient);
        } catch (err) {
          setError("Failed to load patient data");
        } finally {
          setLoading(false);
        }
      };
      fetchPatientData();
    }
  }, [open, patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await axios.put(`${BASE_URL}/admin/patients/${patientId}`, patientData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      refreshPatients();
      onClose();
    } catch (err) {
      setError("Failed to update patient");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Patient</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstName"
              value={patientData.firstName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              value={patientData.lastName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={patientData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Age"
              name="age"
              type="number"
              value={patientData.age}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              value={patientData.phone}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              value={patientData.address}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Medical History"
              name="medicalHistory"
              value={patientData.medicalHistory}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={saving}>
          {saving ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditDialog;
