const sendResponse = (res, data, message, success = true, statusCode = 200) => {
  const response = {
    success: success,
    message: message,
    data: data,
  };
  res.status(statusCode).json(response);
};

module.exports = { sendResponse };
