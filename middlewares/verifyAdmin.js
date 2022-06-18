const { Admin } = require("../models");

exports.verifyAdmin = async (req, res, next) => {
  try {
    console.log("admin verification runs", res.locals.data.id);
    const admin = await Admin.findById(res.locals.data.id);
    if (!admin) {
      let error = new Error("Admin Doesn't exists");
      error.status = 401;
      throw error;
    }
    next();
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

exports.verifySuperAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(res.locals.data.id);
    if (!admin) {
      let error = new Error("Admin Doesn't exists");
      error.status = 401;
      throw error;
    }
    if(admin.role !== "superadmin"){
      let error = new Error("You are not authorized")
      error.status = 401
      throw error
    }
    next();
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
