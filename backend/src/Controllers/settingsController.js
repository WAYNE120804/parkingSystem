const path = require("path");
const settingsService = require("../Services/settingsService");

exports.getLogo = async (_req, res) => {
  try {
    const logoUrl = await settingsService.getLogoUrl();
    res.json({ logoUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadLogo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Archivo requerido" });
  }

  try {
    const filename = req.file.filename;
    const currentLogoUrl = await settingsService.getLogoUrl();
    const uploadsDir = exports.buildUploadPath();
    await settingsService.removePreviousLogo(currentLogoUrl, uploadsDir, filename);
    const logoUrl = `/uploads/${filename}?v=${Date.now()}`;
    await settingsService.updateLogoUrl(logoUrl);
    res.json({ logoUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminGuard = (req, res, next) => {
  const role = req.header("x-user-role");
  if (role !== "ADMIN") {
    return res.status(403).json({ error: "Solo ADMIN puede actualizar el logo" });
  }
  return next();
};

exports.buildUploadPath = () => path.join(__dirname, "..", "..", "uploads");
