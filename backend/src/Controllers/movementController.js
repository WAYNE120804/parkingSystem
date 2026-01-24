const movementService = require("../Services/movementService");
const { z } = require("zod");

const registerEntrySchema = z.object({
  plate: z.string().min(3).max(10).transform(s => s.toUpperCase()),
  typeVehicle: z.enum(["CAR", "MOTO"]),
  entryUserId: z.coerce.number().int().positive(),
  notes: z.string().optional()
});

const exitMovementSchema = z.object({
  exitUserId: z.coerce.number().int().positive(),
  paidByUserId: z.coerce.number().int().positive(),
  method: z.enum(["CASH", "CARD", "TRANSFER", "NEQUI", "DAVIPLATA"])
});

//crear entrada
exports.registerEntry = async (req, res) => {
  const parsed = registerEntrySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Datos inválidos",
      details: parsed.error.issues
    });
  }

  try {
    const movement = await movementService.registerEntry(parsed.data);
    return res.status(201).json(movement);
  } catch (error) {
    if (error.code === "ACTIVE_MOVEMENT") {
      return res.status(409).json({ error: error.message });
    }

    if (error.code === "RATE_NOT_FOUND") {
      return res.status(503).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};


// registrar salida
exports.exitMovement = async (req, res) => {
  const movementId = Number(req.params.movementId);
  if (isNaN(movementId)) {
    return res.status(400).json({ error: "movementId inválido" });
  }

  const parsed = exitMovementSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.issues });
  }

  try {
    const movement = await movementService.exitMovement({ movementId, ...parsed.data });
    return res.json(movement);
  } catch (error) {
    if (error.code === "INVALID_EXIT" || error.code === "PAYMENT_EXISTS") {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === "MOVEMENT_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
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

// Obtener movimientos activos
exports.getActiveMovements = async (_req, res) => {
  try {
    const movements = await movementService.getActiveMovements();   
    return res.json(movements);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } 
};


// Obtener movimiento por ID
exports.getMovementById = async (req, res) => {
  const idMovement = Number(req.params.idMovement);
    if (isNaN(idMovement)) {
    return res.status(400).json({ error: "idMovement inválido" });
  }
    try {   
    const movement = await movementService.getMovementById(idMovement);
    return res.json(movement);
  } catch (error) {
    if (error.code === "MOVEMENT_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};


// Obtener movimiento por ticket
exports.getMovementByTicket = async (req, res) => {
  const ticketNumber = req.params.ticketNumber; 
    try {   
    const movement = await movementService.getMovementByTicket(ticketNumber);
    return res.json(movement);
  } catch (error) {
    if (error.code === "MOVEMENT_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};


// Filtrar movimientos activos por placa
exports.getActiveMovementsByPlate = async (req, res) => {
  const plate = req.params.plate.toUpperCase();
  try {
    const movements = await movementService.getActiveMovementsByPlate(plate);
    return res.json(movements);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Cancelar movimiento activo (solo ADMIN)
exports.cancelActiveMovement = async (req, res) => {
    const movementId = Number(req.params.movementId);
    const canceledByUserId = Number(req.body.canceledByUserId);
    const reason = req.body;

    if (isNaN(movementId) || isNaN(canceledByUserId)) {
    return res.status(400).json({ error: "movementId o canceledByUserId inválido" });
  }
    try {   
    const movement = await movementService.cancelActiveMovement({ idMovement: movementId, canceledByUserId, reason });
    return res.json(movement);
  } catch (error) {
    if (error.code === "INVALID_CANCEL") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

