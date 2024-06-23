const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { deserializeUser } = require("../auth/middleware/deserializeUser");
const { requireUser } = require("../auth/middleware/requireUser");
const {
  createSbomController,
  createAuditReportController,
  getLatestPackageManagerController,
} = require("./controller");
const storage = require("../utils/FileStorage.config");
const AppError = require("../utils/appError");
const {
  deleteFolderRecursive,
  deleteAllFilesInDir,
  rmDir,
  genTempDir,
} = require("../utils/misc");
const { execSync } = require("child_process");
const {
  checkBackendRequest,
} = require("../auth/middleware/checkBackendRequest");

const router = express.Router();

// Multer config
const upload = multer(storage.javascriptConfig);

router.post(
  "/auditJsPackage",
  checkBackendRequest,
  genTempDir,
  upload.fields([
    { name: "package_lock_file", maxCount: 1 },
    { name: "package_json_file", maxCount: 1 },
  ]),
  (req, res, next) => {
    if (!req.files || !req.files instanceof Object) {
      return next(new AppError("No Package files uploaded", 400));
    }

    const { package_lock_file, package_json_file } = req.files;

    if (!package_lock_file?.[0] || !package_json_file?.[0]) {
      const dirPath = path.dirname(
        package_lock_file[0]?.path || package_json_file[0]?.path
      );
      if (dirPath) {
        req.files = null;
        execSync(`rm -rf ${dirPath}`);
      }

      return next(
        new AppError("Missing either package-lock.json or package.json", 400)
      );
    }

    next();
  },
  createAuditReportController
);


// router.get("/getLatestPackageVersion",getLatestPackageManagerController)

router.use(deserializeUser, requireUser);
router.post(
  "/generateSbom",
  genTempDir,
  upload.fields([
    { name: "package_lock_file", maxCount: 1 },
    { name: "package_json_file", maxCount: 1 },
  ]),
  (req, res, next) => {
    if (!req.files || !req.files instanceof Object) {
      return next(new AppError("No Package files uploaded", 400));
    }

    const { package_lock_file, package_json_file } = req.files;

    if (!package_lock_file?.[0] || !package_json_file?.[0]) {
      const dirPath = path.dirname(
        package_lock_file[0]?.path || package_json_file[0]?.path
      );
      if (dirPath) {
        req.files = null;
        execSync(`rm -rf ${dirPath}`);
      }

      return next(
        new AppError("Missing either package-lock.json or package.json", 400)
      );
    }

    next();
  },
  createSbomController
);




module.exports = router;
