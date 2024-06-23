const { sendResponse } = require("../../utils/sendResponse");

module.exports.getStatus = async (req, res) => {
  sendResponse(res, { healthy: true, message: "Server is up and running" });
};
