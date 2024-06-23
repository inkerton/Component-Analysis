const express = require("express");
const multer = require("multer");
const { deserializeUser } = require("../auth/middleware/deserializeUser");
const { requireUser } = require("../auth/middleware/requireUser");
const {
  createSbomController,
  extractPackageManagersController,
  getSbomsController,
  getSbomByIdController,
  generateSbomFromZipController,
  deleteSbomByIdController,
  generateReportController,
  getUpdatedNotificationsController,
} = require("./controller");
const storage = require("../utils/FileStorage.config");
const AppError = require("../utils/appError");

const router = express.Router();

router.get("/updatedNotifications/:userId/:sbomId",getUpdatedNotificationsController)

router.use(deserializeUser, requireUser);
// Multer config
const upload = multer(storage.zipConfig);

router.use(deserializeUser, requireUser);

router.post(
  "/generateSBOM-syft",
  upload.single("sourceCode"),
  (req, res, next) => {
    if (!req.file || !(req.file instanceof Object)) {
      return next(new AppError("No Zip file uploaded", 400));
    }
    next();
  },
  createSbomController
);

router.post(
  "/generateSBOM",
  upload.single("sourceCode"),
  (req, res, next) => {
    if (!req.file || !(req.file instanceof Object)) {
      return next(new AppError("No Zip file uploaded", 400));
    }
    next();
  },
  extractPackageManagersController
);

router.get("/getSboms", getSbomsController);

router.get("/getSbom/:id", getSbomByIdController);

router.delete("/deleteSbom/:id", deleteSbomByIdController);

router.post(
  "/generateSbomFromZip",
  upload.single("sourceCode"),
  (req, res, next) => {
    if (!req.file || !(req.file instanceof Object)) {
      return next(new AppError("No Zip file uploaded", 400));
    }
    next();
  },
  generateSbomFromZipController
);

router.post("/generateSbomReport",upload.single("jsonDataFile"),generateReportController)



module.exports = router;
