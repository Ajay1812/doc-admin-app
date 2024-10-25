import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, Grid, MenuItem, Modal, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BASE_URL } from "../config";

export const Treatments = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [procedure, setProcedure] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [xrayImage, setXrayImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [open, setOpen] = useState(false); // Modal state for Preview
  const [openViewAllTreatments, setOpenViewAllTreatments] = useState(false); // Modal state for preview all treatments
  const [treatments, setTreatments] = useState([])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/patients`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (Array.isArray(response.data.patients)) {
          setPatients(response.data.patients);
        } else {
          setPatients([]);
        }
      } catch (error) {
        setPatients([]);
      }
    };
    const fetchTreatments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/treatments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("TREATMENT: ", response.data)
        setTreatments(response.data);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
    };
    fetchPatients();
    fetchTreatments()
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setXrayImage(file);
    setImagePreviewUrl(URL.createObjectURL(file)); // Create a preview URL for the image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert("Please select a patient.");
      return;
    }

    const formData = new FormData();
    formData.append("procedure", procedure);
    formData.append("cost", cost);
    formData.append("date", date);
    formData.append("notes", notes);
    if (xrayImage) {
      formData.append("xrayImage", xrayImage);
    }

    try {
      const response = await axios.post(`${BASE_URL}/admin/patients/${selectedPatient}/treatments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Treatment added successfully:", response.data);
      setSelectedPatient('');
      setProcedure('');
      setCost('');
      setDate('');
      setNotes('');
      setXrayImage(null);
      setImagePreviewUrl(null);
    } catch (error) {
      console.error("Error creating treatment:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenTreatments = () => setOpenViewAllTreatments(true);
  const handleCloseTreatments = () => setOpenViewAllTreatments(false);

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
      <form onSubmit={handleSubmit} style={{ width: "60%" }}>
        <Typography variant="h4" gutterBottom textAlign="center" marginBottom="2.5rem">
          Add New Treatment
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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

          <Grid item xs={12}>
            <TextField
              label="Procedure"
              fullWidth
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cost"
              fullWidth
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" startIcon={<CloudUploadOutlinedIcon />}>
              Upload X-ray Image
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" color="secondary" onClick={handleOpen} startIcon={<VisibilityOutlinedIcon />}>
              Preview
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" startIcon={<LocalHospitalRoundedIcon />}>
              Add Treatment
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" color="secondary" onClick={handleOpenTreatments} startIcon={<ExpandMoreIcon />}>
              View All Treatments
            </Button>
          </Grid>
          <Grid item xs={12}>

          </Grid>
        </Grid>
      </form >

      {/* Modal for preview */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="preview-modal-title"
        aria-describedby="preview-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="preview-modal-title" variant="h6" component="h2">
            Treatment Preview
          </Typography>
          <Typography id="preview-modal-description" sx={{ mt: 2 }}>
            <strong>Patient:</strong> {patients.find(p => p._id === selectedPatient)?.firstName} {patients.find(p => p._id === selectedPatient)?.lastName}
          </Typography>
          <div style={{ marginBottom: "20px" }}>
            <Typography marginBottom={"5px"}><strong>Procedure:</strong> {procedure}</Typography>
            <Typography marginBottom={"5px"}><strong>Cost:</strong> {cost}</Typography>
            <Typography marginBottom={"5px"}><strong>Date:</strong> {date}</Typography>
            <Typography marginBottom={"5px"}><strong>Notes:</strong> {notes}</Typography>
          </div>
          {imagePreviewUrl && (
            <Box mt={2}>
              <Typography><strong>X-ray Image:</strong></Typography>
              <img src={imagePreviewUrl} alt="X-ray Preview" style={{ width: '100%', maxHeight: '25rem', objectFit: 'contain', marginTop: "2rem" }} />
            </Box>
          )}
        </Box>
      </Modal >
      {/* Modal for view all treatments */}
      <Modal
        open={openViewAllTreatments}
        onClose={handleCloseTreatments}
        aria-labelledby="preview-modal-title"
        aria-describedby="preview-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="treatments-modal-title" variant="h6" component="h2" textAlign="center">
            All Treatments
          </Typography>
          <TableContainer style={{ marginTop: "1rem" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Treatment ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Patient Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Procedure</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Cost</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>X-ray Image Path</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {treatments.map((treatment) => (
                  <TableRow key={treatment._id}>
                    <TableCell>{treatment._id}</TableCell>
                    <TableCell>
                      {treatment.patientId ? (
                        `${treatment.patientId.firstName.toUpperCase()} ${treatment.patientId.lastName.toUpperCase()}`
                      ) : (
                        'Unknown Patient'
                      )}
                    </TableCell>
                    <TableCell>{treatment.treatmentDetails.procedure}</TableCell>
                    <TableCell>{treatment.treatmentDetails.cost}</TableCell>
                    <TableCell>{treatment.treatmentDetails.xrayImagePath}</TableCell>
                    <TableCell>{new Date(treatment.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>

    </div >
  );
};
