const vehicleService = require("../Services/vehicleService");
const { z } = require("zod");

const vehicleSchema = z.object({ 
    plateVehicle: z.string().min(5).max(6)
    ,typeVehicle: z.enum(["CAR", "MOTO"])
});

//crear un vehiculo
exports.createVehicle = async (req, res) => {
    try {
        const validatedData = vehicleSchema.parse(req.body);
        const vehicle = await vehicleService.createVehicle(validatedData);
        res.status(201).json(vehicle);
    } catch (error) {
        if (error.code === "VEHICLE_NOT_FOUND") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Datos inválidos" });
        }
    }
};


//actualizar vehiculo
exports.updateVehicle = async (req, res) => {
    try {
        const { idVehicle } = req.params;   
        const validatedData = vehicleSchema.parse(req.body);
        const vehicle = await vehicleService.updateVehicle(parseInt(idVehicle), validatedData);
        res.status(200).json(vehicle);
    } catch (error) {
        if (error.code === "VEHICLE_NOT_FOUND") {
            res.status(404).json({ error: error.message }); 
        } else {
            res.status(400).json({ error: "Datos inválidos" });
        }   
    }
};

//buscar vehiculo por ID
exports.getVehicleById = async (req, res) => {
    try {
        const { idVehicle } = req.params;   
        const vehicle = await vehicleService.getVehicleById(parseInt(idVehicle));
        res.status(200).json(vehicle);
    } catch (error) {
        if (error.code === "VEHICLE_NOT_FOUND") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Datos inválidos" });
        }
    }
}

//eliminar vehiculo
exports.deleteVehicle = async (req, res) => {
    try {
        const { idVehicle } = req.params;   
        const vehicle = await vehicleService.deleteVehicle(parseInt(idVehicle));
        res.status(200).json(vehicle);
    } catch (error) {
        if (error.code === "VEHICLE_NOT_FOUND") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Datos inválidos" });
        }
};
    return prisma.vehicle.findMany({
    where: { typeVehicle },
    orderBy: { createdAt: "desc" }
  });
}

//listar todos los vehiculos
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await vehicleService.getAllVehicles(); 
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(400).json({ error: "Datos inválidos" });
    }
};

//filtrar vehiculos por tipo
exports.getVehiclesByType = async (req, res) => {
    try {
        const { typeVehicle } = req.params;
        const vehicles = await vehicleService.getVehiclesByType(typeVehicle);
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(400).json({ error: "Datos inválidos" });
    }   
};

//buscar vehiculo por placa
exports.getVehiclesByPlate = async (req, res) => {
    try {
        const { plateVehicle } = req.params;    
        const vehicles = await vehicleService.getVehiclesByPlate(plateVehicle);
        res.status(200).json(vehicles);
    } catch (error) {
        if (error.code === "VEHICLE_NOT_FOUND") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Datos inválidos" });
        }
    };
};

