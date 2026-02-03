const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-role"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rutas
const userRoutes = require("./Routes/userRoute");
const vehicleRoutes = require("./Routes/vehicleRouter");
const movementRoutes = require("./Routes/movementRoute");
const rateRoutes = require("./Routes/rateRoute");
const paymentRoutes = require("./Routes/paymentRoute");
const parkingInfoRoutes = require("./Routes/parkingInfoRoute");
const settingsRoutes = require("./Routes/settingsRoute");

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Rutas de usuarios
app.use("/users", userRoutes);

// Rutas de vehículos
app.use("/vehicles", vehicleRoutes);

//rutas de movimientos
app.use("/movements", movementRoutes);

// rutas de tarifas
app.use("/rates", rateRoutes);

// rutas de pagos
app.use("/payments", paymentRoutes);

//ruta de informacion del parqueadero
app.use("/parkingInfo", parkingInfoRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${PORT}`);
});
