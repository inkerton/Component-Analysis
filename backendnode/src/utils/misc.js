const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const removeNullOrUndefinedFields = (obj) => {
  const cleanedObj = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      cleanedObj[key] = obj[key];
    }
  }
  return cleanedObj;
};

const getZipBasename = (zipFile) => {
  const fileName = zipFile.filename;
  return fileName.slice(0, -4);
};

const rmDir = function (dirPath) {
  try {
    var files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = path.join(dirPath, files[i]);
      if (fs.statSync(filePath).isFile()) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.log(error);
        }
      } else rmDir(filePath);
    }
};

const genTempDir = async (req, res, next) => {
  req.dir = `uploads/packageFiles/${Date.now()}-${crypto
    .randomBytes(8)
    .toString("hex")}`;
  next();
};













module.exports = {
  removeNullOrUndefinedFields,
  getZipBasename,
  rmDir,
  genTempDir,
};
