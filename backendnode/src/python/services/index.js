require("dotenv").config();
const FormData = require("form-data");
const config = require("config");
const axios = require("axios");
const fs = require("fs");
const { execSync } = require("child_process");
const SbomJsonModel = require("../../sbom/models/SbomJson.model");
const SbomModel = require("../../sbom/models/Sbom.model");
const AppError = require("../../utils/appError");
const path = require("path");

const processSbom = async (requirementFile, userId) => {
  try {
    const fileBuffer = fs.readFileSync(requirementFile.path);

    const form = new FormData();
    form.append("requirements_file", fileBuffer, requirementFile.originalname);
    const boundary = form.getBoundary();
    const axiosConfig = {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
    };

    const axiosInst = axios.create(axiosConfig);

    const { status, data } = await axiosInst.post(
      `${config.get("parserServer")}/python/pip-parser`,
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
      name: requirementFile.filename,
      format: "custom",
      language: "python",
      sbom: sbom._id,
      user: userId,
    };

    const finalSbom = await storeGeneratedSbomWithRefUser(payload);
    // Delete file after parsing
    // fs.unlinkSync(packageFile.path);
    // fs.unlinkSync(reportFilePath);
    return finalSbom;
  } catch (error) {
    throw error;
  } finally {
    fs.unlinkSync(requirementFile.path);
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

module.exports = { processSbom };
