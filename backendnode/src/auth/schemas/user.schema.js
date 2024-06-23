const { object, string } = require("zod");

module.exports.registerSchema = object({
  body: object({
    username: string({ required_error: "Username is required" }),
    email: string({ required_error: "Email is required" }).email({
      message: "Invalid email",
    }),
    password: string({ required_error: "Password is required" }).min(8, {
      message: "Password must be at least 8 characters long",
    }),
  }),
});

module.exports.LoginSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email({
      message: "Invalid email",
    }),
    password: string({ required_error: "Password is required" }).min(8, {
      message: "Password must be at least 8 characters long",
    }),
  }),
});
