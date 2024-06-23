const cron = require('node-cron');
const SbomModel = require('../sbom/models/Sbom.model');
const { getLatestPackageManagerController } = require('../javascript/controller');

const updatePackageMangers=cron.schedule('* * * * *', async () => {

  try {

    const sboms = await SbomModel.find().populate('user').populate("sbom");
    sboms.forEach(async (sbomModelJson) => {
      let sbomId = sbomModelJson.sbom._id;  
      let userId = sbomModelJson.user._id;

      console.log("Schedulerd")
      await getLatestPackageManagerController(sbomId,userId);

    });

  } catch (error) {
    console.log(error);
  }

});

module.exports={updatePackageMangers}