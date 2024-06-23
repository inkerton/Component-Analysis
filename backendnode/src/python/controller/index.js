const AppError = require("../../utils/appError");
const { sendResponse } = require("../../utils/sendResponse");
const { processSbom } = require("../services");

const createSbomController = async (req, res, next) => {
  try {
    const userId = res.locals.user.sub;
    // const packageFile = req.file;
    const requirement_file = req.files.requirement[0];
    if (!requirement_file) throw new AppError("No requirement file provided");
    const sbom = await processSbom(requirement_file, userId);
    sendResponse(res, sbom, "sbom generated successfully");
  } catch (error) {
    console.log(error);
    next(new AppError(error.message));
  }
};

module.exports = { createSbomController };
