-- CreateTable
CREATE TABLE "User" (
    "idUser" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameUser" TEXT NOT NULL,
    "roleUser" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "idVehicle" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plateVehicle" TEXT NOT NULL,
    "typeVehicle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Movement" (
    "idMovement" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entryTime" DATETIME NOT NULL,
    "exitTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'IN',
    "ticketNumber" TEXT,
    "notes" TEXT,
    "vehicleId" INTEGER NOT NULL,
    "entryUserId" INTEGER NOT NULL,
    "exitUserId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Movement_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("idVehicle") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Movement_entryUserId_fkey" FOREIGN KEY ("entryUserId") REFERENCES "User" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Movement_exitUserId_fkey" FOREIGN KEY ("exitUserId") REFERENCES "User" ("idUser") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "idPayment" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amountCents" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "paidAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "movementId" INTEGER NOT NULL,
    "paidByUserId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movement" ("idMovement") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_paidByUserId_fkey" FOREIGN KEY ("paidByUserId") REFERENCES "User" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateVehicle_key" ON "Vehicle"("plateVehicle");

-- CreateIndex
CREATE UNIQUE INDEX "Movement_ticketNumber_key" ON "Movement"("ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_movementId_key" ON "Payment"("movementId");
