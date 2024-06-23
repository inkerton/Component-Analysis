const config = require("config");
const { signJwt } = require("../../utils/jwt");
const { User } = require("../Models/User.model");

const registerUser = async (userPayload) => {
  const registeredUser = await User.create(userPayload);
  return registeredUser;
};

// Sign Token
const signToken = async (user) => {
  const access_token = signJwt(
    { sub: user._id, role: user.role },
    "accessTokenPrivateKey",
    {
      expiresIn: `${config.get("accessTokenExpiresIn")}m`,
    }
  );
  return { access_token };
};

const getUsers = async () => {
  const users = await User.find({}).select("-password");
  return users;
};

const findUser = async (query, options = {}) => {
  return await User.findOne(query, {}, options).select("+password");
};

const getRevalidateUserPayload = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  return user;
};

const resetPassword = async (oldPass, newPass, userId) => {
  const user = await User.findById(userId);

  const match = await user.comparePasswords(user.password, oldPass);

  if (!match) {
    throw new Error("Incorrect old password");
  }

  user.password = newPass;

  await user.save();

  return user;
};

module.exports = {
  registerUser,
  findUser,
  signToken,
  getUsers,
  getRevalidateUserPayload,
  resetPassword,
};
