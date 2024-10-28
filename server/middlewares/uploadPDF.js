const multer = require('multer');
const path = require('path');
const fs = require('fs');

const invoicesDir = path.join(__dirname, '../assets/invoices');

if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, invoicesDir); 
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname; // Use timestamp to avoid conflicts
        cb(null, uniqueName);
    }
});

const uploadPDF = multer({ storage });
module.exports = uploadPDF;
