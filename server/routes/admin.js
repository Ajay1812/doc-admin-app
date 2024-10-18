const {Admin,Patient,Appointment,Treatment,Invoice} = require("../db/db.js");
const { SECRET } = require("../middlewares/auth.js");
const { authenticateJwt } = require("../middlewares/auth.js");
const multer = require("multer");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../middlewares/upload.js");

router.get("/me", authenticateJwt, async (req, res) => {
  const username = req.admin.username;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(201).json({ username: admin.username });
  } else {
    res.status(403).json({ message: "Admin not found" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username, email, password });
    await newAdmin.save();
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin created successfully", token: token });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email, password });
  if (admin) {
    const token = jwt.sign({ email, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Logged in successfully", token: token });
  } else {
    res.status(403).json({ message: "Invalid email or password" });
  }
});

router.post("/addpatients", authenticateJwt, async (req, res) => {
  try {
    const newPatient = new Patient({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      age: req.body.age,
      phone: req.body.phone,
      address: req.body.address,
      medicalHistory: req.body.medicalHistory,
    });
    const savePatient = await Patient(newPatient);
    await savePatient.save();
    res.status(201).json({ message: "Patient added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while save patient", error });
  }
});
// get all patients
router.get("/patients", authenticateJwt, async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
});

// get the particular patient data
router.get("/patients/:id", authenticateJwt, async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (patient) {
    res.status(201).json({ patient });
  } else {
    res.status(403).json({ message: "Patient not found" });
  }
});

// Delete a patient
router.delete('/patients/:id', authenticateJwt, async (req, res) => {
  const { id } = req.params;  
  try {
    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error });
  }
});
// Update patient details
router.put('/patients/:id', authenticateJwt, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; 
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error });
  }
});



// Appointment Routes
// Appointment Routes
router.post("/appointments", authenticateJwt, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found. Please check the details." });
    }

    const newAppointment = new Appointment({
      patientId: patient._id,
      appointmentDate: req.body.appointmentDate,
      reason: req.body.reason,
      status: "Scheduled",
    });
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error: error.message });
  }
});


// Appointment Status Update
router.patch("/appointments/:id/status", authenticateJwt, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const newStatus = req.body.status;

    if (!["Scheduled", "Completed", "Cancelled"].includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value." });
    }
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment status.", error });
  }
});

// Treatment - patients/id/treatment
router.post("/patients/:patientId/treatments",upload.single("xrayImage"),async (req, res) => {
    try {
      const patientId = req.params.patientId;
      const { procedure, cost, date, notes } = req.body;
      const xrayImagePath = req.file
        ? `/assets/XRays/${req.file.filename}`
        : null; // Store path if image uploaded
      const newTreatment = new Treatment({
        patientId: patientId,
        treatmentDetails: {
          procedure: procedure,
          cost: cost,
          date: date,
          xrayImagePath: xrayImagePath, // Use the uploaded image path
        },
        notes: notes || "",
      });
      const savedTreatment = await newTreatment.save();
      res.status(201).json(savedTreatment);
    } catch (error) {
      res.status(500).json({ message: "Error creating treatment.", error });
    }
  }
);

// Invoice for particular patient
router.post('/patients/:patientId/invoices', async (req, res) => {
  const { treatments } = req.body;
  const patientId = req.params.patientId;
  if (!Array.isArray(treatments) || treatments.length === 0) {
    return res.status(400).json({ message: 'Treatments are required' });
  }
  let totalAmount = 0;
  const treatmentDetails = [];
  for (const treatment of treatments) {
    const { procedure } = treatment;
    const treatmentRecord = await Treatment.findOne({ "treatmentDetails.procedure": procedure });
    if (!treatmentRecord) {
      return res.status(404).json({ message: `Treatment not found for procedure: ${procedure}` });
    }
    treatmentDetails.push({ treatmentId: treatmentRecord._id, cost: treatmentRecord.treatmentDetails.cost });
    totalAmount += treatmentRecord.treatmentDetails.cost;
  }
  const existingInvoice = await Invoice.findOne({
    patientId: patientId,
    "treatments.treatmentId": { $all: treatmentDetails.map(td => td.treatmentId) }
  });
  if (existingInvoice) {
    return res.status(400).json({ message: `Invoice already exists for the provided treatments for the patient: ${patientId}` });
  }
  const newInvoice = new Invoice({
    patientId: patientId,
    treatments: treatmentDetails,
    totalAmount: totalAmount,
    paymentStatus: 'Pending'
  });
  await newInvoice.save();
  res.status(201).json({
    message: 'Invoice created successfully',
    invoiceId: newInvoice._id,
    treatments: treatmentDetails
  });
});
module.exports = router;
