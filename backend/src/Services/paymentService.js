const prisma = require("../lib/prisma");

const MS_PER_HOUR = 1000 * 60 * 60;

function calculateRoundedHours(entryTime, exitTime) {
  const diffMs = exitTime.getTime() - entryTime.getTime();
  const rawHours = Math.ceil(diffMs / MS_PER_HOUR);
  return Math.max(rawHours, 1);
}

// Registrar pago y salida del movimiento en una sola transacción
exports.payMovement = async ({ movementId, exitUserId, paidByUserId, method }) => {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const movement = await tx.movement.findUnique({
      where: { idMovement: movementId },
      include: { vehicle: true, payment: true }
    });

    if (!movement) {
      const error = new Error("Movimiento no encontrado");
      error.code = "MOVEMENT_NOT_FOUND";
      throw error;
    }

    if (movement.status !== "IN") {
      const error = new Error("Movimiento no válido para salida");
      error.code = "INVALID_EXIT";
      throw error;
    }

    if (movement.payment) {
      const error = new Error("El movimiento ya tiene un pago registrado");
      error.code = "PAYMENT_EXISTS";
      throw error;
    }

    const rate = await tx.rate.findUnique({
      where: { vehicleType: movement.vehicle.typeVehicle }
    });

    if (!rate) {
      const error = new Error("No hay tarifa configurada para este tipo de vehículo");
      error.code = "RATE_NOT_FOUND";
      throw error;
    }

    const hours = calculateRoundedHours(movement.entryTime, now);
    const amountCents = hours * rate.pricePerHourCents;

    await tx.movement.update({
      where: { idMovement: movementId },
      data: {
        exitTime: now,
        exitUserId,
        status: "OUT"
      }
    });

    const payment = await tx.payment.create({
      data: {
        movementId,
        paidByUserId,
        method,
        amountCents,
        ratePerHourCents: rate.pricePerHourCents
      }
    });

    const movementWithPayment = await tx.movement.findUnique({
      where: { idMovement: movementId },
      include: { vehicle: true, entryUser: true, exitUser: true, payment: true }
    });

    return { movement: movementWithPayment, payment };
  });
};

// Obtener pago por ID
exports.getPaymentById = async (idPayment) => {
  const payment = await prisma.payment.findUnique({
    where: { idPayment },
    include: { movement: true, paidByUser: true }
  });

  if (!payment) {
    const error = new Error("Pago no encontrado");
    error.code = "PAYMENT_NOT_FOUND";
    throw error;
  }

  return payment;
};

// Listar todos los pagos
exports.getAllPayments = async () => {
  return prisma.payment.findMany({
    orderBy: { paidAt: "desc" },
    include: { movement: true, paidByUser: true }
  });
};

// Obtener pago por movimiento
exports.getPaymentByMovementId = async (movementId) => {
  const payment = await prisma.payment.findUnique({
    where: { movementId },
    include: { movement: true, paidByUser: true }
  });

  if (!payment) {
    const error = new Error("Pago no encontrado para el movimiento");
    error.code = "PAYMENT_NOT_FOUND";
    throw error;
  }

  return payment;
};
