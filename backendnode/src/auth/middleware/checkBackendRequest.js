const AppError = require("../../utils/appError");

module.exports.checkBackendRequest = (req, res, next) => {
  try {
    const { auth_type: authType, auth_code: authCode } = req.headers;

    if (authType !== "backend" || authCode !== "cookie101") {
      return next(new AppError("Invalid authentication", 401));
    }

    next();
  } catch (error) {
    next(error);
  }
};
