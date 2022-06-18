const { body, check, param } = require("express-validator");
const { Warden } = require("../models");

exports.registerValidator = () => [
  check("cnic_no")
    .if(param("user").equals("citizen"))
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("The CNIC must not be empty")
    .isString()
    .custom((value) => {
      if (!value.match(new RegExp("^[0-9]{5}-[0-9]{7}-[0-9]$"))) {
        throw new Error("CNIC No must follow the XXXXX-XXXXXXX-X format!");
      }
      return value;
    }),
  check("service_id")
    .if(param("user").equals("warden"))
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("The Service Id must not be empty")
    .isString(),
  check("traffic_sector")
    .if(param("user").equals("warden"))
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("The Traffic Sector must not be empty")
    .isString(),
  check("designation")
    .if(param("user").equals("warden"))
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("The Designation must not be empty")
    .matches(/\b(?:SSP|SHO|DSP|Inspector|Sub-Inspector)\b/),
  body("email").isEmail(),
  check("password")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("Password field is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be equal to or greater than 8 character")
    .isStrongPassword({
      minLowercase: 2,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1
    })
    .withMessage(
      "Password is too weak. Please add at least 1 uppercase, 2 lowercase, 1 number and 1 symbol"
    ),
  check("confirm_password", "Invalid Confirm Password ")
    .exists({ checkNull: true })
    .withMessage("Confirm Password field is required")
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Confirm pasword should be same as Password");
      }
      return value;
    }),
  check("role")
    .if(param("user").equals("admin"))
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Role is required")
    .isString()
    .matches(/superadmin|admin/),
  check("phone_number")
    .if(param("user").matches(/warden|citizen/))
    .isMobilePhone(["en-PK"], { strict: true })
    .withMessage("You haven't entered a valid phone number")
    .custom((value) => {
      if (!value.startsWith("+92")) {
        throw new Error(
          "Please Provide a valid phone number located in Pakistan"
        );
      }
      return value;
    })
];

exports.loginValidator = () => [
  param("user").custom((userValue) => {
    if (userValue === "citizen") {
      check("cnic_no")
        .exists({ checkFalsy: true, checkNull: true })
        .withMessage("The CNIC must not be empty")
        .isString()
        .custom((value) => {
          if (!value.match(new RegExp("^[0-9]{5}-[0-9]{7}-[0-9]$"))) {
            throw new Error("CNIC No must follow the XXXXX-XXXXXXX-X format!");
          }
          return value;
        });
    } else if (userValue === "warden") {
      check("email")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Please provide with an email address")
        .isEmail();
    }
    return userValue;
  }),

  check("password")
    .not()
    .isEmpty()
    .withMessage("Please provide with a valid password")
];

exports.forgetPasswordValidator = () => [
  check("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide with an email address")
    .isEmail()
];

exports.changePasswordValidator = () => [
  check("password")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("Password field is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be equal to or greater than 8 character")
    .isStrongPassword({
      minLowercase: 2,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 2
    })
    .withMessage(
      "Password is too weak. Please add at least 1 uppercase, 2 lowercase, 1 number and 1 symbol"
    ),
  check("confirm_password", "Invalid Confirm Password ")
    .exists({ checkNull: true })
    .withMessage("Confirm Password field is required")
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Confirm pasword should be same as Password");
      }
      return value;
    })
];

exports.challanValidator = () => [
  check(["voilation", "citizen"]).not().isEmpty().isMongoId(),
  check("psid_no")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("PSID NO is required"),
  check(["division", "place_of_voilation", "district", "province"])
    .exists({ checkFalsy: true, checkNull: true })
    .not()
    .isEmpty(),
  check("vehicle_registration_no")
    .not()
    .isEmpty()
    .withMessage("Provide a vehicle Registration Number"),
  check("fine_imposed").isNumeric()
];

exports.authorizeValidator = () => [
  check("wardenId").exists({ checkFalsy: true, checkNull: true }).isMongoId()
];
exports.createAdminValidator = () => [
  check("name").not().isEmpty().isLength({ min: 3, max: 50 }),
  check("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide with an email address")
    .isEmail(),
  check("password")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("Password field is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be equal to or greater than 8 character")
];
