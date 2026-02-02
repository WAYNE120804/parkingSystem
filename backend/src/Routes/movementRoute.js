const { Router } = require("express");
const movementController = require("../Controllers/movementController");

const router = Router();

router.post("/registerEntry", movementController.registerEntry);
router.post("/exitMovement/:movementId", movementController.exitMovement);

router.get("/activeMovements", movementController.getActiveMovements);
router.get("/activeMovements/plate/:plate", movementController.getActiveMovementsByPlate);

router.post("/cancelMovement/:movementId", movementController.cancelActiveMovement);

router.get("/getById/:idMovement", movementController.getMovementById);
router.get("/getByTicket/:ticketNumber", movementController.getMovementByTicket);

router.get("/getAllMovements", movementController.getAllMovements);


module.exports = router;
