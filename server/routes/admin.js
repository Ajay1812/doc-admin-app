const {Admin,Patient,Appointment,Treatment,Invoice} = require("../db/db.js");
const { SECRET } = require("../middlewares/auth.js");
const { authenticateJwt } = require("../middlewares/auth.js");
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();

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
    res.json({ message: "Admin created successfully", token });
  }
});


module.exports = router;
