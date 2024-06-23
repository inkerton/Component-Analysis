const unzipper = require("unzipper");
const FormData = require("form-data");
const config = require("config");
const axios = require("axios");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { getZipBasename } = require("../../utils/misc");
const SbomModel = require("../models/Sbom.model");
const SbomJsonModel = require("../models/SbomJson.model");

const processSbom = async (zipFile, format) => {
  // Extract zip contents
  const tmpDir = path.join(__dirname);

  console.log(zipFile);
  const zipFilePath = zipFile.path;
  const fileName = getZipBasename(zipFile);

  const data = fs
    .createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: tmpDir }));

  await new Promise((resolve, reject) => {
    data.on("finish", resolve);
    data.on("error", reject);
  });

  // Specify services output dir
  const inputDir = path.join(tmpDir, fileName);
  const outputDir = path.join(__dirname, "GeneratedSbom");
  const outputFilename = `${fileName}.sbom.json`;
  const outputPath = path.join(outputDir, outputFilename);
  // Run syft
  try {
    const output = execFileSync("syft", [
      inputDir,
      "-o",
      `${format}=${outputPath}`,
    ]);

    // Check output
    if (output.stderr) {
      throw new Error("Syft stderr");
    }
  } catch (err) {
    throw new Error("Syft failed");
  }

  // Read output file
  const outputFile = path.join(outputDir, outputFilename);
  const sbom = JSON.parse(fs.readFileSync(outputFile));
  // Delete SBOM file
  fs.unlinkSync(path.join(outputDir, outputFilename));

  // Delete zip file
  fs.unlinkSync(zipFilePath);
  // Delete extracted files
  fs.rmSync(inputDir, { recursive: true, force: true });

  return sbom;
};

function getOutputPath(fileActualName) {
  const fileExtension = fileActualName.split(".").pop().toLowerCase();

  let outputDir = undefined;

  switch (fileExtension) {
    case "json":
      if (["package.json", "package-lock.json"].includes(fileActualName)) {
        outputDir = path.join(__dirname, "packageMangers", "javascript", "npm");
      }
      break;
    case "lock":
      if (fileActualName === "yarn.lock") {
        outputDir = path.join(
          __dirname,
          "packageMangerspackageMangers",
          "javascript",
          "yarn"
        );
      }
      break;
    case "py":
    case "txt":
      if (fileActualName === "requirements.txt" || fileExtension === "py") {
        outputDir = path.join(__dirname, "packageMangers", "python");
      }
      break;
  }

  return outputDir;
}

function getFileName(path) {
  const lastIndex = path.lastIndexOf("/");
  if (lastIndex === -1) {
    return path;
  }
  return path.substring(lastIndex + 1);
}

const extractPackageManagers = async (zipFile, format) => {
  const generalPackageMangers = ["package.json", "package-lock.json"];
  const zipFilePath = zipFile.path;
  const fileName = getZipBasename(zipFile);
  new Promise((res, rej) => {
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Parse())
      .on("entry", function (entry) {
        const filePath = entry.path;
        const type = entry.type;
        const fileActualName = getFileName(filePath);
        // 'Directory' or 'File'
        if (type === "File" && generalPackageMangers.includes(fileActualName)) {
          const outputPath = path.join(
            getOutputPath(fileActualName),
            fileActualName
          );
          if (outputPath) {
            entry.pipe(fs.createWriteStream(outputPath));
          }
        } else {
          entry.autodrain();
        }
      })
      .on("close", res)
      .on("error", rej);
  })
    .then(() => {
      fs.unlink(zipFilePath, (err) => {
        if (err) console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("Hello world");

  return "extracted package managers";
};

const getSboms = async (userId) => {
  const sboms = await SbomModel.find({ user: userId })
    .populate("user")
    .populate("sbom")
    .exec();

  return sboms;
};

const getSbomById = async (sbomId) => {
  const sbom = await SbomModel.findOne({ _id: sbomId })
    .populate("user")
    .populate("sbom")
    .exec();
  return sbom;
};

const generateSbomFromZip = async (zipFile, userId) => {
  try {
    const fileBuffer = fs.readFileSync(zipFile.path);
    const form = new FormData();
    form.append("file", fileBuffer, zipFile.originalname);
    const boundary = form.getBoundary();
    const axiosConfig = {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
    };

    const axiosInst = axios.create(axiosConfig);
    const { status, data } = await axiosInst.post(
      `${config.get("parserServer")}/parse_zip`,
      // "https://fe9a-49-36-184-211.ngrok.io/parse_zip",
      form
    );
    if ((status + "")[0] === "4") {
      throw new AppError("Something wrong in generating the sbom");
    }

    const stringifiedSbom = data;
    const sbomJson = await storeSbom({
      json: stringifiedSbom,
    });

    sbomJson.save();
    const sbom = sbomJson.toObject();
    const payload = {
      name: zipFile.filename,
      format: "custom",
      language: "Multiple",
      sbom: sbom._id,
      user: userId,
    };

    const finalSbom = await storeGeneratedSbomWithRefUser(payload);
    return finalSbom;
  } catch (error) {
    throw error;
  } finally {
    fs.unlinkSync(zipFile.path);
  }
};

const storeSbom = async (sbomJson) => {
  const storedSbom = await SbomJsonModel.create(sbomJson);
  return storedSbom;
};

const storeGeneratedSbomWithRefUser = async (payload) => {
  const sbomGenerated = await SbomModel.create(payload);
  sbomGenerated.save();
  return sbomGenerated.toObject();
};

const deleteSbom = async (sbomId) => {
  const sbom = await SbomModel.findByIdAndDelete(sbomId).lean();
  const sbomJsonId = sbom.sbom;
  await SbomJsonModel.findByIdAndDelete(sbomJsonId);
  return sbom;
};


const generateReport=async (sbomJsonDataFile)=>{
  const sbomJsonData = fs.readFileSync(sbomJsonDataFile.path);
  const form = new FormData();
  form.append("file", sbomJsonData, sbomJsonDataFile.originalname);
  const boundary = form.getBoundary();
  const axiosConfig = {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
  };
  const axiosInst = axios.create(axiosConfig);
  const { status, data } = await axiosInst.post(
    // `${config.get("parserServer")}/get_pdf`,
    "https://3300-202-12-103-120.ngrok.io/get_pdf",
    form
  );
  if ((status + "")[0] === "4") {
    throw new AppError("Something wrong in generating the sbom report");
  }

  const reportFile = data;
  return reportFile

}

module.exports = {
  processSbom,
  extractPackageManagers,
  getSboms,
  getSbomById,
  generateSbomFromZip,
  deleteSbom,
  generateReport
};
