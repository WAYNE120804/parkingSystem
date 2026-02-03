const express = require("express");
const multer = require("multer");
const path = require("path");
const settingsController = require("../Controllers/settingsController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, settingsController.buildUploadPath());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `logo${ext}`);
  }
});

const upload = multer({ storage });

router.get("/logo", settingsController.getLogo);
router.post(
  "/logo",
  settingsController.adminGuard,
  upload.single("logo"),
  settingsController.uploadLogo
);

module.exports = router;
