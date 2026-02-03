const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const rates = [
    { vehicleType: "CAR", pricePerHourCents: 3000 },
    { vehicleType: "MOTO", pricePerHourCents: 2000 }
  ];

  for (const r of rates) {
    await prisma.rate.upsert({
      where: { vehicleType: r.vehicleType },
      update: { pricePerHourCents: r.pricePerHourCents },
      create: r
    });
  }

  console.log("Tarifas iniciales creadas/actualizadas");

  await prisma.settings.upsert({
    where: { id: 1 },
    update: { logoUrl: "/uploads/logo.png" },
    create: { id: 1, logoUrl: "/uploads/logo.png" }
  });

  console.log("Configuración inicial creada/actualizada");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
