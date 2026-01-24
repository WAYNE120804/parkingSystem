const prisma = require("../lib/prisma");

//crear un vehiculo
exports.createVehicle = async ({ plateVehicle, typeVehicle }) => {
  return prisma.vehicle.create({
    data: {
      plateVehicle,
      typeVehicle
    }
  });
};

//buscar vehiculo por ID
exports.getVehicleById = async (idVehicle) => {
    const vehicle = await prisma.vehicle.findUnique({
      where: { idVehicle }
    });
    if (!vehicle) {
      const error = new Error("Vehículo no encontrado");
      error.code = "VEHICLE_NOT_FOUND";
      throw error;
    }   
    return vehicle;
  }

//listar todos los vehiculos
exports.getAllVehicles = async () => {
  return prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" }
  });
};

//actualizar vehiculo
exports.updateVehicle = async (idVehicle, data) => {
  const vehicle = await prisma.vehicle.update({
    where: { idVehicle },
    data
  });
    if (!vehicle) {
        const error = new Error("Vehículo no encontrado");
        error.code = "VEHICLE_NOT_FOUND";
        throw error;
      } 
    return vehicle;
};

//eliminar vehiculo
exports.deleteVehicle = async (idVehicle) => {
  const vehicle = await prisma.vehicle.delete({
    where: { idVehicle }
  });   
    if (!vehicle) {
        const error = new Error("Vehículo no encontrado");
        error.code = "VEHICLE_NOT_FOUND";
        throw error;
      }
    return vehicle;
};

//filtrar vehiculos por tipo
exports.getVehiclesByType = async (typeVehicle) => {
  return prisma.vehicle.findMany({
    where: { typeVehicle },
    orderBy: { createdAt: "desc" }
  });
};

//buscar vehiculos por placa
exports.getVehiclesByPlate = async (plateVehicle) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { plateVehicle }
  });
    if (!vehicle) {
        const error = new Error("Vehículo no encontrado");
        error.code = "VEHICLE_NOT_FOUND";
        throw error;
      }
    return vehicle;
};

//