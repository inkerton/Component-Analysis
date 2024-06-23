const SbomModel = require("../../sbom/models/Sbom.model");
const AppError = require("../../utils/appError");
const { sendResponse } = require("../../utils/sendResponse");
const { processSbom } = require("../services");

const createSbomController = async (req, res, next) => {
  try {
    const userId = res.locals.user.sub;
    // const packageFile = req.file;
    const pom_file = req.files.pom_file[0];
    if (!pom_file) throw new AppError("No pom file provided");
    // const sbom = await processSbom(packageFile, userId);
    const sbom = await processSbom(
      pom_file,
      userId
    );
    sendResponse(res, sbom, "sbom generated successfully");
  } catch (error) {
    console.log(error);
    next(new AppError(error.message));
  }
};



module.exports = { createSbomController };
