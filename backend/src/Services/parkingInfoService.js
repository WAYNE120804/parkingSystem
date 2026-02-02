const prisma = require("../lib/prisma");

//crear informacion del parqueadero
 exports.createParkingInfo = async ({ parkingName, nit, address, responsible, footerMessage }) => {
    return prisma.parkingInfo.create({
        data: {
            parkingName,
            nit,
            address,
            responsible,
            footerMessage
        }
    });
}

//obtener informacion del parqueadero
   exports.getParkingInfo = async () => {
  const parkingInfo = await prisma.parkingInfo.findFirst();
  return parkingInfo || null;
};

//actualizar informacion del parqueadero
    exports.updateParkingInfo = async (id, data) => {
    const parkingInfo = await prisma.parkingInfo.update({
        where: { id },
        data
    });
    if (!parkingInfo) {
        const error = new Error("Informacion del parqueadero no encontrada");
        error.code = "PARKING_INFO_NOT_FOUND";
        throw error;
    }
    return parkingInfo;
}
