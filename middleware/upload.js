// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload folder ka path ensure kar le
const uploadPath = path.join(__dirname, "../uploads");

// agar folder nahi hai to create kar de
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// file filter
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, or PDF allowed!"), false);
  }
}

// export upload
const upload = multer({ storage, fileFilter });
module.exports = upload;
