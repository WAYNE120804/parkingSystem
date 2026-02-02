const paymentService = require("../Services/paymentService");
const { z } = require("zod");

const payMovementSchema = z.object({
  exitUserId: z.coerce.number().int().positive(),
  paidByUserId: z.coerce.number().int().positive(),
  method: z.enum(["CASH", "CARD", "TRANSFER", "NEQUI", "DAVIPLATA"])
});

// Registrar pago y salida
exports.payMovement = async (req, res) => {
  const movementId = Number(req.params.movementId);
  if (isNaN(movementId)) {
    return res.status(400).json({ error: "movementId inválido" });
  }

  const parsed = payMovementSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.issues });
  }

  try {
    const result = await paymentService.payMovement({
      movementId,
      ...parsed.data
    });
    return res.status(201).json(result);
  } catch (error) {
    if (error.code === "MOVEMENT_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    if (error.code === "INVALID_EXIT" || error.code === "PAYMENT_EXISTS") {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === "RATE_NOT_FOUND") {
      return res.status(503).json({ error: error.message });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Referencias de usuario inválidas" });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Obtener pago por ID
exports.getPaymentById = async (req, res) => {
  const idPayment = Number(req.params.idPayment);
  if (isNaN(idPayment)) {
    return res.status(400).json({ error: "idPayment inválido" });
  }

  try {
    const payment = await paymentService.getPaymentById(idPayment);
    return res.json(payment);
  } catch (error) {
    if (error.code === "PAYMENT_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Listar pagos
exports.getAllPayments = async (_req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener pago por movimiento
exports.getPaymentByMovementId = async (req, res) => {
  const movementId = Number(req.params.movementId);
  if (isNaN(movementId)) {
    return res.status(400).json({ error: "movementId inválido" });
  }

  try {
    const payment = await paymentService.getPaymentByMovementId(movementId);
    return res.json(payment);
  } catch (error) {
    if (error.code === "PAYMENT_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};



// Endpoint para calcular el pago sin registrar salida
exports.previewPayment = async (req, res) => {
  const { movementId } = req.params;

  try {
    const preview = await paymentService.calculatePreviewPayment(Number(movementId));
    res.json(preview);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Endpoint para registrar salida y pago
exports.exitMovement = async (req, res) => {
  const { movementId } = req.body;
  const { exitUserId, paidByUserId, method } = req.body;

  try {
    const movement = await paymentService.payMovement({
      movementId,
      exitUserId,
      paidByUserId,
      method
    });
    res.json(movement);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};