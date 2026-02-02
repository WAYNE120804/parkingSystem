-- CreateTable
CREATE TABLE "ParkingInfo" (
    "idParkingInfo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parkingName" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "footerMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
