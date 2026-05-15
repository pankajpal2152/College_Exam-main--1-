const multer = require("multer");
const path = require("path");

// Define where to store images and what to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    // Adds a timestamp to avoid duplicate filenames
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Security: Check if the file is actually an image
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Only Images (JPG, PNG, WEBP) are allowed!"));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Limit: 2MB per photo
});

module.exports = upload;