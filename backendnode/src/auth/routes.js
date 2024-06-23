const express = require("express");
const {
  LoginController,
  GetAllUsersController,
  userRegistrationController,
  revalidateController,
  resetPasswordController,
} = require("./controller/index");
const storage = require("../utils/FileStorage.config");
const { deserializeUser } = require("./middleware/deserializeUser");
const { requireUser } = require("./middleware/requireUser");
const { LoginSchema, registerSchema } = require("./schemas/user.schema");
const { validate } = require("./middleware/validate");
const { checkAdmin } = require("./middleware/ValidateRoles");

const router = express.Router();

router.post("/register", validate(registerSchema), userRegistrationController);

router.post("/login", validate(LoginSchema), LoginController);

// This is deserialze middleware it checks for user have valid session and have appropriate tokens.
router.use(deserializeUser, requireUser);

router.get("/users", GetAllUsersController);

router.get("/revalidate", revalidateController);

router.post("/reset-password", resetPasswordController);

module.exports = router;
