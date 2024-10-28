const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true,lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
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
  firstName: { type: String, required: true, lowercase: true, trim: true },
  lastName: { type: String, required: true, lowercase: true, trim: true },
  dateOfBirth: { type: Date },
  age: { type: Number, trim: true },
  phone: { type: String, required: true, trim: true  },
  address: { type: String, lowercase: true, trim: true },
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
  reason: { type: String, required: true, lowercase: true, trim: true },
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
    procedure: { type: String, required: true, lowercase: true, trim: true },
    cost: { type: Number, required: true, trim: true },
    date: { type: Date, required: true },
    xrayImagePath: { type: String },
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  billFrom: { type: String, required: true },
  billTo: { type: String, required: true },
  dateOfIssue: { type: Date, required: true },
  notes: { type: String },
  items: [
    {
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
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
