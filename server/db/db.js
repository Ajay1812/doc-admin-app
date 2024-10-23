const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyToken:{type: String},
  createdAt: { type: Date, default: Date.now },
});

adminSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(this.password, salt)
    this.password = hashedPass
    next()
  } catch (error) {
    next(error)
  }
})

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  age: { type: Number},
  phone: { type: String, required: true },
  address: { type: String },
  medicalHistory: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  appointmentDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  createdAt: { type: Date, default: Date.now },
});

const treatmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  treatmentDetails: {
    procedure: { type: String, required: true },
    cost: { type: Number, required: true },
    date: { type: Date, required: true },
    xrayImagePath: { type: String },
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const invoiceSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  treatments: [
    {
      treatmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Treatment",
        required: true,
      },
      cost: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
  issuedAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);
const Patient = mongoose.model("Patient", patientSchema);
const Appointment = mongoose.model("Appointment", appointmentSchema);
const Treatment = mongoose.model("Treatment", treatmentSchema);
const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = {
  Admin,
  Patient,
  Appointment,
  Treatment,
  Invoice,
};
