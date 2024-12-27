const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user');
const upload = require('../services/image-upload');

const singleUpload = upload.single('image');

router.post('/image-upload', UserCtrl.authMiddleware, (req, res) => {
  singleUpload(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(422).json({
        error: 'Image upload failed!',
        details: err.message,
      });
    }

    console.log('Request File:', req.file); // Log for debugging

    return res.json({ imageUrl: req.file.location });
  });
});

module.exports = router;




/* const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user');

const upload = require('../services/image-upload');

const singleUpload = upload.single('image'); 


//this is the route
router.post('/image-upload', UserCtrl.authMiddleware, function (req, res) {
    singleUpload(req, res, function (err) {
        if (err) {
           return res.status(422).json({ error: 'Image upload failed!', details: err.message });  
        }

        return res.json({ 'imageUrl': req.file.location });
    });
});


module.exports = router; */