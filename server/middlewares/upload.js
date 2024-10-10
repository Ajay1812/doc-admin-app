// server/middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const xraysDir = path.join(__dirname, '../assets/XRays');

if (!fs.existsSync(xraysDir)) {
    fs.mkdirSync(xraysDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, xraysDir); 
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname; // Use timestamp to avoid conflicts
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });
module.exports = upload;
