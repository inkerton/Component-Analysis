const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: String,
  olderVersion: String, 
  purl: String,
  newerVersion: String
});


const myModelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
  sbom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sbom"
  },
  data: [dataSchema]
},{
    timestamps:true
});

const UpdateVulneradbilityModel = mongoose.model("UpdateVulnerabilityModel", myModelSchema);

async function deleteAllDocuments() {

    try {
      // Delete all documents
      await UpdateVulneradbilityModel.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  
  }
  
  deleteAllDocuments();

module.exports = {
  UpdateVulneradbilityModel
}