const prisma = require("../lib/prisma");
const paymentService = require("./paymentService");

function generateTicketNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `PK-${date}-${random}`;
}

// Registrar ENTRADA
exports.registerEntry = async ({ plate, typeVehicle, entryUserId, notes }) => {
  const plateUpper = plate.toUpperCase();

  //  Crear o reutilizar vehículo (SIN actualizar)
  const vehicle = await prisma.vehicle.upsert({
    where: { plateVehicle: plateUpper },
    update: {},
    create: {
      plateVehicle: plateUpper,
      typeVehicle
    }
  });

  //  Validar que no tenga entrada activa
  const active = await prisma.movement.findFirst({
    where: {
      vehicleId: vehicle.idVehicle,
      status: "IN"
    }
  });

  if (active) {
    const error = new Error("El vehículo ya tiene una entrada activa");
    error.code = "ACTIVE_MOVEMENT";
    throw error;
  }

  // Obtener tarifa según tipo
  const rate = await prisma.rate.findUnique({
    where: { vehicleType: vehicle.typeVehicle }
  });

  if (!rate) {
    const error = new Error("No hay tarifa configurada para este tipo de vehículo");
    error.code = "RATE_NOT_FOUND";
    throw error;
  }

  // Crear movement
  return prisma.movement.create({
    data: {
      vehicleId: vehicle.idVehicle,
      entryUserId,
      entryTime: new Date(),
      status: "IN",
      ticketNumber: generateTicketNumber(),
      notes: notes ?? null
    },
    include: {
      vehicle: true,
      entryUser: true
    }
  });
};



// Registrar SALIDA
exports.exitMovement = async ({ movementId, exitUserId, paidByUserId, method }) => {
  // Delegamos la salida y creación de pago al servicio de pagos
  const { movement } = await paymentService.payMovement({
    movementId,
    exitUserId,
    paidByUserId,
    method
  });
  return movement;
};

// Obtener movimientos activos
exports.getActiveMovements = async () => {
  return prisma.movement.findMany({
    where: { status: "IN" },
    include: { vehicle: true, entryUser: true },
    orderBy: { entryTime: "desc" }
  });
};

// Obtener movimiento por ID
exports.getMovementById = async (idMovement) => {
  const movement = await prisma.movement.findUnique({
    where: { idMovement },
    include: { vehicle: true, entryUser: true, exitUser: true, payment: true }
  });

  if (!movement) {
    const error = new Error("Movimiento no encontrado");
    error.code = "MOVEMENT_NOT_FOUND";
    throw error;
  }

  return movement;
};

// Obtener movimiento por ticket
exports.getMovementByTicket = async (ticketNumber) => {
  const movement = await prisma.movement.findUnique({
    where: { ticketNumber },
    include: { vehicle: true, entryUser: true, exitUser: true, payment: true }
  });

  if (!movement) {
    const error = new Error("Movimiento no encontrado");
    error.code = "MOVEMENT_NOT_FOUND";
    throw error;
  }

  return movement;
};

// Filtrar movimientos activos por placa
exports.getMovementsByPlateActive = async (plateVehicle) => {
  const plate = plateVehicle.toUpperCase();

  const movements = await prisma.movement.findMany({
    where: {
      status: "IN",
      vehicle: { plateVehicle: plate }
    },
    include: { vehicle: true, entryUser: true },
    orderBy: { entryTime: "desc" }
  });

  return movements; // puedes decidir si devuelves [] o lanzas error si no hay
};

// Alias para mantener compatibilidad con el controlador
exports.getActiveMovementsByPlate = exports.getMovementsByPlateActive;

// Cancelar movimiento activo (solo ADMIN)
exports.cancelActiveMovement = async ({ idMovement, canceledByUserId, reason }) => {
  const user = await prisma.user.findUnique({
    where: { idUser: canceledByUserId }
  });

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  if (user.roleUser !== "ADMIN") {
    const error = new Error("Solo un ADMIN puede cancelar movimientos");
    error.code = "FORBIDDEN";
    throw error;
  }

  const movement = await prisma.movement.findUnique({
    where: { idMovement }
  });

  if (!movement || movement.status !== "IN") {
    const error = new Error("Movimiento no válido para cancelar");
    error.code = "INVALID_CANCEL";
    throw error;
  }

  return prisma.movement.update({
    where: { idMovement },
    data: {
      status: "CANCELED",
      notes: reason ? `CANCELADO: ${reason}` : movement.notes
    },
    include: { vehicle: true, entryUser: true, exitUser: true, payment: true }
  });
};
