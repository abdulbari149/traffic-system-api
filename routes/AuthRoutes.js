const { Router } = require("express");
const { body } = require("express-validator");
const router = Router({ mergeParams: true });
const fs = require("fs/promises");
const path = require("path");
const { AuthController } = require("../controllers");
const {
  loginValidator,
  forgetPasswordValidator,
  changePasswordValidator,
  registerValidator,
  citizenRegisterValidator,
  wardenRegisterValidator,
  createAdminValidator
} = require("../helpers/validators");
const { verifyAuthToken } = require("../middlewares/authTokenVerification");
const { accessDB } = require("../middlewares/conditionalAccess");
const {
  validationRequestSchema
} = require("../middlewares/validationRequestSchema");
const { verifySuperAdmin } = require("../middlewares/verifyAdmin");

router.use(accessDB);

router.post(
  "/register",
  registerValidator(),
  validationRequestSchema,
  AuthController.register
);

router.post(
  "/login",
  loginValidator(),
  validationRequestSchema,
  AuthController.login
);

router.post("/verify-sms", AuthController.sendVerificationCode);

router.post(
  "/forget-password",
  forgetPasswordValidator(),
  validationRequestSchema,
  AuthController.forgetPassword
);

router.post(
  "/check-user",
  body("email").isEmail(),
  validationRequestSchema,
  AuthController.checkUserExists
);

router.post("/verify-auth", verifyAuthToken, (req, res) => {
  res.send({
    message: "you can access the application",
    data: { loggedIn: true, ...res.locals.data },
    status: 200
  });
});

router.put(
  "/change-password",
  changePasswordValidator(),
  validationRequestSchema,
  verifyAuthToken,
  AuthController.changePassword
);

router.post(
  "/create-admin",
  createAdminValidator(),
  validationRequestSchema,
  verifyAuthToken,
  verifySuperAdmin,
  AuthController.registerAdmin
);
router.post("/logout", AuthController.logout)
module.exports = router;
