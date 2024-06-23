const AppError = require("../../utils/appError");

module.exports.checkAdmin = (req, res, next) => {
  try {
    const user = res.locals.user;
    if (user && user.role === "superAdmin") {
      next();
    } else {
      throw new AppError("Access forbidden. Admins only.", 403);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.checkCustomer = (req, res, next) => {
  try {
    const user = res.locals.user;
    if (user && user.role === "customer") {
      next();
    } else {
      throw new AppError("Access forbidden. Customers only.", 403);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.checkVendor = (req, res, next) => {
  try {
    const user = res.locals.user;
    if (user && user.role === "vendor") {
      next();
    } else {
      throw new AppError("Access forbidden. Vendors only.", 403);
    }
  } catch (err) {
    next(err);
  }
};
