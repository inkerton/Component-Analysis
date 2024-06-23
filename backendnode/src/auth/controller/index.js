// const { uploadImageToAWS } = require("../../aws/services");
const AppError = require("../../utils/appError");
const { excludedFields } = require("../../utils/excludedFields");
const { removeNullOrUndefinedFields } = require("../../utils/misc");
const { sendResponse } = require("../../utils/sendResponse");
const {
  registerAdmin,
  signToken,
  registerVendor,
  registerCustomer,
  findUser,
  getUsers,
  registerUser,
  getRevalidateUserPayload,
  resetPassword,
} = require("../services");
const _ = require("lodash");

const GetAllUsersController = async (req, res, next) => {
  try {
    const users = await getUsers();
    sendResponse(res, users, "All users fetched successfully");
  } catch (error) {
    next(error);
  }
};

const userRegistrationController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const payload = {
      username,
      email,
      password,
    };
    console.log("Payload:",payload);

    const cleanPayload = removeNullOrUndefinedFields(payload);

    const user = await registerUser(cleanPayload);
    await user.save();
    const omittedResponse = _.omit(user.toObject(), excludedFields);
    sendResponse(res, omittedResponse, "User Registered successfully");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: "fail",
        message: "Email already exist",
      });
    }
    next(err);
  }
};

const LoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUser({ email });
    if (!user || !(await user.comparePasswords(user.password, password)))
      return next(new AppError("Invalid Email or password", 401));
    const { access_token } = await signToken(user);

    sendResponse(res, {
      status: "success",
      access_token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const revalidateController = async (req, res, next) => {
  try {
    const userId = res.locals.user.sub;
    const revalidatePayload = await getRevalidateUserPayload(userId);
    sendResponse(res, revalidatePayload, "User revalidated");
  } catch (error) {
    console.log(error);
    next(new AppError(error.message));
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    const userId = res.locals.user.sub;
    const { oldPass, newPass } = req.body;
    const passwdReset = await resetPassword(oldPass, newPass, userId);
    sendResponse(res, passwdReset, "Password Resetted successfully");
  } catch (error) {
    console.log(error);
    next(new AppError(error.message));
  }
};

module.exports = {
  LoginController,
  userRegistrationController,
  GetAllUsersController,
  revalidateController,
  resetPasswordController,
};
