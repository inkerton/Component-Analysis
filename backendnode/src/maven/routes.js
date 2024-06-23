const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { deserializeUser } = require("../auth/middleware/deserializeUser");
const { requireUser } = require("../auth/middleware/requireUser");
const storage = require("../utils/FileStorage.config");
const AppError = require("../utils/appError");
const {
  genTempDir,
} = require("../utils/misc");
const { execSync } = require("child_process");
const { createSbomController } = require("./controller");

const router = express.Router();

// Multer config
const upload = multer(storage.mavenConfig);




router.use(deserializeUser, requireUser);
router.post(
  "/generateSbom",
  genTempDir,
  upload.fields([
    { name: "pom_file", maxCount: 1 },
  ]),
  (req, res, next) => {
    if (!req.files || !req.files instanceof Object) {
      return next(new AppError("No Package files uploaded", 400));
    }

    const { pom_file } = req.files;

    if (!pom_file?.[0]) {
      return next(
        new AppError("Missing pom file", 400)
      );
    }

    next();
  },
  createSbomController
);




module.exports = router;
