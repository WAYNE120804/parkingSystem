const prisma = require("../lib/prisma");
const path = require("path");
const fs = require("fs/promises");

const DEFAULT_LOGO_URL = "/uploads/logo.png";

async function ensureSettings() {
  const existing = await prisma.settings.findFirst();
  if (existing) {
    return existing;
  }
  return prisma.settings.create({
    data: { logoUrl: DEFAULT_LOGO_URL }
  });
}

exports.getLogoUrl = async () => {
  const settings = await ensureSettings();
  return settings.logoUrl;
};

exports.updateLogoUrl = async (newLogoUrl) => {
  const settings = await ensureSettings();
  return prisma.settings.update({
    where: { id: settings.id },
    data: { logoUrl: newLogoUrl }
  });
};

exports.removePreviousLogo = async (currentLogoUrl, uploadsDir, nextFilename) => {
  if (!currentLogoUrl || currentLogoUrl === DEFAULT_LOGO_URL) {
    return;
  }
  const currentFile = currentLogoUrl.split("?")[0].replace("/uploads/", "");
  if (!currentFile || currentFile === nextFilename) {
    return;
  }
  const currentPath = path.join(uploadsDir, currentFile);
  try {
    await fs.unlink(currentPath);
  } catch {
    // ignore if file does not exist
  }
};
