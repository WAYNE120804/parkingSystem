const { Router } = require("express");
const rateController = require("../Controllers/rateController");

const router = Router();

router.post("/create", rateController.createRate);
router.get("/getById/:idRate", rateController.getRateById);
router.get("/getAll", rateController.getAllRates);
router.put("/update/:idRate", rateController.updateRate);
router.delete("/delete/:idRate", rateController.deleteRate);
router.get("/getByVehicleType/:vehicleType", rateController.getRateByVehicleType);

module.exports = router;
