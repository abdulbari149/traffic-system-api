const { Router } = require("express")
const { VehicleController } = require("../controllers")
const { verifyAuthToken } = require("../middlewares/authTokenVerification")

const router = Router()
router.use(verifyAuthToken)
// -> /api/vechile/getVechileByCNIC
router.get("/getVechileByCNIC", VehicleController.getVehiclesByCitizenCnic)

// -> /api/vehicle/getVechileByRegNo
router.get("/getVehicleByRegNo", VehicleController.getVehicleByRegNo)
// -> /api/vehicle/addNewVehicle

router.post("/addNewVehicle",VehicleController.addNewVehicle)

// -> /api/vehicle/updateVehicle/reg_no

router.put("/updateVehicle/:reg_no",  VehicleController.updateVehicleByRegNo)


router.delete("/deleteVehicle/:reg_no", VehicleController.deleteVehicleByRegNo )

module.exports = router