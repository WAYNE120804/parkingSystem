const prisma = require("../lib/prisma");

// Crear una tarifa
exports.createRate = async ({ vehicleType, pricePerHourCents }) => {
  return prisma.rate.create({
    data: {
      vehicleType,
      pricePerHourCents
    }
  });
};

// Obtener tarifa por ID
exports.getRateById = async (idRate) => {
  const rate = await prisma.rate.findUnique({
    where: { idRate }
  });

  if (!rate) {
    const error = new Error("Tarifa no encontrada");
    error.code = "RATE_NOT_FOUND";
    throw error;
  }

  return rate;
};

// Listar todas las tarifas
exports.getAllRates = async () => {
  return prisma.rate.findMany({
    orderBy: { createdAt: "desc" }
  });
};

// Actualizar tarifa
exports.updateRate = async (idRate, data) => {
  try {
    const rate = await prisma.rate.update({
      where: { idRate },
      data
    });

    return rate;
  } catch (error) {
    if (error.code === "P2025") {
      const notFound = new Error("Tarifa no encontrada");
      notFound.code = "RATE_NOT_FOUND";
      throw notFound;
    }
    throw error;
  }
};

// Eliminar tarifa
exports.deleteRate = async (idRate) => {
  try {
    const rate = await prisma.rate.delete({
      where: { idRate }
    });

    return rate;
  } catch (error) {
    if (error.code === "P2025") {
      const notFound = new Error("Tarifa no encontrada");
      notFound.code = "RATE_NOT_FOUND";
      throw notFound;
    }
    throw error;
  }
};

// Obtener tarifa por tipo de vehiculo
exports.getRateByVehicleType = async (vehicleType) => {
  const rate = await prisma.rate.findUnique({
    where: { vehicleType }
  });

  if (!rate) {
    const error = new Error("Tarifa no encontrada");
    error.code = "RATE_NOT_FOUND";
    throw error;
  }

  return rate;
};
