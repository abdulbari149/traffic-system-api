const { Router } = require("express");
const { VoilationController } = require("../controllers");
const router = Router();

router
  .route("/")
  .get(VoilationController.getVoilations)
  .post(VoilationController.addVoilation);

router.post("/update-price", VoilationController.updateVoiationPrice)

module.exports = router;
