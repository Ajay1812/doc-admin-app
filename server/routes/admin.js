const { Admin, Patient, Appointment, Treatment, Invoice } = require("../db/db.js");
// const { signupSchema, loginSchema } = require('../middlewares/validationSchemas.js');
const { SECRET, authenticateJwt } = require("../middlewares/auth.js");
const multer = require("multer");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../middlewares/upload.js");
const uploadPDF = require('../middlewares/uploadPDF.js')
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

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
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin created successfully", token: token });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Email not found Please Signup." });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ email, role: "admin" }, SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Logged in successfully", token: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(403).json({ message: "Login error", error });
  }
})

// Send Email for reset password
router.post("/sendpasswordlink", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({ message: "Enter your Email." });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const token = jwt.sign({ _id: admin._id }, SECRET, {
      expiresIn: "120s",
    });

    const setAdminToken = await Admin.findByIdAndUpdate(
      { _id: admin._id },
      { verifyToken: token },
      { new: true }
    );

    if (setAdminToken) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      // console.log("Frontend URL:", frontendUrl);
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px; text-align: center; color: #333;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <div style="padding: 20px; background-color: #007bff; color: #ffffff;">
                        <p style="font-size: 1.5em; margin: 0;">Hi there,</p>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 1.1em; color: #333;">
                            Thanks for requesting a password reset. To create a new password, just click the button below.
                        </p>
                        <a 
                            href="${frontendUrl}/forgotpassword/${admin.id}/${setAdminToken.verifyToken}" 
                            style="display: inline-block; padding: 12px 25px; margin-top: 20px; color: #ffffff; background-color: #28a745; border-radius: 5px; text-decoration: none; font-size: 1em; font-weight: bold;"
                        >
                            Reset Password
                        </a>
                        <p style="margin-top: 20px; font-size: 1em; color: #555;">
                            If you didn’t make this request, you can ignore this email and continue as usual. If you need more help, feel free to contact our support team.
                        </p>
                        <p style="margin-top: 20px; font-size: 0.9em; color: #888;">
                            <a href="https://www.dantveda.com/support" style="color: #007bff; text-decoration: none;">Account Security FAQs</a> | 
                            <a href="mailto:a.kumar01c@gmail.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
                        </p>
                    </div>
                    <div style="padding: 20px; background-color: #f9f9f9; color: #555; font-size: 0.9em;">
                        <p>Thank you,</p>
                        <p><strong>Wishing you a healthy and happy smile! Dantveda 🦷</strong></p>
                    </div>
                </div>
            </div>
        `,
    };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error:", error);
          return res.status(401).json({ message: "Email not sent" });
        } else {
          // console.log("Email sent:", info.response);
          return res
            .status(201)
            .json({ status: 201, message: "Email sent successfully" });
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(401).json({ message: "Invalid Admin" });
  }
});

// verify admin for forgot password
router.get("/forgotpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  try {
    const validAdmin = await Admin.findOne({ _id: id });
    const verifyToken = jwt.verify(token,SECRET ) 
    // console.log(verifyToken)
    if (validAdmin && verifyToken._id){
      res.status(201).json({status:201, validAdmin})
    }else{
      res.status(401).json({status:401, message: "Admin not exist"})
    }
  } catch (error) {
    res.status(401).json({status:401, message: error})
  }
});
// Change password
router.post('/:id/:token', async (req,res)=>{
  const {id, token} = req.params
  const {password} = req.body
  try {
    const validAdmin = await Admin.findOne({ _id: id });
    const verifyToken = jwt.verify(token,SECRET ) 
    // console.log(verifyToken)
    if (validAdmin && verifyToken._id){
      const newPassword = await bcrypt.hash(password, 10)
      const setNewAdminPass = await Admin.findByIdAndUpdate({_id: id}, {password: newPassword})
      setNewAdminPass.save()
      res.status(201).json({status:201, setNewAdminPass})
    }else{
      res.status(401).json({status:401, message: "Admin not exist"})
    }
  } catch (error) {
    res.status(404).json({status:404, message: error})
  }
}) 

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

router.get("/appointments", authenticateJwt, async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
});

router.post("/add-appointments", authenticateJwt, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
    });
    // console.log(patient)
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

// Delete a patient
router.delete('/delete-appointment/:id', authenticateJwt, async (req, res) => {
  const { id } = req.params;  
  try {
    const deleteAppointment = await Appointment.findByIdAndDelete(id);
    if (!deleteAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error });
  }
});

// In your routes file
router.get('/treatments', async (req, res) => {
    try {
        const treatments = await Treatment.find()
            .populate('patientId', 'firstName lastName')
            .exec();
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Treatment - patients/id/treatment
router.post("/patients/:patientId/treatments",upload.single("xrayImage"),async (req, res) => {
    try {
      const patientId = req.params.patientId;
      const { procedure, cost, date, notes } = req.body;
      const xrayImagePath = req.file
        ? `/assets/XRays/${req.file.filename}`
        : null; 
      const newTreatment = new Treatment({
        patientId: patientId,
        treatmentDetails: {
          procedure: procedure,
          cost: cost,
          date: date,
          xrayImagePath: xrayImagePath, 
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

// Invoices
router.get("/invoices", authenticateJwt, async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    res.status(200).json({ invoices });
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
});

// Create a new invoice
router.post('/invoices',  async (req, res) => {
  try {
    // console.log(req.body)
      const invoice = new Invoice(req.body);
      await invoice.save();
      res.status(201).json(invoice);
  } catch (error) {
      console.error('Error saving invoice:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
  }
});

module.exports = router;
