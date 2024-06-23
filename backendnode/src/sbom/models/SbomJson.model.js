const mongoose = require("mongoose");

const sbomJson = new mongoose.Schema({
  json: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SbomJson", sbomJson);
