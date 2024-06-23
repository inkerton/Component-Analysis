const { User } = require("../../auth/Models/User.model");
const AppError = require("../../utils/appError");
const { sendResponse } = require("../../utils/sendResponse");
const SbomModel = require("../models/Sbom.model");
const SbomJsonModel = require("../models/SbomJson.model");
const { UpdateVulneradbilityModel } = require("../models/UpdatedVulnerabilitesModel");
const {
  processSbom,
  extractPackageManagers,
  getSboms,
  getSbomById,
  generateSbomFromZip,
  deleteSbom,
  generateReport,
} = require("../services");

const VALID_FORMATS = [
  "syft-json",
  "cyclonedx-json",
  "spdx-json",
  "spdx-json@2.2",
  "github-json",
];

const createSbomController = async (req, res, next) => {
  try {
    const zipFile = req.file;
    // Get format from query
    const format = req.query.format;

    if (!VALID_FORMATS.includes(format)) {
      return next(new AppError("Invalid format"));
    }

    const sbom = await processSbom(zipFile, format);

    sendResponse(res, sbom, "SBOM generated successfully");

    // res.json(sbom);
  } catch (error) {
    console.log(error);
    next(error.message);
  }
};

const extractPackageManagersController = async (req, res, next) => {
  try {
    const zipFile = req.file;
    const format = req.query.format;

    if (!VALID_FORMATS.includes(format)) {
      return next(new AppError("Invalid format"));
    }

    const sbom = await extractPackageManagers(zipFile, format);

    sendResponse(res, sbom, "SBOM generated successfully");

    // res.json(sbom);
  } catch (error) {
    console.log(error);
    next(error.message);
  }
};

const getSbomsController = async (req, res, next) => {
  try {
    const userId = res.locals.user.sub;
    const sboms = await getSboms(userId);
    sendResponse(res, sboms, "All sboms fetched");
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getSbomByIdController = async (req, res, next) => {
  try {
    const sbomId = req.params.id;
    const sbomExist = SbomModel.findById(sbomId).lean();
    if (sbomExist?._id) {
      throw new AppError("No sbom exist with that id");
    }
    const sbom = await getSbomById(sbomId);
    sendResponse(res, sbom, "Sbom fetched successfully");
  } catch (error) {}
};

const generateSbomFromZipController = async (req, res, next) => {
  try {
    const userId = res.locals.user.sub;
    const zipFile = req.file;
    if (!zipFile) {
      throw new AppError("No zip file provided");
    }
    const sbom = await generateSbomFromZip(zipFile, userId);
    sendResponse(res, sbom, "sbom generated successfully");
  } catch (error) {
    console.log(error);
    next(new AppError(error.message));
  }
};

const deleteSbomByIdController = async (req, res, next) => {
  try {
    const userId = res.locals.user.sub;
    const sbomId = req.params.id;

    const sbom = await SbomModel.findById(sbomId).lean();

    if (!sbom) {
      throw new AppError("No sbom exists with that id");
    }

    if (sbom.user.toString() !== userId) {
      throw new AppError("No sbom exists with that id");
    }

    await deleteSbom(sbomId);

    sendResponse(res, sbom, "Sbom Deleted successfully");
  } catch (error) {
    console.log(error);
    next(new AppError(error.message));
  }
};


const generateReportController=async (req,res,next)=>{
  try{
    const sbomData=req.file;
    if(!sbomData){
      next(new AppError("No sbom data file is provided"))
    }
    const pdfReport=await generateReport(sbomData);
    sendResponse(res,pdfReport,"Pdf report generated.")
  }catch(error){
  next(new AppError(error.message))}
}



const getUpdatedNotificationsController=async (req,res,next)=>{
  try{
    const {userId,sbomId}=req.params;
    const user=await User.findById(userId).lean()
    const sbom=await SbomJsonModel.findById(sbomId).lean()
    if(!user || !sbom){
      throw new AppError("No updation exist for given sbomId and userId");
    }
    const updatedNotifications=await UpdateVulneradbilityModel.find({user:userId,sbom:sbomId}).sort({createdAt: 1})
    sendResponse(res,updatedNotifications,"Fetched all updated notifications successfully");
  }catch(error){
    next(new AppError(error.message))
  }
}

module.exports = {
  createSbomController,
  extractPackageManagersController,
  getSbomsController,
  getSbomByIdController,
  generateSbomFromZipController,
  deleteSbomByIdController,
  generateReportController,
  getUpdatedNotificationsController
};
