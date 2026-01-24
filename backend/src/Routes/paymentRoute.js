const { Router } = require("express");
const paymentController = require("../Controllers/paymentController");

const router = Router();

router.post("/payMovement/:movementId", paymentController.payMovement);
router.get("/getById/:idPayment", paymentController.getPaymentById);
router.get("/getAll", paymentController.getAllPayments);
router.get("/getByMovement/:movementId", paymentController.getPaymentByMovementId);

module.exports = router;
