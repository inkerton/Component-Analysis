const status = require("../src/health/routes");
const authRoute = require("../src/auth/routes");
const sbomRoute = require("../src/sbom/routes");
const javascriptRoute = require("../src/javascript/routes");
const pythonRoute = require("../src/python/routes");
const mavenRoute=require("../src/maven/routes")

module.exports = (app) => {
  app.use("/api/status", status);
  app.use("/api/auth/", authRoute);
  app.use("/api/sbom", sbomRoute);
  app.use("/api/javascript", javascriptRoute);
  app.use("/api/python", pythonRoute);
  app.use("/api/maven",mavenRoute)

  // unknown routes
  app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
  });

  // Global error handler middleware
  // Global Error Handler
  app.use((err, req, res, next) => {
    console.log(err);
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });
};
