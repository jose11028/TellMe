const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const UserCtrl = require('../controllers/user');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create the uploads folder if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set unique filename
  },
});

const upload = multer({ storage });

// POST route for image upload
router.post('/', upload.single('image'), UserCtrl.authMiddleware, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Log received file details
  console.log('Received file:', req.file);

  const imageUrl = `/uploads/${req.file.filename}`; // Return the URL of the uploaded image
  res.json({ imageUrl });
});

module.exports = router;
