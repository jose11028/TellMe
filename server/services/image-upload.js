const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config');

// Initialize S3 client
const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer to use S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
      bucket: 'tmer-ng-dev',
    metadata: function (req, file, cb) {
            cb(null, { fieldName: 'TESTING_METADATA' });
  /*   metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname }); */
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG and PNG allowed!'), false);
    }
  },
});

/* const upload = multer({
    
    storage: multerS3({
      acl:'public-read',
    s3: s3,
    bucket: 'tmer-ng-dev',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG and PNG allowed!'), false);
    }
  },
}); */

module.exports = upload;






/* const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config');


aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    region: 'us-east-2'
});

//const { S3Client } = require('@aws-sdk/client-s3');


const s3 = new aws.S3();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
}

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'tmer-ng-dev',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'TESTING_METADATA' });
        },
        //here this key, is the name amazon will save for the file in the bucket
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});

module.exports = upload; */ 