const parkingInfo = require("../Services/parkingInfoService");
const { z } = require("zod");

const parkingInfoSchema = z.object({
  parkingName : z.string().min(2),
  nit : z.string().min(5),
  address : z.string().min(5),
  responsible : z.string().min(5),
  footerMessage : z.string().min(2)
});

exports.createParkingInfo = async (req, res) => {
  const parsed = parkingInfoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  } 
    try {
    const info = await parkingInfo.createParkingInfo(parsed.data);
    res.status(201).json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParkingInfo = async (_req, res) => {
  try {
    const info = await parkingInfo.getParkingInfo();
    if (!info) {
      return res.status(404).json({ error: "No hay información registrada" });
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateParkingInfo = async (req, res) => {
  const id = Number(req.params.id);
    if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }
    const parsed = parkingInfoSchema.partial().safeParse(req.body);
    if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
    try {
    const info = await parkingInfo.updateParkingInfo(id, parsed.data);
    res.json(info);
  } catch (error) {
    if (error.code === "PARKING_INFO_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};