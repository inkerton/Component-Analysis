const express = require("express");
const multer = require("multer");
const { deserializeUser } = require("../auth/middleware/deserializeUser");
const { requireUser } = require("../auth/middleware/requireUser");
const { createSbomController } = require("./controller");
const storage = require("../utils/FileStorage.config");
const AppError = require("../utils/appError");

const router = express.Router();

// Multer config
const upload = multer(storage.pythonConfig);

router.use(deserializeUser, requireUser);
router.post(
  "/generateSbom",
  upload.fields([{ name: "requirement", maxCount: 1 }]),
  (req, res, next) => {
    if (!req.files || !req.files instanceof Object) {
      return next(new AppError("No Requirement file uploaded", 400));
    }

    const { requirement } = req.files;

    if (!requirement?.[0]) {
      return next(new AppError("No Requirement file uploaded", 400));
    }

    next();
  },
  createSbomController
);

module.exports = router;
