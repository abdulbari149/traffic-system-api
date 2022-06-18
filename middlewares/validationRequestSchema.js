const { validationResult } = require("express-validator")

exports.validationRequestSchema = (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const response = {
      data: errors.array(),
      message: "Validation Error",
      status: 404,
    };
    return res.status(response.status).json(response)
  }
  next()
}