exports.conditionalAccess =
  (wardenMiddleware, citizenMiddleWare) => (req, res, next) => {
    const user = req.query.user;
    if (user === "warden") {
      wardenMiddleware(req, res, next);
    } else if (user === "citizen") {
      citizenMiddleWare(req, res, next);
    }
  };

const path = require("path");
exports.accessDB = async (req, res, next) => {
  const { user } = req.params;
  const modelPath = path.resolve(
    __dirname,
    `../models/${user.charAt(0).toUpperCase()}${user.slice(1)}Model.js`
  );
  try {
    if (user != "warden" && user !="citizen" && user !== "admin") {
      throw new Error("Please provide a valid query parameter for user");
    }
    res.locals.DbModel = require(modelPath);
    next();
  } catch (error) {
    return res.status(400).json({
      message: error,
      error,
    }).end();
  }
};
