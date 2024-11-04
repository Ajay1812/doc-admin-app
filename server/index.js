const express = require('express')
const mongoose  = require('mongoose')
// const cors = require('cors')
const adminRouter = require('./routes/admin.js')
const app = express()
const path = require('path')
require('dotenv').config()

// app.use(cors())
app.use(express.json())

app.use('/admin', adminRouter) 

app.use(express.static("public"));
app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})


const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;

mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.y0jqm.mongodb.net/doc`)

app.listen(3000, ()=>{ console.log("Server is running on port 3000 ")})
