const mongoose = require("mongoose");

const sbomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ["spdx", "cyclonedx", "custom"],
      required: true,
    },
    language: {
      type: String,
      enum: ["python", "javascript", "java","Multiple","maven"],
      required: true,
    },
    // Storing the sbom and store its link in mongoose
    sbom: {
      type: mongoose.Schema.ObjectId,
      ref: "SbomJson",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sbom", sbomSchema);
