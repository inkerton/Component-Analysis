const express = require("express");

const controller = require("./controller/index");

const router = express.Router();

// /status
router.get("/", controller.getStatus);

module.exports = router;
