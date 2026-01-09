const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/photos/';
    ensureDirectoryExistence(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;

