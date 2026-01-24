const rateService = require("../Services/rateService");
const { z } = require("zod");

const rateSchema = z.object({
  vehicleType: z.enum(["CAR", "MOTO"]),
  pricePerHourCents: z.coerce.number().int().positive()
});

// Crear tarifa
exports.createRate = async (req, res) => {
  const parsed = rateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos invalidos", details: parsed.error.issues });
  }

  try {
    const rate = await rateService.createRate(parsed.data);
    return res.status(201).json(rate);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Ya existe una tarifa para este tipo de vehiculo" });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Obtener tarifa por ID
exports.getRateById = async (req, res) => {
  const idRate = Number(req.params.idRate);
  if (isNaN(idRate)) {
    return res.status(400).json({ error: "idRate invalido" });
  }

  try {
    const rate = await rateService.getRateById(idRate);
    return res.json(rate);
  } catch (error) {
    if (error.code === "RATE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Listar todas las tarifas
exports.getAllRates = async (_req, res) => {
  try {
    const rates = await rateService.getAllRates();
    return res.json(rates);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Actualizar tarifa
exports.updateRate = async (req, res) => {
  const idRate = Number(req.params.idRate);
  if (isNaN(idRate)) {
    return res.status(400).json({ error: "idRate invalido" });
  }

  const parsed = rateSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos invalidos", details: parsed.error.issues });
  }

  try {
    const rate = await rateService.updateRate(idRate, parsed.data);
    return res.json(rate);
  } catch (error) {
    if (error.code === "RATE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Ya existe una tarifa para este tipo de vehiculo" });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar tarifa
exports.deleteRate = async (req, res) => {
  const idRate = Number(req.params.idRate);
  if (isNaN(idRate)) {
    return res.status(400).json({ error: "idRate invalido" });
  }

  try {
    await rateService.deleteRate(idRate);
    return res.status(204).send();
  } catch (error) {
    if (error.code === "RATE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Obtener tarifa por tipo de vehiculo
exports.getRateByVehicleType = async (req, res) => {
  const vehicleType = req.params.vehicleType;

  if (!["CAR", "MOTO"].includes(vehicleType)) {
    return res.status(400).json({ error: "vehicleType invalido" });
  }

  try {
    const rate = await rateService.getRateByVehicleType(vehicleType);
    return res.json(rate);
  } catch (error) {
    if (error.code === "RATE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
