const AppError = require("../../utils/appError");
const { verifyJwt } = require("../../utils/jwt");

module.exports.deserializeUser = async (req, res, next) => {
  try {
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new AppError("You are not logged in", 401));
    }

    const decoded = verifyJwt(access_token, "accessTokenPublicKey");

    if (!decoded) {
      return next(new AppError(`Invalid token or user doesn't exist`, 401));
    }

    res.locals.user = decoded;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
