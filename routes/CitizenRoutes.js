const { Router } = require("express");
const { CitizenController } = require("../controllers");
const router = Router();
router.get(
  "/get-citizen-by-cnic",
  CitizenController.getCitizenByCNIC
);

module.exports = router;
