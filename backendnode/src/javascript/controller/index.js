const SbomModel = require("../../sbom/models/Sbom.model");
const AppError = require("../../utils/appError");
const { sendResponse } = require("../../utils/sendResponse");
const { processSbom, generateAudit, getLatestPackageManager } = require("../services");

const createSbomController = async (req, res, next) => {
  try {
    const userId = res.locals.user.sub;
    // const packageFile = req.file;
    const package_json_file = req.files.package_json_file[0];
    const package_lock_file = req.files.package_lock_file[0];
    if (!package_json_file) throw new AppError("No package json file provided");
    if (!package_lock_file) throw new AppError("No package lock file provided");
    // const sbom = await processSbom(packageFile, userId);
    const sbom = await processSbom(
      package_lock_file,
      package_json_file,
      userId
    );
    sendResponse(res, sbom, "sbom generated successfully");
  } catch (error) {
    console.log(error);
    next(new AppError(error.message));
  }
};

const getLatestPackageManagerController=async (sbomId,userId)=>{
  try{
if(!sbomId || !userId){
  throw new AppError("Cron job failed")
}
  
    const sbomJson=await SbomModel.find({sbom:sbomId.toString(),user:userId.toString()}).populate("sbom");
    if(sbomJson?.[0]?.language==="javascript"){
      if(!sbomJson[0]?.sbom?.json){
        return
      }
      const parsedJson=JSON.parse(sbomJson[0]?.sbom?.json);
     await getLatestPackageManager(parsedJson,userId,sbomId);
    }
  }catch(error){
    throw new AppError(error.message)
  }
}

const createAuditReportController = async (req, res, next) => {
  try {
    const package_json_file = req.files.package_json_file[0];
    const package_lock_file = req.files.package_lock_file[0];
    if (!package_json_file) throw new AppError("No package json file provided");
    if (!package_lock_file) throw new AppError("No package lock file provided");

    const auditReport = await generateAudit(
      package_lock_file,
      package_json_file
    );
    sendResponse(res, auditReport, "Audit report generated");
  } catch (error) {
    next(new AppError(error.message));
  }
};

module.exports = { createSbomController, createAuditReportController ,getLatestPackageManagerController};
