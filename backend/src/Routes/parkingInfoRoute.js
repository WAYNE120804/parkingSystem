const { Router } = require("express");
const parkingInfoController = require("../Controllers/parkingInfoController");

const router = Router();

router.post("/createParkingInfo", parkingInfoController.createParkingInfo);
router.get("/getParkingInfo", parkingInfoController.getParkingInfo);
router.put("/updateParkingInfo/:id", parkingInfoController.updateParkingInfo);

module.exports = router;