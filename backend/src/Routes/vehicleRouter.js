const {Router} = require("express");
const vehicleController = require("../Controllers/vehicleController");

const router = Router();

router.post("/create", vehicleController.createVehicle);
router.put("/update/:idVehicle", vehicleController.updateVehicle);
router.get("/getById/:idVehicle", vehicleController.getVehicleById);
router.delete("/delete/:idVehicle", vehicleController.deleteVehicle);
router.get("/getAll", vehicleController.getAllVehicles);
router.get("/getByType/:typeVehicle", vehicleController.getVehiclesByType);
router.get("/getByPlate/:plateVehicle", vehicleController.getVehiclesByPlate);

module.exports = router;